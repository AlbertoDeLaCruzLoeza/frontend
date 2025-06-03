// src/api/inventoryService.ts
import axios from './axiosInstance';

export const getInventory = () => axios.get('/inventory');
export const getInventoryById = (id: string) => axios.get(`/inventory/${id}`);
export const createInventory = (data: any) => axios.post('/inventory', data);
export const updateInventory = (id: string, data: any) => axios.put(`/inventory/${id}`, data);
export const deleteInventory = (id: string) => axios.delete(`/inventory/${id}`);
