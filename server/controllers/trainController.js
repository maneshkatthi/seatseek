const { fetchFromRapidAPI } = require('../services/apiService');
const { getTrainInfo, getTrainRouteData } = require('../services/railwayService');

// Mock data fallback
const MOCK_DATA = {
  coaches: [
    { id: 'C1', name: '1A', percentage: 25 },
    { id: 'C2', name: '2A', percentage: 45 },
    { id: 'C3', name: '3A', percentage: 75 },
  ],
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
    res.json(data);
  } catch (error) {
    console.error(`Error fetching live status for ${trainNo}:`, error.message);
    // Fallback to mock or empty state
    res.status(200).json({ error: "API limit reached", body: { stations: [] }, fallback: true });
  }
};

const getTrainRoute = async (req, res, next) => {
  const { trainNo } = req.params;
  try {
    // Try scraper first (no quota)
    const route = await getTrainRouteData(trainNo);
    if (route && route.length > 0) {
      return res.json({ body: { stations: route } });
    }

    // Fallback to RapidAPI
    const data = await fetchFromRapidAPI('/api/trains/v1/train/status', {
      train_number: trainNo,
      client: 'web',
    });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const searchTrain = async (req, res, next) => {
  const { trainNo } = req.params;
  try {
    // Try scraper first
    const info = await getTrainInfo(trainNo);
    if (info) {
      return res.json({
        body: [{
          trains: [{
            trainNumber: info.trainNumber,
            trainName: info.trainName,
            origin: info.origin,
            destination: info.destination,
            schedule: [] // Scraper doesn't provide schedule here
          }]
        }]
      });
    }

    // Fallback to RapidAPI
    const data = await fetchFromRapidAPI(`/api/trains-search/v1/train/${trainNo}`, {
      isH5: 'true',
      client: 'web',
    });
    res.json(data);
  } catch (error) {
    console.error(`Error searching train ${trainNo}:`, error.message);
    res.status(200).json({ error: "API limit reached", body: [], fallback: true });
  }
};

module.exports = { getLiveStatus, getTrainRoute, searchTrain };
