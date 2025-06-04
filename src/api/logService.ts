// src/api/logService.ts
import axios from 'axios';

const API_URL = 'https://back-front-y42m.onrender.com';

export const getLogs = async (params?: any) => {
  const token = localStorage.getItem('token');
  return axios.get(`${API_URL}/logs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });
};
