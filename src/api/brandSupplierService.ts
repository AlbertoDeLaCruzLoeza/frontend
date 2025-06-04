// src/api/brandSupplierService.ts
import axios from './axiosInstance';

// Helper para limpiar filtros vacíos o innecesarios
const cleanFilters = (filters: Record<string, any>): Record<string, any> => {
  const cleaned: Record<string, any> = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== '' &&
      !(Array.isArray(value) && value.length === 0)
    ) {
      cleaned[key] = value;
    }
  });

  return cleaned;
};

interface FilterParams {
  search?: string;
  brandIds?: number[];
  isActive?: boolean;
  dateType?: 'created_at' | 'updated_at' | 'deleted_at';
  startDate?: string;
  endDate?: string;
}

// GET con filtros avanzados
export const getFilteredBrandSuppliers = (filters: FilterParams) => {
  const { dateType, startDate, endDate, ...rest } = filters;

  const params: Record<string, any> = cleanFilters(rest);

  if (dateType && startDate && endDate) {
    params.dateType = dateType;
    params.startDate = startDate;
    params.endDate = endDate;
  }

  return axios.get('/brand-suppliers', { params });
};

// CRUD estándar
export const getBrandSuppliers = () => axios.get('/brand-suppliers');
export const getBrandSupplierById = (id: string) => axios.get(`/brand-suppliers/${id}`);
export const createBrandSupplier = (data: any) => axios.post('/brand-suppliers', data);
export const updateBrandSupplier = (id: string, data: any) => axios.put(`/brand-suppliers/${id}`, data);
export const deleteBrandSupplier = (id: string) => axios.delete(`/brand-suppliers/${id}`);
export const reactivateBrandSupplier = (id: string) => {
  return axios.patch(`/brand-suppliers/${id}/reactivate`);
};