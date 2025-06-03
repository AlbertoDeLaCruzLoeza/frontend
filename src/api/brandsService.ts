// src/api/brandsService.ts
import axios from './axiosInstance';

interface BrandFilters {
  search?: string;
  supplierIds?: number[] | string;
  isActive?: boolean;
  dateType?: 'created_at' | 'updated_at' | 'deleted_at';
  startDate?: string;
  endDate?: string;
}

export const getBrands = (filters: BrandFilters = {}) => {
  const params = { ...filters };

  if (Array.isArray(params.supplierIds)) {
    params.supplierIds = params.supplierIds.join(',');
  }

  return axios.get('/brands', { params });
};

export const getBrandById = (id: string) => axios.get(`/brands/${id}`);
export const createBrand = (data: any) => axios.post('/brands', data);
export const updateBrand = (id: string, data: any) => axios.put(`/brands/${id}`, data);
export const deleteBrand = (id: string) => axios.delete(`/brands/${id}`);
