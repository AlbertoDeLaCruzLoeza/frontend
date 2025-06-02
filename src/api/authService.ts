// src/api/authService.ts
import axios from './axios';

interface LoginData {
  email: string;
  password: string;
  recaptchaToken: string;  
}
interface RegisterData {
  email: string;
  password: string;
}

export const login = (data: LoginData) => {
<<<<<<< HEAD
  return axios.post<{ access_token: string }>('/auth/login', data, {
    withCredentials: true, 
    headers: {
      'Content-Type': 'application/json',
    },
  });
};


// POST: /auth/register
=======
  return axios.post<{ token: string }>('/auth/login', data);
};

>>>>>>> d6a2411bcf253420affc705514ac1f9205218a9c
export const register = (data: RegisterData) => {
  return axios.post('/auth/register', data);
};
