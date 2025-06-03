// src/api/suppliersService.ts
import axios from './axiosInstance';

export const getSuppliers = () => axios.get('/brand-suppliers'); // Corregido
export const getSupplierById = (id: string) => axios.get(`/suppliers/${id}`);
export const createSupplier = (data: any) => axios.post('/suppliers', data);
export const updateSupplier = (id: string, data: any) => axios.put(`/suppliers/${id}`, data);
export const deleteSupplier = (id: string) => axios.delete(`/suppliers/${id}`);
