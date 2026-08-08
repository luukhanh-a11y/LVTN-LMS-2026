import { api } from '../lib/axios';
import { classService } from './class.service';
import { useAcademicStore } from '../stores/useAcademicStore';

// ===== Interfaces (Types phản ánh cấu trúc JSON từ Backend) =====

export interface ClassRoom {
  id: number;
  name: string;
  grade: number;
  academicYear: string;
  maxCapacity?: number;
  status?: string;
  role?: string;
  students?: number;
  // Các môn giáo viên được phân công dạy ở đúng lớp này (dùng khi giao bài tập — Assignments.tsx)
  monHocList?: { monHocId: number; tenMon: string; hocKyId: number }[];
}

export interface Material {
  id: number;
  title: string;
  type: 'TAI_LIEU' | 'BAI_GIANG_H5P' | 'BAI_TAP_H5P';
  origin: 'THU_VIEN_GOC' | 'GIAO_VIEN_TAO';
  fileUrl: string | null;
  h5pContentId: string | null;
  xpReward: number;
  allowRetry: boolean;
  maxRetryCount: number | null;
  createdAt: string;
  teacherUserId: number | null;
  grade: number | null;
  subjectId: number | null;
  subjectName: string | null;
}

export interface Subject {
  monHocId: number;
  tenMon: string;
  maMon: string | null;
}

export interface TeacherProfile {
  giaoVienId: number;
  maGiaoVien: string | null;
  hoTen: string;
  boMon: string | null;
  ngaySinh: string | null;
}

export interface Assignment {
  baiTapId: number;
  tieuDe: string;
  moTa: string;
  loaiBaiTap: string;
  deadline: string;
  trangThai: string;
  soLanNopLaiToiDa: number;
  ngayTao: string;
}

export interface Submission {
  baiNopId: number;
  noiDungText: string;
  fileDinhKem: string;
  diemTuDong: number | null;
  xpNhanDuoc: number;
  soLanLam: number;
  trangThai: 'CHUA_NOP' | 'DA_NOP' | 'DA_CHAM' | 'YC_LAM_LAI' | 'LUU_NHAP' | 'NOP_TRE';
  laNopTre: boolean;
  thoiDiemNop: string;
}

export interface SubmissionDetail {
  id: number;
  studentName: string;
  assignmentTitle: string;
  textContent: string | null;
  attachmentUrl: string | null;
  autoScore: number | null;
  xpEarned: number;
  attemptNumber: number;
  status: string;
  isLate: boolean;
  submittedAt: string | null;
  evaluationScore: number | null;
  evaluationGrade: string | null;
  evaluationComment: string | null;
  evaluationAction: string | null;
  evaluatedAt: string | null;
}

export interface AssignmentCreateDTO {
  title: string;
  description: string;
  classId: number;
  teacherId: number;
  type: string;
  deadline: string;
  maxResubmitCount: number;
  hocLieuId?: number;
  contentNodeId?: number;
}

export interface EvaluateDTO {
  teacherId: number;   // ID giáo viên chấm bài (bắt buộc)
  grade: string;       // Enum: HOAN_THANH_TOT, HOAN_THANH, CHUA_HOAN_THANH
  comment: string;
  action: string;      // Enum: DUYET, YC_LAM_LAI
  reason?: string;
}

// ===== Service =====

export const teacherService = {
  // Hồ sơ giáo viên đang đăng nhập — nguồn giaoVienId THẬT cho mọi request khác
  // (khác với user.userId, vốn là id đăng nhập/nguoiDungId, không phải giaoVienId).
  getMyTeacherProfile: async (): Promise<{ giaoVienId: number; maGiaoVien: string | null; hoTen: string; boMon: string | null }> => {
    const response = await api.get('/hoso-giaovien/my-profile');
    return response.data?.data || response.data;
  },

  // Danh sách lớp giáo viên được phân công giảng dạy, lọc theo học kỳ hiện tại (useAcademicStore)
  getClasses: async (): Promise<ClassRoom[]> => {
    const profile = await teacherService.getMyTeacherProfile();
    const phanCongs = await classService.getPhanCongByGiaoVien(profile.giaoVienId);
    const currentHocKyId = useAcademicStore.getState().currentHocKyId;
    const filtered = currentHocKyId ? phanCongs.filter((p: any) => p.hocKyId === currentHocKyId) : phanCongs;

    // Gộp theo lopHocId vì 1 lớp có thể có nhiều bản ghi phân công (mỗi bản ghi 1 môn)
    const byLop = new Map<number, any>();
    filtered.forEach((p: any) => {
      if (!byLop.has(p.lopHocId)) {
        byLop.set(p.lopHocId, { lopHocId: p.lopHocId, tenLop: p.tenLop, monHocList: [] as any[] });
      }
      byLop.get(p.lopHocId).monHocList.push({ monHocId: p.monHocId, tenMon: p.tenMon, hocKyId: p.hocKyId });
    });

    return Promise.all(
      Array.from(byLop.values()).map(async (item): Promise<ClassRoom> => {
        try {
          const detail = await classService.getClassById(item.lopHocId);
          return {
            id: item.lopHocId,
            name: item.tenLop,
            grade: detail.khoiLop,
            academicYear: detail.namHoc?.tenNamHoc ?? '',
            maxCapacity: detail.siSoToiDa,
            status: detail.trangThai,
            students: detail.siSoHienTai,
            role: detail.giaoVienChuNhiem?.giaoVienId === profile.giaoVienId ? 'Chủ nhiệm' : 'Giáo viên bộ môn',
            monHocList: item.monHocList,
          };
        } catch {
          return { id: item.lopHocId, name: item.tenLop, grade: 0, academicYear: '', monHocList: item.monHocList };
        }
      })
    );
  },

  // Danh sách môn học toàn hệ thống (dùng cho các trang chưa nằm trong phạm vi chỉnh lần này)
  getSubjects: async (): Promise<Subject[]> => {
    const response = await api.get('/monhoc');
    return response.data?.data || response.data || [];
  },

  // Lấy danh sách học liệu (Kho học liệu). Truyền giaoVienId để lọc "kho cá nhân của tôi".
  getMaterials: async (giaoVienId?: number): Promise<Material[]> => {
    const response = await api.get<Material[]>('/hoc-lieu', {
      params: giaoVienId ? { giaoVienId } : undefined,
    });
    return response.data;
  },

  getMaterialById: async (id: number | string): Promise<Material> => {
    const response = await api.get<Material>(`/hoc-lieu/${id}`);
    return response.data;
  },

  deleteMaterial: async (id: number | string): Promise<void> => {
    await api.delete(`/hoc-lieu/${id}`);
  },

  updateMaterialClassification: async (
    id: number | string,
    data: { grade: number | null; subjectId: number | null },
  ): Promise<Material> => {
    const response = await api.patch<Material>(`/hoc-lieu/${id}/classification`, data);
    return response.data;
  },

  // === Sách bài tập đúng bộ môn/lớp/học kỳ giáo viên được phân công (Giao bài tập) ===
  getSachBaiTapTheoPhanCong: async (params: { giaoVienId: number; lopHocId: number; monHocId: number; hocKyId: number }): Promise<any[]> => {
    const response = await api.get('/sach/sach-bai-tap/phan-cong', { params });
    return response.data?.data || response.data || [];
  },

  getChuDeBySach: async (sachId: number): Promise<any[]> => {
    const response = await api.get(`/chude/sach/${sachId}`);
    return response.data?.data || response.data || [];
  },

  getBaiHocByChuDe: async (chuDeId: number): Promise<any[]> => {
    const response = await api.get(`/bai-hoc/chu-de/${chuDeId}`);
    return response.data?.data || response.data || [];
  },

  getDangBaiByBaiHoc: async (baiHocId: number): Promise<any[]> => {
    const response = await api.get(`/he-thong/dang-bai/bai-hoc/${baiHocId}`);
    return response.data?.data || response.data || [];
  },

  // === Xét kết quả cuối năm (đề xuất — Admin duyệt lần cuối mới thật sự chuyển lớp) ===
  // /nguoi-dung không trả hocSinhId (chỉ nguoiDungId) nên phải lấy qua /hoso-hocsinh.
  getHocSinhByLop: async (lopHocId: number): Promise<{ hocSinhId: number; hoTen: string; maHocSinh: string }[]> => {
    const response = await api.get('/hoso-hocsinh');
    const all = response.data?.data || response.data || [];
    return all.filter((hs: any) => hs.lopHocId === lopHocId);
  },

  getKetQuaCuoiNam: async (hocSinhId: number, namHoc: string): Promise<any> => {
    const response = await api.get(`/ket-qua-cuoi-nam/hoc-sinh/${hocSinhId}/nam-hoc`, { params: { namHoc } });
    return response.data?.data || response.data;
  },

  createKetQuaCuoiNam: async (data: any): Promise<any> => {
    const response = await api.post('/ket-qua-cuoi-nam', data);
    return response.data?.data || response.data;
  },

  updateKetQuaCuoiNam: async (id: number, data: any): Promise<any> => {
    const response = await api.put(`/ket-qua-cuoi-nam/${id}`, data);
    return response.data?.data || response.data;
  },

  // Giao bài tập mới
  createAssignment: async (dto: any): Promise<any> => {
    const response = await api.post('/bai-tap', dto);
    return response.data;
  },

  // Lấy danh sách bài nộp theo ID bài tập
  getSubmissions: async (assignmentId: number): Promise<Submission[]> => {
    const response = await api.get<any>(`/bai-nop/bai-tap/${assignmentId}`);
    return response.data?.data || response.data || [];
  },

  // Lấy chi tiết một bài nộp (nội dung, điểm, đánh giá nếu đã chấm)
  getSubmissionDetail: async (submissionId: number | string): Promise<SubmissionDetail> => {
    const response = await api.get<any>(`/bai-nop/${submissionId}`);
    return response.data?.data || response.data;
  },

  // Lấy danh sách bài tập của một lớp
  getAssignmentsByClass: async (classId: number): Promise<Assignment[]> => {
    const response = await api.get<any>(`/bai-tap/lop-hoc/${classId}`);
    return response.data?.data || response.data || [];
  },

  evaluateSubmission: async (submissionId: number, dto: EvaluateDTO): Promise<any> => {
    const payload = {
      baiNopId: submissionId,
      giaoVienId: dto.teacherId,
      xepLoai: dto.grade,
      nhanXet: dto.comment,
      hanhDong: dto.action,
      ...dto
    };
    const response = await api.post('/danh-gia-bai-lam', payload);
    return response.data?.data || response.data;
  },

  // Sửa lại 1 đánh giá đã chấm trước đó (backend chặn POST trùng bai_nop_id — phải PUT theo id đánh giá)
  updateEvaluation: async (danhGiaId: number, dto: EvaluateDTO): Promise<any> => {
    const payload = {
      giaoVienId: dto.teacherId,
      xepLoai: dto.grade,
      nhanXet: dto.comment,
      hanhDong: dto.action,
      ...dto
    };
    const response = await api.put(`/danh-gia-bai-lam/${danhGiaId}`, payload);
    return response.data?.data || response.data;
  },

  getAllTeachers: async (): Promise<TeacherProfile[]> => {
    const response = await api.get('/hoso-giaovien');
    return response.data?.data || response.data || [];
  },


  getReports: async (classId?: number, semesterId?: number): Promise<any> => {
    const response = await api.get('/teachers/me/reports', { params: { classId, semesterId } });
    return response.data;
  },

  getStudentProgress: async (studentId: number): Promise<any> => {
    const response = await api.get(`/teachers/me/students/${studentId}/progress`);
    return response.data;
  },

  getSemesters: async (): Promise<{ id: number; label: string }[]> => {
    const response = await api.get('/semesters');
    return response.data;
  },

  createAnnouncement: async (dto: {
    title: string;
    content: string;
    audience: 'TAT_CA' | 'PHU_HUYNH' | 'HOC_SINH';
    pinned: boolean;
  }): Promise<void> => {
    await api.post('/teachers/me/announcements', dto);
  },

  getMyAnnouncements: async (): Promise<any[]> => {
    const response = await api.get('/teachers/me/announcements');
    return response.data;
  },

  getBadges: async (): Promise<{ huyHieuId: number; tenHuyHieu: string; moTa: string | null; iconUrl: string | null }[]> => {
    const response = await api.get('/badges');
    return response.data;
  },

  awardBadge: async (studentId: number, dto: { huyHieuId: number; thuKhen: string }): Promise<void> => {
    await api.post(`/teachers/me/students/${studentId}/rewards`, dto);
  },

  generateCommentSuggestions: async (submissionId: number): Promise<{ id: number; suggestions: string[] }> => {
    const response = await api.post(`/submissions/${submissionId}/comment-suggestions`);
    return response.data;
  },

  chooseCommentSuggestion: async (suggestionId: number): Promise<void> => {
    await api.post(`/submissions/comment-suggestions/${suggestionId}/choose`);
  },

  generateExerciseSuggestions: async (payload: { grade?: number; subjectId?: number; topicHint?: string }): Promise<{ suggestions: string[] }> => {
    const response = await api.post('/hoc-lieu/ai-goi-y-bai-tap', payload);
    return response.data;
  },

  getDanhSachXetLopHoc: async (classId: number): Promise<any[]> => {
    const response = await api.get(`/teachers/me/classes/${classId}/ket-qua-cuoi-nam`);
    return response.data;
  },

  luuKetQuaCuoiNam: async (classId: number, hocSinhId: number, dto: {
    ketQuaHocTap: string;
    ketQuaRenLuyen: string;
    quyetDinh: string;
    duocXetDacCach: boolean;
    lyDoDacCach?: string;
    ghiChu?: string;
  }): Promise<void> => {
    await api.put(`/teachers/me/classes/${classId}/students/${hocSinhId}/ket-qua-cuoi-nam`, dto);
  },

  getMorningReport: async (classId?: number): Promise<{
    id: number;
    classId: number;
    className: string;
    reportDate: string;
    summary: string;
    generatedAt: string;
  }> => {
    const response = await api.get('/teachers/me/morning-report', {
      params: classId ? { classId } : undefined,
    });
    return response.data;
  },

  getDiemTrungBinhMon: async (hocSinhId: number, hocKyId: number = 1): Promise<any[]> => {
    const response = await api.get(`/thong-ke-diem/hoc-sinh/${hocSinhId}/hoc-ky/${hocKyId}`);
    return response.data?.data || response.data || [];
  },
};
