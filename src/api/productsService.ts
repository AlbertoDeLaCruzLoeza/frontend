// src/api/productsService.ts
import axios from './axiosInstance';

// Tipos de filtros para productos
export type RawFilters = {
  search?: string;
  dateType?: 'created_at' | 'updated_at' | 'deleted_at';
  startDate?: string;
  endDate?: string;
  isActive?: string;
  brandIds?: string;
  supplierIds?: string;
};


// Limpia los filtros vacíos
const cleanFilters = (obj: Record<string, any>) => {
  const filtered = Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined && v !== null && v !== '')
  );
  console.log('Params después de cleanFilters:', filtered);
  return filtered;
};

// Transforma filtros en parámetros aceptados por el backend
const transformFilters = (filters: RawFilters): Record<string, any> => {
  const {
    search,
    isActive,
    brandIds,
    supplierIds,
    dateType,
    startDate,
    endDate,
  } = filters;

  const params: Record<string, any> = {};

  if (search) params.search = search;
  if (isActive?.toLowerCase() === 'true' || isActive?.toLowerCase() === 'false') {
    params.isActive = isActive.toLowerCase();
  }
  if (brandIds) params.brandIds = brandIds;
  if (supplierIds) params.supplierIds = supplierIds;

  // Filtros por fechas
  if (dateType && startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    if (start > end) throw new Error('La fecha de inicio no puede ser mayor que la fecha final.');
    if (end > today) throw new Error('La fecha final no puede ser una fecha futura.');

    params.dateType = dateType;
    params.startDate = start.toISOString().slice(0, 10);
    params.endDate = end.toISOString().slice(0, 10);
  }

console.log('Params antes de cleanFilters:', params);
return cleanFilters(params);

}
// --- Peticiones al backend ---

export const getProducts = (filters: RawFilters = {}) => {
  console.log('Filtros originales:', filters);
  const params = transformFilters(filters);
  console.log('Parámetros enviados:', params);

  return axios.get('/products', { params });
};

export const getProductById = (id: string | number) =>
  axios.get(`/products/view/${id}`);

export const createProduct = (data: any) =>
  axios.post('/products', data);

export const updateProduct = (id: string | number, data: any) =>
  axios.put(`/products/${id}`, data);

export const deleteProduct = (id: string | number) =>
  axios.delete(`/products/${id}`); // ID en la ruta como espera Swagger
