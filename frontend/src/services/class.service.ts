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
  tenLop: string;
  khoiLop: number;
  namHocId?: number;
  giaoVienChuNhiemId?: number | string | null;
  siSoToiDa: number;
  trangThai?: string;
}

export const classService = {
  getAllClasses: async (): Promise<ClassRoom[]> => {
    const response = await api.get('/lophoc', { params: { size: 1000 } });
    const data = response.data?.data?.content || response.data?.data || response.data || [];
    return data.map((c: any) => ({
      lopHocId: c.lopHocId,
      tenLop: c.tenLop,
      khoiLop: c.khoiLop,
      namHoc: c.namHoc || { namHocId: c.namHocId, tenNamHoc: c.tenNamHoc || 'Năm học' },
      siSoToiDa: c.siSoToiDa,
      trangThai: c.trangThai,
      giaoVienChuNhiem: c.giaoVienChuNhiem || (c.giaoVienChuNhiemId ? { giaoVienId: c.giaoVienChuNhiemId, hoTen: c.tenGiaoVienChuNhiem || 'Giáo viên' } : null),
      siSoHienTai: c.siSoHienTai || 0
    }));
  },

  searchClasses: async (params: { keyword?: string; namHocId?: number; khoiLop?: number; page?: number; size?: number }): Promise<any> => {
    const response = await api.get('/lophoc', { params });
    const content = response.data?.data?.content || [];
    return {
      content: content.map((c: any) => ({
        lopHocId: c.lopHocId,
        tenLop: c.tenLop,
        khoiLop: c.khoiLop,
        namHoc: c.namHoc || { namHocId: c.namHocId, tenNamHoc: c.tenNamHoc || 'Năm học' },
        siSoToiDa: c.siSoToiDa,
        trangThai: c.trangThai,
        giaoVienChuNhiem: c.giaoVienChuNhiem || (c.giaoVienChuNhiemId ? { giaoVienId: c.giaoVienChuNhiemId, hoTen: c.tenGiaoVienChuNhiem || 'Giáo viên' } : null),
        siSoHienTai: c.siSoHienTai || 0
      })),
      totalPages: response.data?.data?.totalPages || 0,
      totalElements: response.data?.data?.totalElements || 0,
      last: response.data?.data?.last ?? true
    };
  },

  getClassById: async (id: number): Promise<ClassRoom> => {
    const response = await api.get(`/lophoc/${id}`);
    return response.data?.data || response.data;
  },

  createClass: async (data: ClassRoomDto): Promise<ClassRoom> => {
    const response = await api.post('/lophoc', data);
    return response.data?.data || response.data;
  },

  updateClass: async (id: number, data: ClassRoomDto): Promise<ClassRoom> => {
    const response = await api.put(`/lophoc/${id}`, data);
    return response.data?.data || response.data;
  },

  toggleStatus: async (id: number, currentStatus: string): Promise<ClassRoom> => {
    // Assuming backend takes a PUT with the inverted status
    const newStatus = currentStatus === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
    // MOCK THIS CALL as there is no endpoint /lophoc/{id}/status yet
    const response = await api.put(`/lophoc/${id}/status`, { trangThai: newStatus });
    return response.data?.data || response.data;
  },

  // Nguồn thật là /hoso-hocsinh — có sẵn hocSinhId (khác nguoiDungId, cần cho chuyển lớp/xét kết quả).
  getStudentsByClass: async (id: number): Promise<any[]> => {
    const response = await api.get('/hoso-hocsinh');
    const all = response.data?.data || response.data || [];
    return all
        .filter((hs: any) => hs.lopHocId === id)
        .map((hs: any) => ({
            id: hs.nguoiDungId,
            hocSinhId: hs.hocSinhId,
            fullName: hs.hoTen,
            maHocSinh: hs.maHocSinh,
            ngaySinh: hs.ngaySinh,
            gioiTinh: hs.gioiTinh,
            tongXp: hs.tongXp ?? 0,
        }));
  },

  getPhanCongByLop: async (lopHocId: number): Promise<any[]> => {
    const response = await api.get(`/phan-cong-giang-day/lop-hoc/${lopHocId}`);
    return response.data?.data || response.data || [];
  },

  getPhanCongByGiaoVien: async (giaoVienId: number) => {
    const res = await api.get(`/phan-cong-giang-day/giao-vien/${giaoVienId}`);
    return res.data?.data || [];
  },

  createPhanCong: async (data: { giaoVienId: string | number; monHocId: number; lopHocId: number; namHocId?: number; hocKyId?: number }): Promise<any> => {
    const response = await api.post('/phan-cong-giang-day', data);
    return response.data;
  },

  deletePhanCong: async (id: number): Promise<any> => {
    const response = await api.delete(`/phan-cong-giang-day/${id}`);
    return response.data;
  },

  chuyenLop: async (data: { hocSinhId: string | number; lopHocCuId?: number; lopHocMoiId: number; lyDoChuyen?: string }): Promise<any> => {
    const response = await api.post('/lich-su-chuyen-lop/chuyen-lop', data);
    return response.data;
  }
};
