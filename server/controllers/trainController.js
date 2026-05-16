const { fetchFromRapidAPI } = require('../services/apiService');

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
    // This is often a different endpoint or part of the same status
    // For now, let's assume it's status or implement if needed
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
