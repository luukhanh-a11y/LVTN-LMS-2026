import { api } from '../lib/axios';

export const parentService = {
  getDashboard: async (childId?: number) => {
    const response = await api.get('/parents/me/dashboard', { params: childId ? { childId } : undefined });
    return response.data;
  },
  
  getChildren: async () => {
    const response = await api.get('/parents/me/children');
    return response.data;
  },

  getGrades: async (childId?: number) => {
    const response = await api.get('/parents/me/grades', { params: childId ? { childId } : undefined });
    return response.data;
  },

  getAssignments: async (childId: number) => {
    const response = await api.get(`/parents/me/children/${childId}/assignments`);
    return response.data;
  },

  // Không có /parents/me/notifications trên backend — dùng chung /hop-thu-thong-bao
  // theo nguoiDungId, giống cách student.service.ts đã làm đúng.
  getNotifications: async () => {
    try {
      const infoRes = await api.get('/nguoi-dung/my-info');
      const nguoiDungId = (infoRes.data.data || infoRes.data).nguoiDungId;
      if (!nguoiDungId) return [];
      const [ghimRes, khongGhimRes] = await Promise.all([
        api.get(`/hop-thu-thong-bao/nguoi-dung/${nguoiDungId}/ghim`),
        api.get(`/hop-thu-thong-bao/nguoi-dung/${nguoiDungId}/khong-ghim`)
      ]);

      const mapNoti = (n: any, pinned: boolean) => ({
        id: n.thongBaoId,
        title: n.tieuDe,
        content: n.noiDung,
        createdAt: n.ngayDang || n.ngayTao,
        date: (n.ngayDang || n.ngayTao) ? new Date(n.ngayDang || n.ngayTao).toLocaleDateString('vi-VN') : '',
        read: !!n.daDoc || !!n.trangThaiDoc,
        pinned,
        type: n.loaiThongBao
      });

      const rawGhim = (ghimRes.data.data || ghimRes.data || []).map((n: any) => mapNoti(n, true));
      const rawKhongGhim = (khongGhimRes.data.data || khongGhimRes.data || []).map((n: any) => mapNoti(n, false));
      return [...rawGhim, ...rawKhongGhim];
    } catch {
      return [];
    }
  },

  markNotificationRead: async (notificationId: number) => {
    await api.post(`/hop-thu-thong-bao/mark-as-read/${notificationId}`);
  },

  markAllNotificationsRead: async (notificationIds: number[]) => {
    await Promise.all(
      notificationIds.map((id) => api.post(`/hop-thu-thong-bao/mark-as-read/${id}`))
    );
  },

  getRewards: async (childId: number) => {
    const response = await api.get(`/parents/me/children/${childId}/rewards`);
    return response.data;
  },

  getSubjectTree: async (childId: number, subjectId: number) => {
    const response = await api.get(`/parents/me/children/${childId}/subject-tree`, { params: { subjectId } });
    return response.data;
  },

  // Chưa có endpoint /parents/me/... cho kết quả cuối năm — dùng thẳng /ket-qua-cuoi-nam/hoc-sinh/{id}
  // (giáo viên cũng dùng chung endpoint này). Trả về null nếu học sinh chưa được xét (bình thường
  // giữa năm học) thay vì ném lỗi, để không làm hỏng phần điểm trung bình môn đã tải được.
  getKetQuaCuoiNam: async (childId: number) => {
    try {
      const response = await api.get(`/ket-qua-cuoi-nam/hoc-sinh/${childId}`);
      return response.data?.data || null;
    } catch {
      return null;
    }
  },

  getSubjects: async () => {
    const response = await api.get('/subjects');
    return response.data;
  },

  getDiemTrungBinhMon: async (childId: number, hocKyId: number = 1) => {
    const response = await api.get(`/thong-ke-diem/hoc-sinh/${childId}/hoc-ky/${hocKyId}`);
    return response.data?.data || response.data || [];
  },

  getChildProfile: async (childId: number) => {
    const response = await api.get(`/parents/me/children/${childId}/profile`);
    return response.data?.data || response.data;
  },

  // Endpoint riêng cho ticket của phụ huynh (không dùng chung /phieuhotro trực tiếp) —
  // backend tự tra đúng NguoiDung của con từ hocSinhId (childId ở đây KHÔNG phải là
  // nguoiDungId mà PhieuHoTro cần), tránh lỗi USER_NOT_FOUND khi gửi thẳng.
  createChildTicket: async (childId: number, loaiYeuCau: string, moTa: string) => {
    const response = await api.post(`/parents/me/children/${childId}/tickets`, { loaiYeuCau, moTa });
    return response.data?.data || response.data;
  }
};

