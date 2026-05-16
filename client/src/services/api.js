import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getLiveStatus = async (trainNo, date) => {
  try {
    const url = date ? `/live/${trainNo}/${date}` : `/live/${trainNo}`;
    const response = await api.get(url);
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

export const getTrainsBetween = async (fromCode, toCode) => {
  try {
    const response = await api.get(`/between/${fromCode}/${toCode}`);
    return response.data;
  } catch (error) {
    console.error('API Error (Between Stations):', error);
    throw error;
  }
};

export const getCoachDensity = async (trainNo) => {
  try {
    const response = await api.get(`/density/${trainNo}`);
    return response.data;
  } catch (error) {
    console.error('API Error (Density):', error);
    throw error;
  }
};

export default api;
