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
      console.warn(`Rate limit hit for key: ${apiKey}. Retrying with another key...`);
      // Optional: Recursive retry with another key
      // return fetchFromRapidAPI(endpoint, params); 
    }
    throw error;
  }
};

module.exports = { fetchFromRapidAPI };
