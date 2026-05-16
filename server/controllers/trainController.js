const { fetchFromRapidAPI } = require('../services/apiService');
const { getTrainInfo, getTrainRouteData, getTrainsBtwStations } = require('../services/railwayService');

// Dynamic Mock Data Fallback (Simulates realistic train status using real stations)
const generateMockLiveStatus = (trainNo, stations = []) => {
  const defaultStations = [
    { stationName: "HYDERABAD DECCAN", stationCode: "HYB", arrivalTime: "00:00", actual_arrival_time: "18:00", departureTime: "18:00", actual_departure_time: "18:05", expected_platform: "1" },
    { stationName: "SECUNDERABAD JN", stationCode: "SC", arrivalTime: "18:20", actual_arrival_time: "18:25", departureTime: "18:30", actual_departure_time: null, expected_platform: "10" },
    { stationName: "VIJAYAWADA JN", stationCode: "BZA", arrivalTime: "23:45", actual_arrival_time: null, departureTime: "23:55", actual_departure_time: null, expected_platform: "6" }
  ];

  const finalStations = stations.length > 0 ? stations.map((s, index) => ({
    stationName: s.stationName,
    stationCode: s.stationCode,
    arrivalTime: s.arrivalTime || "00:00",
    actual_arrival_time: s.arrivalTime || "00:00",
    departureTime: s.departureTime || "00:00",
    actual_departure_time: index === 0 ? s.departureTime : null, // Simulate current station
    expected_platform: Math.floor(Math.random() * 10) + 1
  })) : defaultStations;

  return {
    success: true,
    fallback: true,
    body: {
      train_number: trainNo,
      train_name: "Live Tracking (Simulation)",
      current_station: finalStations[0]?.stationCode || "Origin",
      train_status_message: "Train is running. Location estimated via route simulation.",
      stations: finalStations
    }
  };
};

const getLiveStatus = async (req, res, next) => {
  const { trainNo } = req.params;
  const { departure_date } = req.query;

  try {
    const data = await fetchFromRapidAPI('/api/trains/v1/train/status', {
      departure_date: departure_date || new Date().toISOString().slice(0, 10).replace(/-/g, ''),
      isH5: 'true',
      client: 'web',
      deviceIdentifier: 'seatseek',
      train_number: trainNo,
    });
    
    if (data.error || data.status?.result === 'failure') {
      console.warn(`RapidAPI error for ${trainNo}, switching to Dynamic Mock.`);
      const stations = await getTrainRouteData(trainNo);
      return res.json(generateMockLiveStatus(trainNo, stations));
    }
    
    res.json(data);
  } catch (error) {
    console.error(`Error fetching live status for ${trainNo}:`, error.message);
    const stations = await getTrainRouteData(trainNo);
    res.status(200).json(generateMockLiveStatus(trainNo, stations));
  }
};

const getTrainRoute = async (req, res, next) => {
  const { trainNo } = req.params;
  try {
    const route = await getTrainRouteData(trainNo);
    if (route && route.length > 0) {
      return res.json({ body: { stations: route } });
    }

    const data = await fetchFromRapidAPI('/api/trains/v1/train/status', {
      train_number: trainNo,
      client: 'web',
    });
    res.json(data);
  } catch (error) {
    console.error(`Error fetching route for ${trainNo}, switching to Mock.`);
    const stations = await getTrainRouteData(trainNo);
    res.json(generateMockLiveStatus(trainNo, stations));
  }
};

const searchTrain = async (req, res, next) => {
  const { trainNo } = req.params;
  try {
    const info = await getTrainInfo(trainNo);
    if (info) {
      return res.json({
        body: [{
          trains: [{
            trainNumber: info.trainNumber,
            trainName: info.trainName,
            origin: info.originName,
            destination: info.destinationName,
            stationFrom: info.originCode,
            stationTo: info.destinationCode,
            schedule: [{ departureTime: info.departure }, { arrivalTime: info.arrival }]
          }]
        }]
      });
    }

    const data = await fetchFromRapidAPI(`/api/trains-search/v1/train/${trainNo}`, {
      isH5: 'true',
      client: 'web',
    });
    res.json(data);
  } catch (error) {
    console.error(`Error searching train ${trainNo}:`, error.message);
    res.status(200).json({ body: [], fallback: true });
  }
};

const getTrainsBetweenStations = async (req, res, next) => {
  const { from, to } = req.params;
  const date = req.query.date || new Date().toISOString().slice(0, 10).replace(/-/g, '');
  
  if (from === to) {
    return res.status(400).json({ success: false, message: "Source and destination cannot be same" });
  }

  try {
    const scraperTrains = await getTrainsBtwStations(from, to);
    if (scraperTrains && scraperTrains.length > 0) {
      return res.json({ success: true, body: scraperTrains });
    }

    // Fallback to RapidAPI
    console.log(`Scraper returned empty for ${from}->${to}, trying RapidAPI...`);
    const data = await fetchFromRapidAPI('/api/trains/v1/trainsBetweenStations', {
      fromStationCode: from,
      toStationCode: to,
      dateOfJourney: date,
    });
    
    if (data.body) {
      return res.json({ success: true, body: data.body });
    }

    res.json({ success: true, body: [], message: "No trains found" });
  } catch (error) {
    console.error(`Error fetching trains between ${from} and ${to}:`, error.message);
    res.json({ success: true, body: [], message: "Service temporarily unavailable" });
  }
};

module.exports = { getLiveStatus, getTrainRoute, searchTrain, getTrainsBetweenStations };
