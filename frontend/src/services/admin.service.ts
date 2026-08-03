import { api } from '../lib/axios';

export interface ImportError {
  row: number;
  issue: string;
}

export interface ImportResponse {
  timestamp: string;
  status: number;
  errorCode: string;
  message: string;
  details: ImportError[];
}

export const adminService = {
  importUsers: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/admin/import/users', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  importTeachers: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/admin/import/teachers', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  createUser: async (data: any): Promise<any> => {
    const response = await api.post('/admin/users', data);
    return response.data;
  },

  getAllUsers: async (): Promise<any[]> => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  toggleUserStatus: async (userId: number): Promise<any> => {
    const response = await api.put(`/admin/users/${userId}/status`);
    return response.data;
  },

  updateUser: async (userId: number, data: any): Promise<any> => {
    const response = await api.put(`/admin/users/${userId}`, data);
    return response.data;
  },

  transferClass: async (userId: number, newClassId: number, reason?: string): Promise<any> => {
    const params = new URLSearchParams({ newClassId: String(newClassId) });
    if (reason) params.set('reason', reason);
    const response = await api.put(`/admin/users/${userId}/transfer-class?${params.toString()}`);
    return response.data;
  },

  getClassTransferHistory: async (userId: number): Promise<any> => {
    const response = await api.get(`/admin/users/${userId}/class-transfer-history`);
    return response.data;
  },

  getTongHopKetQuaCuoiNam: async (namHoc?: string, khoiLop?: number): Promise<any[]> => {
    const response = await api.get('/admin/ket-qua-cuoi-nam', { params: { namHoc, khoiLop } });
    return response.data;
  },

  getSystemConfig: async (): Promise<any> => {
    const response = await api.get('/admin/config');
    return response.data;
  },

  updateSystemConfig: async (data: any): Promise<any> => {
    const response = await api.put('/admin/config', data);
    return response.data;
  },

  getDashboardStats: async (): Promise<any> => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  }
};
