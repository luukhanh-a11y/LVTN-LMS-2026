import { api } from '../lib/axios';
import { useAuthStore } from '../stores/useAuthStore';

function mapTicket(item: any) {
  return {
    id: item.phieuId || item.id,
    studentName: item.tenNguoiDungLienQuan || item.studentName || item.nguoiDungLienQuanId || 'Không có',
    teacherName: item.tenNguoiDungTao || item.teacherName || item.nguoiDungTaoId || 'Giáo viên',
    type: item.loaiYeuCau || item.type || 'HO_TRO_KY_THUAT',
    status: item.trangThai || item.status || 'CHO_DUYET',
    createdAt: item.ngayTao || item.createdAt || new Date().toISOString(),
    description: item.moTa || item.description || '',
    adminNote: item.ghiChuXuLy || item.adminNote || '',
  };
}

export const ticketService = {
  // Admin APIs
  getPendingTickets: async () => {
    const response = await api.get('/phieuhotro', { params: { size: 1000 } });
    const raw = response.data?.data?.content || response.data?.data || response.data || [];
    return Array.isArray(raw) ? raw.map(mapTicket) : [];
  },

  searchTickets: async (params: { keyword?: string; loaiPhieu?: string; trangThai?: string; page?: number; size?: number }) => {
    const response = await api.get('/phieuhotro', { params });
    const content = response.data?.data?.content || [];
    return {
      content: content.map(mapTicket),
      totalPages: response.data?.data?.totalPages || 0,
      totalElements: response.data?.data?.totalElements || 0,
      last: response.data?.data?.last || true
    };
  },

  processTicket: async (ticketId: number, status: string, adminNote: string = '') => {
    const currentUser = useAuthStore.getState().user;
    const response = await api.put(`/phieuhotro/${ticketId}/xu-ly`, {
      trangThai: status,
      ghiChuXuLy: adminNote,
      adminXuLyId: currentUser ? String(currentUser.userId) : '1',
    });
    return response.data?.data || response.data;
  },

  // Teacher APIs
  getMyTickets: async () => {
    const currentUser = useAuthStore.getState().user;
    const userId = currentUser ? String(currentUser.userId) : '1';
    const response = await api.get(`/phieuhotro/gui-nguoi-dung/${userId}`);
    const raw = response.data?.data || response.data || [];
    return Array.isArray(raw) ? raw.map(mapTicket) : [];
  },

  createTicket: async (studentId: number | null, type: string, description: string) => {
    const currentUser = useAuthStore.getState().user;
    const response = await api.post('/phieuhotro', {
      nguoiDungTaoId: currentUser ? String(currentUser.userId) : '1',
      nguoiDungLienQuanId: studentId ? String(studentId) : null,
      loaiYeuCau: type,
      moTa: description,
    });
    return response.data?.data || response.data;
  }
};
