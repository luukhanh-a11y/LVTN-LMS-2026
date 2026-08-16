import { api } from '../lib/axios';

export interface NamHoc {
  namHocId: number;
  tenNamHoc: string;
  ngayBatDau: string;
  ngayKetThuc: string;
  trangThai?: 'HIEN_TAI' | 'MOI' | 'CU';
}

export interface HocKy {
  hocKyId: number;
  namHocId: number;
  tenNamHoc: string; // Flattened
  soHocKy: number;
}

export interface CauHinhHeThong {
  cauHinhId: number;
  tenTruong: string;
  logoUrl: string | null;
  diaChi: string | null;
  hotline: string | null;
  emailLienHe: string | null;
  hocKyHienTaiId: number;
  soHocKyHienTai: number;
  tenNamHocHienTai: string;
  danhGiaCuoiNamDangMo: boolean;
  namHocDanhGia: string | null;
}

export const academicService = {
  getNamHocs: async (): Promise<NamHoc[]> => {
    const response = await api.get('/namhoc');
    return response.data?.data || response.data || [];
  },

  getAllHocKy: async (): Promise<HocKy[]> => {
    const response = await api.get('/hoc-ky');
    return response.data?.data || response.data || [];
  },

  // Không có endpoint lọc theo năm học ở backend — lấy hết rồi lọc client-side.
  getHocKysByNamHoc: async (namHocId: number): Promise<HocKy[]> => {
    const all = await academicService.getAllHocKy();
    return all.filter((hk) => hk.namHocId === namHocId);
  },

  createHocKy: async (data: { namHocId: number; soHocKy: number }): Promise<HocKy> => {
    const response = await api.post('/hoc-ky', data);
    return response.data?.data || response.data;
  },

  // Cấu hình hệ thống chỉ có 1 bản ghi duy nhất, luôn có cauHinhId = 1
  getCauHinhHeThong: async (): Promise<CauHinhHeThong> => {
    const response = await api.get('/cau-hinh-he-thong/1');
    return response.data?.data || response.data;
  }
};
