import axios from './axios';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
}

// POST: /auth/login
export const login = (data: LoginData) => {
  return axios.post<{ access_token: string }>('/auth/login', data);
};

// POST: /auth/register
export const register = (data: RegisterData) => {
  return axios.post('/auth/register', data);
};
