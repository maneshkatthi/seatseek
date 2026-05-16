import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getLiveStatus = async (trainNo, departureDate) => {
  try {
    const response = await api.get(`/live/${trainNo}`, {
      params: { departure_date: departureDate },
    });
    return response.data;
  } catch (error) {
    console.error('API Error (Live Status):', error);
    throw error;
  }
};

export const searchTrain = async (trainNo) => {
  try {
    const response = await api.get(`/search/${trainNo}`);
    return response.data;
  } catch (error) {
    console.error('API Error (Search):', error);
    throw error;
  }
};

export const getTrainRoute = async (trainNo) => {
  try {
    const response = await api.get(`/route/${trainNo}`);
    return response.data;
  } catch (error) {
    console.error('API Error (Route):', error);
    throw error;
  }
};

export default api;
