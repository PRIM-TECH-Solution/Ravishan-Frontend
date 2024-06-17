import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const history = useNavigate();
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      try {
        const response = await axios.post('http://localhost:8080/auth/refresh-token', { refreshToken });
        if (response.status === 200) {
          localStorage.setItem('token', response.data);
          api.defaults.headers.common['Authorization'] = 'Bearer ' + response.data;
          return api(originalRequest);
        }
      } catch (err) {
        history.push('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default api;