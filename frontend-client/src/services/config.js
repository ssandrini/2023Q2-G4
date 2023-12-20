// config.js
import axios from 'axios';
const API_URL = 'https://1cxxp3ngjc.execute-api.us-east-1.amazonaws.com/dev';

const instance = axios.create({
  baseURL: API_URL, 
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const access_token = localStorage.getItem('access_token');
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { instance };
