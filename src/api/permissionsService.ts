// src/api/permissionsService.ts
import axios from './axios';

export const getPermissions = () => axios.get('/permissions');
export const getPermissionById = (id: string) => axios.get(`/permissions/${id}`);
export const createPermission = (data: any) => axios.post('/permissions', data);
export const updatePermission = (id: string, data: any) => axios.put(`/permissions/${id}`, data);
export const deletePermission = (id: string) => axios.delete(`/permissions/${id}`);
