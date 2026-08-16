import { api } from '../lib/axios';
import { useAcademicStore } from '../stores/useAcademicStore';

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
    const response = await api.post('/nguoi-dung/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // window.open() không gắn header Authorization — endpoint export-template yêu cầu JWT,
  // nên phải tải qua axios (có interceptor gắn token) rồi tự tạo link tải xuống.
  downloadTemplate: async (): Promise<void> => {
    const response = await api.get('/nguoi-dung/export-template', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mau-import-nguoi-dung.xlsx';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  getLoImportHistory: async (): Promise<any[]> => {
    const response = await api.get('/lo-import');
    return response.data?.data || response.data || [];
  },

  createUser: async (data: any): Promise<any> => {
    const response = await api.post('/nguoi-dung', data);
    return response.data?.data || response.data;
  },

  getAllUsers: async (): Promise<any[]> => {
    const response = await api.get('/nguoi-dung', { params: { size: 1000 } });
    const data = response.data?.data?.content || response.data?.data || response.data || [];
    return data.map((u: any) => ({
      id: u.nguoiDungId || u.id,
      userId: u.nguoiDungId || u.id,
      username: u.tenDangNhap || u.username,
      fullName: u.hoTen || u.fullName || u.tenDangNhap,
      role: u.vaiTro || u.role,
      status: u.trangThai || u.status,
      phone: u.soDienThoai || u.phone,
      email: u.email,
      
      // New custom fields
      maHocSinh: u.maHocSinh,
      tenLop: u.tenLop,
      khoiLop: u.khoiLop,
      tenCon: u.tenCon,
      lopCuaCon: u.lopCuaCon,
      maGiaoVien: u.maGiaoVien,
      boMon: u.boMon,
      lopGiangDay: u.lopGiangDay,
      classIds: u.classIds
    }));
  },

  searchUsers: async (params: { role?: string; keyword?: string; status?: string; classId?: string; grade?: string; subject?: string; namHocId?: number; page?: number; size?: number }): Promise<any> => {
    try {
      const response = await api.get('/nguoi-dung/search', { params });
      const content = response.data?.data?.content || [];
      return {
        content: content.map((u: any) => ({
        id: u.nguoiDungId || u.id,
        userId: u.nguoiDungId || u.id,
        username: u.tenDangNhap || u.username,
        fullName: u.hoTen || u.fullName || u.tenDangNhap,
        role: u.vaiTro || u.role,
        status: u.trangThai || u.status,
        phone: u.soDienThoai || u.phone,
        email: u.email,
        maHocSinh: u.maHocSinh,
        tenLop: u.tenLop,
        khoiLop: u.khoiLop,
        lopHocId: u.lopHocId,
        tenCon: u.tenCon,
        lopCuaCon: u.lopCuaCon,
        maGiaoVien: u.maGiaoVien,
        boMon: u.boMon,
        lopGiangDay: u.lopGiangDay,
        classIds: u.classIds
      })),
      totalPages: response.data?.data?.totalPages || 0,
      totalElements: response.data?.data?.totalElements || 0,
      last: response.data?.data?.last ?? true
    };
    } catch (e: any) {
      console.error('SEARCH ERROR:', e.response?.data);
      throw e;
    }
  },
  toggleUserStatus: async (userId: number, status: string): Promise<any> => {
    const response = await api.put(`/nguoi-dung/${userId}/trang-thai`, { trangThai: status });
    return response.data?.data || response.data;
  },

  updateUser: async (userId: number | string, data: any): Promise<any> => {
    const response = await api.put(`/nguoi-dung/${userId}`, data);
    return response.data?.data || response.data;
  },

  getUserById: async (userId: number | string): Promise<any> => {
    const response = await api.get(`/nguoi-dung/${userId}`);
    return response.data?.data || response.data;
  },

  getChildrenByParentId: async (idUser: string) => {
    const res = await api.get(`/phu-huynh-hoc-sinh/hoc-sinh/phu-huynh/${idUser}`);
    return res.data?.data || [];
  },
  createParentChildRelation: async (phuHuynhId: number, hocSinhId: number, quanHe: string = 'Phụ huynh') => {
    const res = await api.post(`/phu-huynh-hoc-sinh`, { phuHuynhId, hocSinhId, quanHe });
    return res.data;
  },
  deleteParentChildRelation: async (idMoiQuanHe: number) => {
    const res = await api.delete(`/phu-huynh-hoc-sinh/${idMoiQuanHe}`);
    return res.data;
  },

  // Backend yêu cầu MẢNG List<LichSuChuyenLopRequest>, field "lyDo" (enum LyDoChuyenLop), hocSinhId kiểu number.
  transferClass: async (userId: number | string, newClassId: number, lyDo: string = 'DOI_LOP', ghiChu?: string): Promise<any> => {
    const response = await api.post('/lich-su-chuyen-lop/chuyen-lop', [{
      hocSinhId: Number(userId),
      lopHocMoiId: newClassId,
      lyDo,
      ghiChu,
    }]);
    return response.data;
  },

  chuyenLopGiuaKy: async (data: { hocSinhId: number | string; lopHocCuId: number; lopHocMoiId: number; lyDo: string; ghiChu?: string }): Promise<any> => {
    const response = await api.post('/lich-su-chuyen-lop/chuyen-lop', [{ ...data, hocSinhId: Number(data.hocSinhId) }]);
    return response.data;
  },

  getClassTransferHistory: async (hocSinhId: number): Promise<any> => {
    const response = await api.get(`/lich-su-chuyen-lop/hoc-sinh/${hocSinhId}`);
    return response.data?.data || response.data || [];
  },

  chuyenLopHangLoat: async (requests: any[]): Promise<any> => {
    const response = await api.post('/lich-su-chuyen-lop/chuyen-lop', requests);
    return response.data;
  },

  bulkThucHienChuyenLop: async (data: { hocSinhIds: number[]; lopHocMoiId: number | null; lyDo: string; ghiChu?: string }): Promise<any> => {
    const response = await api.post('/lich-su-chuyen-lop/bulk-chuyen-lop', data);
    return response.data;
  },

  // === Đợt đánh giá cuối năm (CauHinhHeThong) + duyệt hàng loạt Kết quả cuối năm ===
  setDotDanhGia: async (id: number, dangMo: boolean, namHoc?: string): Promise<any> => {
    const response = await api.put(`/cau-hinh-he-thong/${id}/dot-danh-gia`, null, { params: { dangMo, namHoc } });
    return response.data?.data || response.data;
  },

  duyetKetQuaCuoiNamHangLoat: async (requests: { ketQuaId: number; lopMoiId?: number; namHocMoi?: string }[]): Promise<any[]> => {
    const response = await api.post('/ket-qua-cuoi-nam/duyet-hang-loat', requests);
    return response.data?.data || response.data || [];
  },

  getAllKetQuaCuoiNam: async (): Promise<any[]> => {
    const response = await api.get('/ket-qua-cuoi-nam');
    return response.data?.data || response.data || [];
  },

  thongBaoMoDanhGia: async (namHoc: string): Promise<any> => {
    const response = await api.post('/ket-qua-cuoi-nam/thong-bao-mo-danh-gia', null, { params: { namHoc } });
    return response.data;
  },

  createNamHoc: async (data: { tenNamHoc: string; ngayBatDau: string; ngayKetThuc: string; cloneTuNamHocId?: number }): Promise<any> => {
    const response = await api.post('/namhoc', data);
    return response.data;
  },

  createHocKy: async (data: { namHocId: number; soHocKy: number }): Promise<any> => {
    const response = await api.post('/hoc-ky', data);
    return response.data;
  },

  cloneSachKhongChuDe: async (params: { monHocId: number; khoiLop: number; hocKyCuId: number; hocKyMoiId: number }): Promise<any> => {
    const response = await api.post('/sach/nhan-ban-khong-chu-de', null, { params });
    return response.data;
  },

  cloneSachKemChuDe: async (params: { monHocId: number; khoiLop: number; hocKyCuId: number; hocKyMoiId: number }): Promise<any> => {
    const response = await api.post('/sach/nhan-ban-kem-chu-de', null, { params });
    return response.data;
  },

  cloneChuDe: async (params: { chuDeOldId: number; sachNewId: number; copyChildren?: boolean; chiLayDangBaiHeThong?: boolean }): Promise<any> => {
    const response = await api.post('/chude/nhan-ban', null, { params });
    return response.data;
  },

  cloneBaiHoc: async (params: { baiHocOldId: number; chuDeNewId: number; chiLayDangBaiHeThong?: boolean }): Promise<any> => {
    const response = await api.post('/bai-hoc/nhan-ban', null, { params });
    return response.data;
  },

  createSach: async (data: any): Promise<any> => {
    const response = await api.post('/sach', data);
    return response.data?.data || response.data;
  },

  updateSach: async (id: number, data: any): Promise<any> => {
    const response = await api.put(`/sach/${id}`, data);
    return response.data?.data || response.data;
  },

  deleteSach: async (id: number): Promise<void> => {
    await api.delete(`/sach/${id}`);
  },

  createChuDe: async (data: any): Promise<any> => {
    const response = await api.post('/chude', data);
    return response.data?.data || response.data;
  },

  updateChuDe: async (id: number, data: any): Promise<any> => {
    const response = await api.put(`/chude/${id}`, data);
    return response.data?.data || response.data;
  },

  deleteChuDe: async (id: number): Promise<void> => {
    await api.delete(`/chude/${id}`);
  },

  createBaiHoc: async (data: any): Promise<any> => {
    const response = await api.post('/bai-hoc', data);
    return response.data?.data || response.data;
  },

  updateBaiHoc: async (id: number, data: any): Promise<any> => {
    const response = await api.put(`/bai-hoc/${id}`, data);
    return response.data?.data || response.data;
  },

  deleteBaiHoc: async (id: number): Promise<void> => {
    await api.delete(`/bai-hoc/${id}`);
  },

  getBoSachList: async (hocKyId?: number | null): Promise<any[]> => {
    const params: any = {};
    const currentHocKy = hocKyId !== undefined ? hocKyId : useAcademicStore.getState().currentHocKyId;
    if (currentHocKy !== null) {
      params.hocKyId = currentHocKy;
    } else {
      params.namHocId = useAcademicStore.getState().selectedNamHocId;
    }
    const response = await api.get('/sach', { params });
    return response.data?.data || response.data || [];
  },

  getMonHocList: async (): Promise<any[]> => {
    const response = await api.get('/monhoc');
    return response.data?.data || response.data || [];
  },

  createMonHoc: async (data: { tenMon: string; maMon?: string; moTa?: string }): Promise<any> => {
    const response = await api.post('/monhoc', data);
    return response.data?.data || response.data;
  },

  updateMonHoc: async (id: number, data: { tenMon: string; maMon?: string; moTa?: string }): Promise<any> => {
    const response = await api.put(`/monhoc/${id}`, data);
    return response.data?.data || response.data;
  },

  deleteMonHoc: async (id: number): Promise<void> => {
    await api.delete(`/monhoc/${id}`);
  },

  getChuongList: async (): Promise<any[]> => {
    const response = await api.get('/chude');
    return response.data?.data || response.data || [];
  },

  getBaiHocList: async (): Promise<any[]> => {
    const response = await api.get('/bai-hoc');
    return response.data?.data || response.data || [];
  },

  getDangBaiList: async (): Promise<any[]> => {
    const response = await api.get('/he-thong/dang-bai');
    return response.data?.data || response.data || [];
  },

  getDangBaiDetail: async (id: number): Promise<any> => {
    const response = await api.get(`/he-thong/dang-bai/${id}`);
    return response.data?.data || response.data;
  },

  createDangBai: async (data: any): Promise<any> => {
    const response = await api.post('/he-thong/dang-bai', data);
    return response.data?.data || response.data;
  },

  updateDangBai: async (id: number, data: any): Promise<any> => {
    const response = await api.put(`/he-thong/dang-bai/${id}`, data);
    return response.data?.data || response.data;
  },

  // Cấu hình hệ thống chỉ có 1 bản ghi duy nhất, luôn có cauHinhId = 1
  getSystemConfig: async (): Promise<any> => {
    const response = await api.get('/cau-hinh-he-thong/1');
    return response.data?.data || response.data;
  },

  updateSystemConfig: async (data: any): Promise<any> => {
    const response = await api.put('/cau-hinh-he-thong/1', data);
    return response.data?.data || response.data;
  },

  getDashboardStats: async (): Promise<any> => {
    const response = await api.get('/admin/dashboard');
    return response.data?.data || response.data;
  },

  // === Hồ sơ học sinh / giáo viên / phụ huynh (dùng ở useUsersViewModel.ts) ===
  getHoSoHocSinhByMa: async (maHocSinh: string): Promise<any> => {
    const response = await api.get(`/hoso-hocsinh/ma/${maHocSinh}`);
    return response.data?.data || response.data;
  },

  updateHoSoHocSinh: async (id: number, data: any): Promise<any> => {
    const response = await api.put(`/hoso-hocsinh/${id}`, data);
    return response.data?.data || response.data;
  },

  getHoSoGiaoVienByMa: async (maGiaoVien: string): Promise<any> => {
    const response = await api.get(`/hoso-giaovien/ma/${maGiaoVien}`);
    return response.data?.data || response.data;
  },

  updateHoSoGiaoVien: async (id: number, data: any): Promise<any> => {
    const response = await api.put(`/hoso-giaovien/${id}`, data);
    return response.data?.data || response.data;
  },

  getAllHoSoPhuHuynh: async (): Promise<any[]> => {
    const response = await api.get('/hoso-phuhuynh');
    return response.data?.data || response.data || [];
  },

  updateHoSoPhuHuynh: async (id: number, data: any): Promise<any> => {
    const response = await api.put(`/hoso-phuhuynh/${id}`, data);
    return response.data?.data || response.data;
  },

  // === Phân công giảng dạy ===
  getPhanCongByLop: async (lopHocId: number, hocKyId?: number): Promise<any[]> => {
    const params: any = {};
    const currentHocKy = hocKyId || useAcademicStore.getState().currentHocKyId;
    if (currentHocKy) params.hocKyId = currentHocKy;
    const response = await api.get(`/phan-cong-giang-day/lop-hoc/${lopHocId}`, { params });
    return response.data?.data || response.data || [];
  },

  createPhanCong: async (data: { giaoVienId: number; lopHocId: number; monHocId: number; hocKyId: number | null }): Promise<any> => {
    const response = await api.post('/phan-cong-giang-day', data);
    return response.data?.data || response.data;
  },

  deletePhanCong: async (id: number): Promise<void> => {
    await api.delete(`/phan-cong-giang-day/${id}`);
  },

  getTeachers: async (): Promise<any[]> => {
    const response = await api.get('/hoso-giaovien');
    return response.data?.data || response.data || [];
  },

  getThongBaos: async (namHocId?: number): Promise<any[]> => {
    const params: any = {};
    const currentNamHoc = namHocId || useAcademicStore.getState().selectedNamHocId;
    if (currentNamHoc) params.namHocId = currentNamHoc;
    const response = await api.get('/thongbao', { params });
    return response.data?.data || response.data || [];
  },

  createThongBao: async (data: any): Promise<any> => {
    const response = await api.post('/thongbao', data);
    return response.data?.data || response.data;
  },

  updateThongBao: async (id: number, data: any): Promise<any> => {
    const response = await api.put(`/thongbao/${id}`, data);
    return response.data?.data || response.data;
  },

  deleteThongBao: async (id: number): Promise<void> => {
    await api.delete(`/thongbao/${id}`);
  }
};

