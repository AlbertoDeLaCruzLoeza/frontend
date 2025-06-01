// src/api/inventoryHistoryService.ts
import axios from './axios';

export const getInventoryHistory = () => axios.get('/inventory-history');
export const getInventoryHistoryById = (id: string) => axios.get(`/inventory-history/${id}`);
export const createInventoryHistory = (data: any) => axios.post('/inventory-history', data);
export const updateInventoryHistory = (id: string, data: any) => axios.put(`/inventory-history/${id}`, data);
export const deleteInventoryHistory = (id: string) => axios.delete(`/inventory-history/${id}`);
