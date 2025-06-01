import axios from 'axios';

const api = axios.create({
  baseURL: 'https://back-alberto.onrender.com', // Reemplaza con tu URL real de Render
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Cambia a true si usas cookies
});

export default api;
