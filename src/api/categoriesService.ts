// src/api/categoriesService.ts
import axios from './axiosInstance';

export const getCategories = () => axios.get('/categories');
export const getCategoryById = (id: string) => axios.get(`/categories/${id}`);
export const createCategory = (data: any) => axios.post('/categories', data);
export const updateCategory = (id: string, data: any) => axios.put(`/categories/${id}`, data);
export const deleteCategory = (id: string) => axios.delete(`/categories/${id}`);
