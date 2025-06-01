// src/api/productsService.ts
import axios from './axios';

const cleanFilters = (filters: Record<string, any>) => {
  const cleaned: Record<string, any> = {};
  for (const key in filters) {
    if (
      filters[key] !== '' &&
      filters[key] !== undefined &&
      filters[key] !== null
    ) {
      cleaned[key] = filters[key];
    }
  }
  return cleaned;
};

export const getProducts = (filters: {
  search?: string;
  createdStartDate?: string;
  createdEndDate?: string;
  updateStartDate?: string;
  updateEndDate?: string;
  isActive?: string;
  brandIds?: string;
  suppliersIds?: string;
} = {}) => axios.get('/products', { params: cleanFilters(filters) });

export const getProductById = (id: string) => axios.get(`/products/${id}`);

export const createProduct = (data: any) => axios.post('/products', data);

export const updateProduct = (id: string, data: any) => axios.put(`/products/${id}`, data);

export const deleteProduct = (id: string) => axios.delete(`/products/${id}`);
