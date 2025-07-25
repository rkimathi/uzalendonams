import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
// Store pending requests that should be retried after token refresh
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Check both localStorage and sessionStorage for token
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If we're already refreshing, add this request to the queue
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return axios(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      // Try to refresh the token
      try {
        const refreshed = await useAuthStore.getState().refreshAuthToken();
        
        if (refreshed) {
          const newToken = localStorage.getItem('token') || sessionStorage.getItem('token');
          // Update the Authorization header
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
          originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
          
          // Process any requests that were waiting for the token refresh
          processQueue(null, newToken);
          
          // Retry the original request
          return axios(originalRequest);
        } else {
          // If refresh failed, redirect to login
          processQueue(error, null);
          window.location.href = '/login';
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // Clear auth data and redirect to login
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // Handle other errors
    if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    }
    
    return Promise.reject(error);
  }
);

export default api;