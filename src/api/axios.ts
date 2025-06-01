import axios from 'axios';

// Instancia de Axios con la base URL del backend en Render
const instance = axios.create({
  baseURL: 'https://alberto-back.onrender.com',
});

// Interceptor para agregar el token si existe
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default instance;
