// src/api/brandsService.ts
import axios from './axios';

export const getBrands = (params: Record<string, any> = {}) => axios.get('/brands', { params });
export const getBrandById = (id: string) => axios.get(`/brands/${id}`);
export const createBrand = (data: any) => axios.post('/brands', data);
export const updateBrand = (id: string, data: any) => axios.put(`/brands/${id}`, data);
export const deleteBrand = (id: string) => axios.delete(`/brands/${id}`);
