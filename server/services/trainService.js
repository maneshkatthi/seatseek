const railwayService = require('./railwayService');
const apiService = require('./apiService');
const cache = require('../cache/nodeCache');
const supabase = require('../database/supabase');

/**
 * Get Train Live Status
 * Priority: RapidAPI (Real-time) -> Scraper (Fallback) -> Mock
 */
const getLiveStatus = async (trainNo, requestedDate) => {
  const cacheKey = `live_api_${trainNo}_${requestedDate || 'auto'}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) return cachedData;

  const tryApiWithDate = async (dateStr) => {
    try {
      const apiResponse = await apiService.getLiveStatus(trainNo, dateStr);
      if (apiResponse && apiResponse.status && apiResponse.status.result === 'success') {
        const body = apiResponse.body;
        if (body.stations && body.stations.length > 0) return body;
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  try {
    let body = null;
    let finalDate = requestedDate;

    if (requestedDate) {
      body = await tryApiWithDate(requestedDate);
    } else {
      // Auto-pick logic
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const todayStr = today.toISOString().split('T')[0].replace(/-/g, '');
      const yesterdayStr = yesterday.toISOString().split('T')[0].replace(/-/g, '');

      const bodyToday = await tryApiWithDate(todayStr);
      const bodyYesterday = await tryApiWithDate(yesterdayStr);

      // If yesterday's trip is "Running" and today's is "Not Started", pick yesterday
      if (bodyYesterday && bodyToday) {
        const todayMsg = (bodyToday.train_status_message || "").toLowerCase();
        if (todayMsg.includes('not started') || todayMsg.includes('upcoming')) {
          body = bodyYesterday;
          finalDate = yesterdayStr;
        } else {
          body = bodyToday;
          finalDate = todayStr;
        }
      } else {
        body = bodyToday || bodyYesterday;
        finalDate = body === bodyToday ? todayStr : yesterdayStr;
      }
    }

    if (body) {
      const currentStnCode = body.current_station || "";
      const currentStn = body.stations?.find(s => s.stationCode === currentStnCode) || body.stations?.[0];
      
      const result = {
        trainNumber: trainNo,
        trainName: body.train_name || "Express",
        currentStation: currentStn ? `${currentStn.stationName} (${currentStn.stationCode})` : "En Route",
        nextStation: body.stations?.[body.stations.indexOf(currentStn) + 1]?.stationName || "Destination",
        delay: body.delay || 0,
        platform: currentStn?.expected_platform || "1",
        eta: currentStn?.actual_arrival_time || "--:--",
        status: body.train_status_message || "Running",
        lastUpdated: new Date().toISOString(),
        dataSource: 'RapidAPI',
        stations: body.stations.map(s => ({
          stationCode: s.stationCode,
          stationName: s.stationName,
          arrivalTime: s.actual_arrival_time || s.scheduled_arrival_time || "--:--",
          departureTime: s.actual_departure_time || s.scheduled_departure_time || "--:--",
          platform: s.expected_platform || "1",
          distance: s.distance || "0"
        }))
      };
      
      cache.set(cacheKey, result, 60); 
      return result;
    }
    throw new Error("RapidAPI returned no data for today or yesterday");
  } catch (error) {
    console.warn(`RapidAPI failed for ${trainNo}, falling back to scraper:`, error.message);
    
    // 2. Fallback to Scraper/Simulator
    try {
      const info = await railwayService.getTrainInfo(trainNo);
      if (!info) return null; // No mock fallback if train is truly unknown

      const route = await railwayService.getTrainRouteData(trainNo);
      let currentStation = info.originName ? `${info.originName} (${info.originCode})` : "Origin";
      let nextStation = info.destinationName ? `${info.destinationName} (${info.destinationCode})` : "Destination";

      if (route && route.length > 1) {
        const currentIndex = Math.max(0, Math.floor(route.length / 3));
        const nextIndex = Math.min(currentIndex + 1, route.length - 1);
        currentStation = `${route[currentIndex].stationName} (${route[currentIndex].stationCode})`;
        nextStation = `${route[nextIndex].stationName} (${route[nextIndex].stationCode})`;
      }

      return {
        ...info,
        currentStation,
        nextStation,
        delay: 5,
        platform: 1,
        eta: info.arrival || "Soon",
        status: "Running",
        lastUpdated: new Date().toISOString(),
        dataSource: 'Scraper'
      };
    } catch (fallbackError) {
      return null;
    }
  }
};

/**
 * Get Train Route
 */
const getRoute = async (trainNo) => {
  const cacheKey = `route_api_${trainNo}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) return cachedData;

  try {
    // Try scraper first for full route as it's often more detailed
    const route = await railwayService.getTrainRouteData(trainNo);
    if (route && route.length > 0) {
      cache.set(cacheKey, route, 86400); 
      return route;
    }
    return [];
  } catch (error) {
    return [];
  }
};

/**
 * Search Train
 */
const searchTrain = async (trainNo) => {
  try {
    const info = await railwayService.getTrainInfo(trainNo);
    if (info) return [info];
    
    // Fallback for demo trains if scraper fails
    const mockTrains = {
      '17406': { trainNumber: '17406', trainName: 'Krishna Express', originName: 'Garla', destinationName: 'Khammam', type: 'Express' },
      '17202': { trainNumber: '17202', trainName: 'Golconda Express', originName: 'Garla', destinationName: 'Khammam', type: 'Express' },
      '12951': { trainNumber: '12951', trainName: 'Mumbai Rajdhani', originName: 'Mumbai Central', destinationName: 'New Delhi', type: 'Rajdhani' }
    };

    if (mockTrains[trainNo]) return [mockTrains[trainNo]];
    return [];
  } catch (error) {
    console.error('Search Service Error:', error.message);
    return [];
  }
};

/**
 * Trains Between Stations
 */
const getTrainsBetween = async (from, to) => {
  const cacheKey = `btw_${from}_${to}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) return cachedData;

  const trains = await railwayService.getTrainsBtwStations(from, to);
  if (trains && trains.length > 0) {
    cache.set(cacheKey, trains, 3600); // Cache for 1 hour
  }
  return trains;
};

/**
 * Get Coach Density (Simulated for now)
 */
const getCoachDensity = async (trainNo) => {
  // In future, this will fetch from sensor_logs or AI prediction service
  return [
    { coach: "D1", density: "Low", passengers: 34 },
    { coach: "D2", density: "Medium", passengers: 61 },
    { coach: "D3", density: "High", passengers: 97 },
    { coach: "D4", density: "Medium", passengers: 45 },
    { coach: "D5", density: "Low", passengers: 12 },
    { coach: "D6", density: "High", passengers: 88 }
  ];
};

// Helper for Mock Data
const getMockLiveStatus = (trainNo) => ({
  trainNumber: trainNo,
  trainName: "Express Special",
  originName: "New Delhi",
  destinationName: "Mumbai",
  currentStation: "Kota Jn",
  nextStation: "Ratlam Jn",
  delay: 10,
  platform: 2,
  eta: "16:45",
  status: "Delayed",
  lastUpdated: new Date().toISOString()
});

module.exports = {
  getLiveStatus,
  getRoute,
  searchTrain,
  getTrainsBetween,
  getCoachDensity
};
