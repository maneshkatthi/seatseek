const axios = require('axios');

const getApiKey = () => {
  const keysString = process.env.RAPIDAPI_KEYS || '';
  const keys = keysString.split(',').filter(k => k.trim());
  if (keys.length === 0) return null;
  return keys[Math.floor(Math.random() * keys.length)];
};

const host = process.env.RAPIDAPI_HOST;

const fetchFromRapidAPI = async (endpoint, params) => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("No RapidAPI keys available");

  try {
    const response = await axios.get(`https://${host}${endpoint}`, {
      params,
      headers: {
        'x-rapidapi-host': host,
        'x-rapidapi-key': apiKey,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.warn(`Rate limit hit for key: ${apiKey}.`);
    }
    throw error;
  }
};

/**
 * Get Real-time Train Status
 */
const getLiveStatus = async (trainNo, departureDate) => {
  // Format date to YYYYMMDD if not already
  const formattedDate = (departureDate || '').replace(/-/g, '');
  
  return fetchFromRapidAPI('/api/trains/v1/train/status', {
    train_number: trainNo,
    departure_date: formattedDate,
    isH5: 'true',
    client: 'web'
  });
};

/**
 * Get Train Schedule/Route
 */
const getTrainSchedule = async (trainNo) => {
  // Try different common endpoint versions for schedule
  return fetchFromRapidAPI('/api/v1/getTrainSchedule', { trainNo });
};

module.exports = { 
  fetchFromRapidAPI,
  getLiveStatus,
  getTrainSchedule
};
