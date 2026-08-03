import { api } from '../lib/axios';

export interface ClassRoom {
  lopHocId: number;
  tenLop: string;
  khoiLop: number;
  namHoc: {
    namHocId: number;
    tenNamHoc: string;
  };
  siSoToiDa: number;
  trangThai: string;
  giaoVienChuNhiem?: {
    giaoVienId: number;
    hoTen: string;
  };
  siSoHienTai?: number;
}

export interface ClassRoomDto {
  name: string;
  grade: number;
  academicYear: string;
  maxCapacity: number;
}

export const classService = {
  getAllClasses: async (): Promise<ClassRoom[]> => {
    const response = await api.get<ClassRoom[]>('/classes');
    return response.data;
  },

  getClassById: async (id: number): Promise<ClassRoom> => {
    const response = await api.get<ClassRoom>(`/classes/${id}`);
    return response.data;
  },

  createClass: async (data: ClassRoomDto): Promise<ClassRoom> => {
    const response = await api.post<ClassRoom>('/classes', data);
    return response.data;
  },

  updateClass: async (id: number, data: ClassRoomDto): Promise<ClassRoom> => {
    const response = await api.put<ClassRoom>(`/classes/${id}`, data);
    return response.data;
  },

  toggleStatus: async (id: number): Promise<ClassRoom> => {
    const response = await api.put<ClassRoom>(`/classes/${id}/status`);
    return response.data;
  },

  getStudentsByClass: async (id: number): Promise<any[]> => {
    const response = await api.get<any[]>(`/classes/${id}/students`);
    return response.data;
  }
};
