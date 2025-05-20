import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000', // Puerto donde corre tu backend
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token de autenticación
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

export default instance; 