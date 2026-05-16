const express = require('express');
const router = express.Router();
const { getLiveStatus, getTrainRoute, searchTrain, getTrainsBetweenStations } = require('../controllers/trainController');

router.get('/live/:trainNo', getLiveStatus);
router.get('/route/:trainNo', getTrainRoute);
router.get('/search/:trainNo', searchTrain);
router.get('/between/:from/:to', getTrainsBetweenStations);

module.exports = router;
