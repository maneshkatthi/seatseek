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
    
    // Extract trainId using regex from the whole rawData for better reliability
    const trainIdMatch = rawData.match(/~MAIL_EXPRESS~([0-9]+)~/i) || rawData.match(/~([0-9]{4,10})~/);
    const trainId = trainIdMatch ? trainIdMatch[1] : null;

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
      trainId: trainId,
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
    // First get the internal trainId
    const info = await getTrainInfo(trainNo);
    if (!info || !info.trainId) return [];

    // Correct URL for route: Action=TRAINROUTE using internal ID
    const response = await axios.get(`https://erail.in/data.aspx?Action=TRAINROUTE&Password=2012&Data1=${info.trainId}&Data2=0&Cache=true`, {
      headers: { 'User-Agent': getUserAgent() }
    });

    const rawData = response.data;
    if (!rawData) return [];

    // Format: STATION_CODE~STATION_NAME~ARR_TIME~DEP_TIME~DISTANCE~DAY~^...
    const stationsRaw = rawData.split('~^');
    return stationsRaw.map(s => {
      // Remove the leading ^ from the first element if present
      if (s.startsWith('^')) s = s.substring(1);
      
      const d = s.split('~');
      if (d.length < 6) return null;
      
      // The array format from erail is slightly shifted due to the starting index
      // e.g. [ '1', 'NS', 'Narasapur', 'First', '17.20', '0', '0' ]
      // So index 1 is Station Code, 2 is Station Name, etc.
      return {
        stationCode: d[1],
        stationName: d[2],
        arrivalTime: d[3] === 'First' ? null : d[3],
        departureTime: d[4] === 'Last' ? null : d[4],
        distance: d[5],
        day: d[7] || '1'
      };
    }).filter(s => s !== null && s.stationCode);
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
