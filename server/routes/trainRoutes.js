const express = require('express');
const router = express.Router();
const trainController = require('../controllers/trainController');

router.get('/live/:trainNo', trainController.getLiveStatus);
router.get('/live/:trainNo/:date', trainController.getLiveStatus);
router.get('/route/:trainNo', trainController.getRoute);
router.get('/search/:trainNo', trainController.searchTrain);
router.get('/between/:from/:to', trainController.getBetweenStations);
router.get('/density/:trainNo', trainController.getCoachDensity);

module.exports = router;
