// src/api/brandSupplierService.ts
import axios from './axiosInstance';

export const getBrandSuppliers = () => axios.get('/brand-suppliers');
export const getBrandSupplierById = (id: string) => axios.get(`/brand-suppliers/${id}`);
export const createBrandSupplier = (data: any) => axios.post('/brand-suppliers', data);
export const updateBrandSupplier = (id: string, data: any) => axios.put(`/brand-suppliers/${id}`, data);
export const deleteBrandSupplier = (id: string) => axios.delete(`/brand-suppliers/${id}`);
