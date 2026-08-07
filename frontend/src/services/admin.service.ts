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
    const response = await api.post('/nguoi-dung/import', formData, {
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

  searchUsers: async (params: { role?: string; keyword?: string; status?: string; classId?: string; grade?: string; subject?: string; page?: number; size?: number }): Promise<any> => {
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
        tenCon: u.tenCon,
        lopCuaCon: u.lopCuaCon,
        maGiaoVien: u.maGiaoVien,
        boMon: u.boMon,
        lopGiangDay: u.lopGiangDay,
        classIds: u.classIds
      })),
      totalPages: response.data?.data?.totalPages || 0,
      totalElements: response.data?.data?.totalElements || 0,
      last: response.data?.data?.last || true
    };
  },
  toggleUserStatus: async (userId: number, status: string): Promise<any> => {
    const response = await api.put(`/nguoi-dung/${userId}/trang-thai`, { trangThai: status });
    return response.data?.data || response.data;
  },

  updateUser: async (userId: number, data: any): Promise<any> => {
    const response = await api.put(`/nguoi-dung/${userId}`, data);
    return response.data?.data || response.data;
  },

  transferClass: async (userId: number | string, newClassId: number, reason?: string): Promise<any> => {
    const response = await api.post('/lich-su-chuyen-lop/chuyen-lop', {
      hocSinhId: String(userId),
      lopHocMoiId: newClassId,
      lyDoChuyen: reason || 'Chuyển lớp bởi Admin',
    });
    return response.data;
  },


  chuyenLopGiuaKy: async (data: { hocSinhId: number | string; lopHocCuId: number; lopHocMoiId: number; lyDoChuyen: string }): Promise<any> => {
    const response = await api.post('/lich-su-chuyen-lop/chuyen-lop', data);
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

  thucHienChuyenLopTuKetQua: async (data: { ketQuaId: number; quyetDinh: string; lopHocMoiId?: number }): Promise<any> => {
    const response = await api.post('/ket-qua-cuoi-nam/thuc-hien-chuyen-lop-tu-ket-qua', data);
    return response.data;
  },

  chuyenLopHangLoat: async (requests: any[]): Promise<any> => {
    const response = await api.post('/lich-su-chuyen-lop/chuyen-lop', requests);
    return response.data;
  },

  bulkThucHienChuyenLop: async (data: { hocSinhIds: number[]; lopHocMoiId: number | null; lyDo: string }): Promise<any> => {
    const response = await api.post('/lich-su-chuyen-lop/bulk-chuyen-lop', data);
    return response.data;
  },

  thongBaoMoDanhGia: async (namHoc: string): Promise<any> => {
    const response = await api.post('/ket-qua-cuoi-nam/thong-bao-mo-danh-gia', null, { params: { namHoc } });
    return response.data;
  },

  createNamHoc: async (data: { tenNamHoc: string; ngayBatDau: string; ngayKetThuc: string; cloneTuNamHocId?: number }): Promise<any> => {
    const response = await api.post('/nam-hoc', data);
    return response.data;
  },

  createHocKy: async (data: { tenHocKy: string; namHocId: number; ngayBatDau: string; ngayKetThuc: string }): Promise<any> => {
    const response = await api.post('/hoc-ky', data);
    return response.data;
  },

  cloneSach: async (params: { monHocId: number; khoiLop: number; hocKyOldId: number; hocKyNewId: number; copyChildren?: boolean; chiLayDangBaiHeThong?: boolean }): Promise<any> => {
    const response = await api.post('/sach/nhan-ban', null, { params });
    return response.data;
  },

  cloneChuDe: async (params: { chuDeOldId: number; sachNewId: number; copyChildren?: boolean; chiLayDangBaiHeThong?: boolean }): Promise<any> => {
    const response = await api.post('/chu-de/nhan-ban', null, { params });
    return response.data;
  },

  cloneBaiHoc: async (params: { baiHocOldId: number; chuDeNewId: number; chiLayDangBaiHeThong?: boolean }): Promise<any> => {
    const response = await api.post('/bai-hoc/nhan-ban', null, { params });
    return response.data;
  },

  getBoSachList: async (): Promise<any[]> => {
    const response = await api.get('/sach');
    return response.data?.data || response.data || [];
  },

  getMonHocList: async (): Promise<any[]> => {
    const response = await api.get('/monhoc');
    return response.data?.data || response.data || [];
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
    return response.data?.data || response.data;
  }
};

