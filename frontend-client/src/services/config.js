// config.js
import axios from 'axios';
const API_URL = 'https://1cxxp3ngjc.execute-api.us-east-1.amazonaws.com/dev';

const instance = axios.create({
  baseURL: API_URL, 
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { instance };
