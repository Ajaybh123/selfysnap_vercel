import axios from 'axios';

export const API_URL = "http://localhost:8080";
export const DEPLOYED_URL = "https://selfysnap-vercel.vercel.app"
// change api

export const api = axios.create({
  baseURL: DEPLOYED_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token from localStorage to every request if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);