const trainService = require('../services/trainService');

const getLiveStatus = async (req, res, next) => {
  try {
    const { trainNo, date } = req.params;
    if (!trainNo || trainNo.length < 5) {
      return res.status(400).json({ success: false, message: "Invalid train number" });
    }
    const status = await trainService.getLiveStatus(trainNo, date);
    if (!status || (status.dataSource === 'Scraper' && !status.trainName)) {
       return res.status(400).json({ success: false, message: "Invalid train number" });
    }
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.json(status);
  } catch (error) {
    next(error);
  }
};

const getRoute = async (req, res, next) => {
  try {
    const { trainNo } = req.params;
    if (!trainNo) return res.status(400).json({ success: false, message: "Train number is required" });
    const route = await trainService.getRoute(trainNo);
    res.json(route);
  } catch (error) {
    next(error);
  }
};

const searchTrain = async (req, res, next) => {
  try {
    const { trainNo } = req.params;
    if (!trainNo) return res.status(400).json({ success: false, message: "Train number is required" });
    const result = await trainService.searchTrain(trainNo);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getBetweenStations = async (req, res, next) => {
  try {
    const { from, to } = req.params;
    if (!from || !to) {
      return res.status(400).json({ success: false, message: "Station codes are required" });
    }
    if (from.toUpperCase() === to.toUpperCase()) {
      return res.status(400).json({ success: false, message: "Source and destination cannot be same" });
    }
    const trains = await trainService.getTrainsBetween(from, to);
    res.json(trains);
  } catch (error) {
    next(error);
  }
};

const getCoachDensity = async (req, res, next) => {
  try {
    const { trainNo } = req.params;
    const density = await trainService.getCoachDensity(trainNo);
    res.json(density);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLiveStatus,
  getRoute,
  searchTrain,
  getBetweenStations,
  getCoachDensity
};
