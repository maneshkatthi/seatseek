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
    
    const rawData = response.data;
    if (!rawData) return null;

    const sections = rawData.split('~~~~~~~~');
    const mainSection = sections[0];
    const startIndex = mainSection.indexOf('^');
    if (startIndex === -1) return null;
    
    const trainDetails = mainSection.substring(startIndex + 1).split('~');
    
    return {
      trainNumber: trainDetails[0],
      trainName: trainDetails[1],
      originName: trainDetails[2],
      originCode: trainDetails[3],
      destinationName: trainDetails[4],
      destinationCode: trainDetails[5],
      departure: trainDetails[10],
      arrival: trainDetails[11],
      duration: trainDetails[12],
    };
  } catch (error) {
    console.error('Scraper Error (Train Info):', error.message);
    return null;
  }
};

/**
 * Fetch train route from erail.in
 */
const getTrainRouteData = async (trainNo) => {
  try {
    // Correct URL for route: Action=TRAINROUTE
    const response = await axios.get(`https://erail.in/data.aspx?Action=TRAINROUTE&Password=2012&Data1=${trainNo}&Data2=0&Cache=true`, {
      headers: { 'User-Agent': getUserAgent() }
    });

    const rawData = response.data;
    if (!rawData) return [];

    // Format: STATION_CODE~STATION_NAME~ARR_TIME~DEP_TIME~DISTANCE~DAY~^...
    const stationsRaw = rawData.split('~^');
    return stationsRaw.map(s => {
      const d = s.split('~');
      if (d.length < 6) return null;
      return {
        stationCode: d[0],
        stationName: d[1],
        arrivalTime: d[2] === '00:00' ? null : d[2],
        departureTime: d[3] === '00:00' ? null : d[3],
        distance: d[4],
        day: d[5]
      };
    }).filter(s => s !== null);
  } catch (error) {
    console.error('Scraper Error (Route):', error.message);
    return [];
  }
};

/**
 * Fetch trains between stations from erail.in
 */
const getTrainsBtwStations = async (from, to) => {
  try {
    const response = await axios.get(`https://erail.in/rail/getTrains.aspx?From=${from}&To=${to}`, {
      headers: { 'User-Agent': getUserAgent() }
    });

    const rawData = response.data;
    if (!rawData) return [];

    const sections = rawData.split('~~~~~~~~');
    const mainSection = sections[0];
    
    // Split by ^ to get individual trains
    const trainsRaw = mainSection.split('^').slice(1);
    
    return trainsRaw.map(t => {
      const d = t.split('~');
      if (d.length < 13) return null;
      return {
        trainNo: d[0],
        name: d[1],
        from: d[2],
        fromCode: d[3],
        to: d[4],
        toCode: d[5],
        departure: d[10],
        arrival: d[11],
        duration: d[12],
        days: d[13]
      };
    }).filter(t => t !== null);
  } catch (error) {
    console.error('Scraper Error (Between Stations):', error.message);
    return [];
  }
};

module.exports = { getTrainInfo, getTrainRouteData, getTrainsBtwStations };
