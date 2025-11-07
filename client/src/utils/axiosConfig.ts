import axios from 'axios';

// Configure the Axios instance with an environment-based base URL.
// Vite exposes env vars starting with VITE_ on import.meta.env
const baseURL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3000';

const api = axios.create({ baseURL });

// Attach Authorization header automatically if token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global 401 handler: clear token and reload
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default api;
