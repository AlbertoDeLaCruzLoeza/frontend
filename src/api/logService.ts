// src/api/logService.ts
import axios from 'axios';

const API_URL = 'https://back-front-y42m.onrender.com';

export const getLogs = async (params?: any) => {
  const token = localStorage.getItem('token');
<<<<<<< HEAD
  return axios.get(${API_URL}/logs, {
    headers: {
      Authorization: Bearer ${token},
    },
    params,
  });
};
=======
  return axios.get(`${API_URL}/logs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });
};
>>>>>>> c146afc192d1768b89ebae01b628249dacd4ef8e
