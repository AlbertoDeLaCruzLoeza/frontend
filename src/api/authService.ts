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

// POST: /auth/login
export const login = (data: LoginData) => {
  return axios.post<{ access_token: string }>('/auth/login', data, {
    withCredentials: true, 
    headers: {
      'Content-Type': 'application/json',
    },
  });
};


// POST: /auth/register
export const register = (data: RegisterData) => {
  return axios.post('/auth/register', data);
};
