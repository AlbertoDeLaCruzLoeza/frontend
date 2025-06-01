// src/api/usersService.ts
import axios from './axios';

export const getUsers = () => axios.get('/users');
export const getUserById = (id: string) => axios.get(`/users/${id}`);
export const createUser = (data: any) => axios.post('/users', data);
export const updateUser = (id: string, data: any) => axios.put(`/users/${id}`, data);
export const deleteUser = (id: string) => axios.delete(`/users/${id}`);
