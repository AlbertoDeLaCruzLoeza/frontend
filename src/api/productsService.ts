// src/api/productsService.ts
import axios from './axiosInstance';

// Tipos de filtros para productos
export type RawFilters = {
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

// Limpia los filtros vacíos
const cleanFilters = (obj: Record<string, any>) =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined && v !== null && v !== ''));

// Transforma filtros en parámetros aceptados por el backend
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
  const params: Record<string, any> = {};

  if (search) params.search = search;
  if (isActive?.toLowerCase() === 'true' || isActive?.toLowerCase() === 'false') {
    params.isActive = isActive.toLowerCase();
  }
  if (brandIds) params.brandIds = brandIds;
  if (supplierIds) params.supplierIds = supplierIds;

  // Filtros por fechas
  const dateFilters = [
    { type: 'created_at', start: createdStartDate, end: createdEndDate },
    { type: 'updated_at', start: updatedStartDate, end: updatedEndDate },
    { type: 'deleted_at', start: deletedStartDate, end: deletedEndDate },
  ];

  const selected = dateFilters.find(f => f.start || f.end);

  if (selected) {
    const { type, start, end } = selected;

    if (!(start && end)) throw new Error(`Debe especificar ambas fechas para el filtro de ${type}`);
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (startDate > endDate) throw new Error('La fecha de inicio no puede ser mayor que la fecha final.');
    if (endDate > today) throw new Error('La fecha final no puede ser una fecha futura.');

    params.dateType = type;
    params.startDate = start;
    params.endDate = end;
  }

  return cleanFilters(params);
};

// --- Peticiones al backend ---

export const getProducts = (filters: RawFilters = {}) => {
  const params = transformFilters(filters);
  return axios.get('/products', { params });
};

export const getProductById = (id: string | number) =>
  axios.get(`/products/${id}`);

export const createProduct = (data: any) =>
  axios.post('/products', data);

export const updateProduct = (id: string | number, data: any) =>
  axios.put(`/products/${id}`, data);

export const deleteProduct = (id: string | number) =>
  axios.delete(`/products/${id}`); // ID en la ruta como espera Swagger
