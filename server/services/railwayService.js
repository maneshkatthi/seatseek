const axios = require('axios');
const UserAgent = require('user-agents');

const getUserAgent = () => {
  const userAgent = new UserAgent({ deviceCategory: 'desktop' });
  return userAgent.toString();
};

/**
 * Fetch train basic info from erail.in
 */
const getTrainInfo = async (trainNo) => {
  try {
    const response = await axios.get(`https://erail.in/rail/getTrains.aspx?TrainNo=${trainNo}`, {
      headers: { 'User-Agent': getUserAgent() }
    });
    
    // erail returns data in a custom string format
    const rawData = response.data;
    if (!rawData || !rawData.includes('~~~~~~~~')) return null;

    const sections = rawData.split('~~~~~~~~');
    const trainDetails = sections[0].split('~');
    
    return {
      trainNumber: trainDetails[0],
      trainName: trainDetails[1],
      origin: trainDetails[2],
      destination: trainDetails[3],
      trainId: trainDetails[0], // Used for route fetching
    };
  } catch (error) {
    console.error('Scraper Error (Train Info):', error.message);
    return null;
  }
};

/**
 * Fetch train route from erail.in
 */
const getTrainRouteData = async (trainId) => {
  try {
    const response = await axios.get(`https://erail.in/data.aspx?Action=TRAINROUTE&Password=2012&Data1=${trainId}&Data2=0&Cache=true`, {
      headers: { 'User-Agent': getUserAgent() }
    });

    const rawData = response.data;
    if (!rawData) return [];

    const stations = rawData.split('~^');
    return stations.map(s => {
      const d = s.split('~');
      return {
        stationName: d[1],
        stationCode: d[0],
        arrivalTime: d[2],
        departureTime: d[3],
        distance: d[4],
        day: d[5]
      };
    });
  } catch (error) {
    console.error('Scraper Error (Route):', error.message);
    return [];
  }
};

module.exports = { getTrainInfo, getTrainRouteData };
