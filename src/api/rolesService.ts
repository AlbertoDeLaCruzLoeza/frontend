// src/api/rolesService.ts
import axios from './axiosInstance';

export const getRoles = () => axios.get('/roles');
export const getRoleById = (id: string) => axios.get(`/roles/${id}`);
export const createRole = (data: any) => axios.post('/roles', data);
export const updateRole = (id: string, data: any) => axios.put(`/roles/${id}`, data);
export const deleteRole = (id: string) => axios.delete(`/roles/${id}`);
