// src/services/api.ts
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the JWT token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken'); // Get the token from local storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add it to the Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token expiration (optional, but recommended)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: If the server returns a 401 Unauthorized, and it's due to an expired token
    if (error.response && error.response.status === 401) {
      console.error('JWT token expired or invalid. Logging out...');
      localStorage.removeItem('jwtToken'); // Clear the expired token
      // You might want to redirect to login page here or show a message
      window.location.href = '/login'; // Or your login route
    }
    return Promise.reject(error);
  }
);

export default api;