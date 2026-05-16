const axios = require('axios');

const keys = process.env.RAPIDAPI_KEYS.split(',');
const host = process.env.RAPIDAPI_HOST;

const getApiKey = () => keys[Math.floor(Math.random() * keys.length)];

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
