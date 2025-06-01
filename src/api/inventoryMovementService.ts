// src/api/inventoryMovementService.ts
import axios from './axios';

export const getInventoryMovements = () => axios.get('/inventory-movement');
export const getInventoryMovementById = (id: string) => axios.get(`/inventory-movement/${id}`);
export const createInventoryMovement = (data: any) => axios.post('/inventory-movement', data);
export const updateInventoryMovement = (id: string, data: any) => axios.put(`/inventory-movement/${id}`, data);
export const deleteInventoryMovement = (id: string) => axios.delete(`/inventory-movement/${id}`);
