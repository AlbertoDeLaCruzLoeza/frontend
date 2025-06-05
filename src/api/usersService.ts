// src/api/usersService.ts
import axios from './axiosInstance';

interface UserFilters {
  email?: string;
  dateType?: 'created_at' | 'updated_at' | 'deleted_at';
  startDate?: string;
  endDate?: string;
  isActive?: boolean | 'pending';
}

export const getUsers = (filters: UserFilters = {}) => {
  const params = new URLSearchParams();

  if (filters.email) params.append('email', filters.email);
  if (filters.dateType) params.append('dateType', filters.dateType);
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.isActive !== undefined) {
    if (filters.isActive === 'pending') {
      params.append('pending', 'true');  // parámetro especial para pendiente
    } else {
      params.append('isActive', filters.isActive.toString());
    }
  }

  return axios.get(`/users?${params.toString()}`);
};

export const getUserById = (id: string) => axios.get(`/users/${id}`);
export const createUser = (data: any) => axios.post('/users', data);
export const updateUser = (id: string, data: any) => axios.put(`/users/${id}`, data);
export const deleteUser = (id: string) => axios.delete(`/users/${id}`);
export const reactivateUser = (id: string) => axios.patch(`/users/${id}`);
