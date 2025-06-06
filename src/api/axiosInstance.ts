import axios from 'axios';

// Instancia de Axios con la base URL del backend en Render
const instance = axios.create({
  baseURL: 'https://back-front-y42m.onrender.com',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token si existe
instance.interceptors.request.use((config) => {
  if (config.url === '/auth/login') {
    // No agregamos token para la petición de login
    return config;
  }
  
  const token = localStorage.getItem('token');
  console.log('Interceptor token:', token);
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default instance;
