// src/api/logService.ts
import axios from 'axios';

const API_URL = 'https://back-alberto.onrender.com';

export const getLogs = async () => {
  return axios.get(`${API_URL}/logs`);
};
