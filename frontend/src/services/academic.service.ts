import { api } from '../lib/axios';

export interface NamHoc {
  namHocId: number;
  tenNamHoc: string;
  ngayBatDau: string;
  ngayKetThuc: string;
}

export interface HocKy {
  hocKyId: number;
  tenHocKy: string;
  ngayBatDau: string;
  ngayKetThuc: string;
}

export const academicService = {
  getNamHocs: async (): Promise<NamHoc[]> => {
    const response = await api.get('/nam-hoc');
    return response.data;
  },

  getHocKysByNamHoc: async (namHocId: number): Promise<HocKy[]> => {
    const response = await api.get(`/hoc-ky/nam-hoc/${namHocId}`);
    return response.data;
  }
};
