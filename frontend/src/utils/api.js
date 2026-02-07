// src/utils/api.js
import axios from 'axios';

// Determine base URL from environment variable (set in Vercel)
const isProduction = process.env.NODE_ENV === 'production';

// In production, REACT_APP_API_URL must be set in Vercel
// In local dev, fall back to localhost
const baseURL = process.env.REACT_APP_API_URL || (isProduction ? null : 'http://localhost:5000');

// Debug in production if env var is missing (won't crash the app)
if (isProduction && !baseURL) {
  console.warn(
    'Warning: REACT_APP_API_URL is not set in production build. ' +
    'Check Vercel Settings → Environment Variables → Redeploy.'
  );
  // Optional: you can throw here if you want to fail fast during dev
  // throw new Error('Missing REACT_APP_API_URL in production');
}

const api = axios.create({
  baseURL: baseURL || 'http://localhost:5000', // last-resort fallback
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000, // 20 seconds – safer for slow campus networks
});

// Attach JWT token to every request if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response interceptor – auto-logout on 401 + log network issues
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('401 Unauthorized → logging out');
      localStorage.removeItem('token');
      window.location.href = '/login?session_expired=true';
    }

    if (error.message?.includes('Network Error')) {
      console.error('Network error – check backend status, CORS, and internet connection');
    }

    return Promise.reject(error);
  }
);

export default api;