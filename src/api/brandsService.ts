import axios from './axiosInstance';

export interface Brand {
  brandId?: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const getBrands = (params: Record<string, any> = {}) =>
  axios.get<{ data: { records: Brand[]; total_count: number } }>('/brands', { params });

export const getBrandById = (id: string) =>
  axios.get<{ data: Brand }>(`/brands/${id}`);

export const createBrand = (data: Omit<Brand, 'brandId' | 'createdAt' | 'updatedAt'>) =>
  axios.post<{ data: Brand }>('/brands', data);

export const updateBrand = (id: string | number, data: Omit<Brand, 'brandId' | 'createdAt' | 'updatedAt'>) =>
  axios.put<{ data: Brand }>(`/brands/${id}`, data);

export const deleteBrand = (id: string) =>
  axios.delete(`/brands/${id}`);
