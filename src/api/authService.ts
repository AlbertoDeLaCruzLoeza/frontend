// src/api/authService.ts
import axios from './axios';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
}

export const login = (data: LoginData) => {
  return axios.post<{ token: string }>('/auth/login', data);
};

export const register = (data: RegisterData) => {
  return axios.post('/auth/register', data);
};
