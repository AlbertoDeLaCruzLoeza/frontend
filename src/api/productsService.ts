// src/api/productsService.ts
import axios from './axiosInstance';

type RawFilters = {
  search?: string;
  createdStartDate?: string;
  createdEndDate?: string;
  updatedStartDate?: string;
  updatedEndDate?: string;
  deletedStartDate?: string;
  deletedEndDate?: string;
  isActive?: string;
  brandIds?: string;
  supplierIds?: string;
};

const cleanFilters = (obj: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined && v !== null && v !== '')
  );
};

const transformFilters = (filters: RawFilters): Record<string, any> => {
  const {
    search,
    isActive,
    brandIds,
    supplierIds,
    createdStartDate,
    createdEndDate,
    updatedStartDate,
    updatedEndDate,
    deletedStartDate,
    deletedEndDate,
  } = filters;

  const today = new Date();
  const params: Record<string, any> = { search };

  // Estado activo como string
  if (isActive?.toLowerCase() === 'true' || isActive?.toLowerCase() === 'false') {
    params.isActive = isActive.toLowerCase();
  }

  // IDs
  if (brandIds) params.brandIds = brandIds;
  if (supplierIds) params.supplierIds = supplierIds;

  // Filtros por fecha
  const dateFilterTypes = [
    { type: 'created_at', start: createdStartDate, end: createdEndDate },
    { type: 'updated_at', start: updatedStartDate, end: updatedEndDate },
    { type: 'deleted_at', start: deletedStartDate, end: deletedEndDate },
  ];

  const activeDateFilter = dateFilterTypes.find(d => d.start || d.end);

  if (activeDateFilter) {
    const { type, start, end } = activeDateFilter;

    if (!(start && end)) {
      throw new Error(`Debe especificar ambas fechas para el filtro ${type}`);
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (startDate > endDate) {
      throw new Error('La fecha de inicio no puede ser mayor que la fecha final.');
    }

    if (endDate > today) {
      throw new Error('La fecha final no puede ser una fecha futura.');
    }

    params.dateType = type;
    params.startDate = start;
    params.endDate = end;
  }

  return cleanFilters(params);
};

export const getProducts = (filters: RawFilters = {}) => {
  const params = transformFilters(filters);
  
  return axios.get('/products', { params });
};

export const getProductById = (id: string) => axios.get(`/products/${id}`);

export const createProduct = (data: any) => axios.post('/products', data);

export const updateProduct = (id: string, data: any) => axios.put(`/products/${id}`, data);

export const deleteProduct = (id: string) => axios.delete(`/products/${id}`);
