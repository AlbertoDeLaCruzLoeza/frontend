// src/api/authService.ts
import axios from './axiosInstance';

interface LoginData {
  email: string;
  password: string;
  recaptchaToken: string;
}

interface RegisterData {
  email: string;
  password: string;
  recaptchaToken?: string; // opcional si no se usa en registro
}

export const login = async (data: LoginData) => {
  const response = await axios.post<{ login_token: string }>('/auth/login', data, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  console.log('Login response:', response.data);
  
  // Guardar token en localStorage
  if (response.data.login_token) {
    localStorage.setItem('token', response.data.login_token);
  }
  
  return response;
};



// POST: /auth/register
export const register = (data: RegisterData) => {
  return axios.post('/auth/register', data);
};

export const logout = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token no encontrado en localStorage');

  return axios.post('/auth/logout', {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};