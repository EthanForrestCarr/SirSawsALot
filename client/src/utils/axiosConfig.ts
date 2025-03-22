import axios from 'axios';

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.reload(); // Refresh page on token expiration
    }
    return Promise.reject(error);
  }
);

export default axios;
