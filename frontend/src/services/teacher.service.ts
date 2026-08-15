import { api } from '../lib/axios';
import { classService } from './class.service';
import { useAcademicStore } from '../stores/useAcademicStore';
import { useAuthStore } from '../stores/useAuthStore';

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

// Phản ánh DangBaiResponse (backend) — "học liệu" là dang_bai nguồn GIAO_VIEN_BO_SUNG,
// hoc_lieu đã được sáp nhập vào dang_bai trong thiết kế schema hiện tại của LVTN.
export interface Material {
  dangBaiId: number;
  tenDangBai: string;
  loaiNoiDung: 'H5P' | 'FILE' | 'NATIVE' | 'JSON_TEXT';
  nguonGoc: 'HE_THONG' | 'GIAO_VIEN_BO_SUNG';
  h5pNoiDungId: string | null;
  baiHocId: number;
  tenBaiHoc: string | null;
  khoiLop: number | null;
  monHocId: number | null;
  tenMon: string | null;
  giaoVienId: number | null;
  xpThuong: number;
  duLieuGame: string | null;
  dapAnChuan: string | null;
  ngayTao: string;
}

export interface MaterialUpsertPayload {
  baiHocId: number;
  tenDangBai: string;
  loaiNoiDung: 'H5P' | 'FILE' | 'NATIVE' | 'JSON_TEXT';
  giaoVienId: number;
  h5pNoiDungId?: string;
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
  getClasses: async (options?: { onlyTeaching?: boolean }): Promise<ClassRoom[]> => {
    const profile = await teacherService.getMyTeacherProfile();
    const phanCongs = await classService.getPhanCongByGiaoVien(profile.giaoVienId);
    const currentHocKyId = useAcademicStore.getState().currentHocKyId;
    const filtered = currentHocKyId ? phanCongs.filter((p: any) => p.hocKyId === currentHocKyId) : phanCongs;

    // Lấy tất cả lớp học để kiểm tra xem có lớp nào mình làm GVCN mà không có phân công giảng dạy không
    let tatCaLopHoc: any[] = [];
    if (!options?.onlyTeaching) {
      try {
        tatCaLopHoc = await classService.getAllClasses();
      } catch (e) {
        console.error("Failed to fetch all classes", e);
      }
    }

    const byLop = new Map<number, any>();
    
    // Gộp theo phân công giảng dạy
    filtered.forEach((p: any) => {
      if (!byLop.has(p.lopHocId)) {
        byLop.set(p.lopHocId, { lopHocId: p.lopHocId, tenLop: p.tenLop, monHocList: [] as any[] });
      }
      byLop.get(p.lopHocId).monHocList.push({ monHocId: p.monHocId, maMon: p.maMon, tenMon: p.tenMon, hocKyId: p.hocKyId });
    });

    // Bổ sung thêm các lớp mà giáo viên này làm GVCN (kể cả khi không có phân công giảng dạy nào)
    if (!options?.onlyTeaching) {
      const selectedNamHocId = useAcademicStore.getState().selectedNamHocId;
      tatCaLopHoc.forEach((lop: any) => {
        // Chỉ lấy các lớp thuộc năm học đang được chọn
        if (selectedNamHocId && lop.namHoc?.namHocId !== selectedNamHocId) return;

        if (lop.giaoVienChuNhiem?.giaoVienId === profile.giaoVienId) {
          if (!byLop.has(lop.lopHocId)) {
            byLop.set(lop.lopHocId, { lopHocId: lop.lopHocId, tenLop: lop.tenLop, monHocList: [] as any[] });
          }
        }
      });
    }

    let allStudents: any[] = [];
    try {
      const allStudentsResponse = await api.get('/hoso-hocsinh');
      allStudents = allStudentsResponse.data?.data || allStudentsResponse.data || [];
    } catch (e) {
      console.error("Failed to load students for count", e);
    }

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
            students: allStudents.filter((s: any) => Number(s.lopHocId) === Number(item.lopHocId)).length,
            role: Number((detail as any).giaoVienChuNhiemId || detail.giaoVienChuNhiem?.giaoVienId) === Number(profile.giaoVienId) ? 'Chủ nhiệm' : 'Giáo viên bộ môn',
            monHocList: item.monHocList,
          };
        } catch {
          return { id: item.lopHocId, name: item.tenLop, grade: 0, academicYear: '', students: 0, monHocList: item.monHocList };
        }
      })
    );
  },

  // Danh sách môn học toàn hệ thống (dùng cho các trang chưa nằm trong phạm vi chỉnh lần này)
  getSubjects: async (): Promise<Subject[]> => {
    const response = await api.get('/monhoc');
    return response.data?.data || response.data || [];
  },

  // Lấy danh sách học liệu (Kho học liệu cá nhân của giáo viên).
  getMaterials: async (giaoVienId: number): Promise<Material[]> => {
    const response = await api.get<Material[]>('/giao-vien/dang-bai', { params: { giaoVienId } });
    return response.data;
  },

  getMaterialById: async (id: number | string): Promise<Material> => {
    const response = await api.get<Material>(`/he-thong/dang-bai/${id}`);
    return response.data;
  },

  // Tra cứu học liệu đã gắn với 1 content H5P (dùng khi mở lại Editor để sửa).
  getMaterialByH5pContentId: async (h5pContentId: string): Promise<Material | null> => {
    try {
      const response = await api.get<Material>(`/giao-vien/dang-bai/by-h5p/${h5pContentId}`);
      return response.data;
    } catch (err: any) {
      if (err?.response?.status === 404) return null;
      throw err;
    }
  },

  createMaterial: async (data: MaterialUpsertPayload): Promise<Material> => {
    const response = await api.post<Material>('/giao-vien/dang-bai', data);
    return response.data;
  },

  updateMaterial: async (id: number | string, data: MaterialUpsertPayload): Promise<Material> => {
    const response = await api.put<Material>(`/giao-vien/dang-bai/${id}`, data);
    return response.data;
  },

  deleteMaterial: async (id: number | string, giaoVienId: number): Promise<void> => {
    await api.delete(`/giao-vien/dang-bai/${id}`, { params: { giaoVienId } });
  },

  // === Sách bài tập đúng bộ môn/lớp/học kỳ giáo viên được phân công (Giao bài tập) ===
  getSachBaiTapTheoPhanCong: async (params: { giaoVienId: number; lopHocId: number; maMon: string; hocKyId: number }): Promise<any[]> => {
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
    return all.filter((hs: any) => Number(hs.lopHocId) === Number(lopHocId));
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
    const user = useAuthStore.getState().user;
    if (!user) throw new Error('Not logged in');
    
    // Default to current semester if not provided, assuming ID = 1 for now (or let backend handle if semesterId is null - wait, the API requires it)
    const effectiveSemesterId = semesterId || 1; // You may want to fetch the active semester here or require the component to pass it.
    
    const response = await api.get('/gradebook/classes', { 
      params: { 
        giaoVienId: user.userId, 
        classId, 
        semesterId: effectiveSemesterId 
      } 
    });
    return response.data?.data || response.data;
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
    audience: string | number; // 'TAT_CA' or lopHocId
    pinned: boolean;
  }): Promise<void> => {
    const user = useAuthStore.getState().user;
    if (!user) throw new Error('Not logged in');
    
    const payload = {
      nguoiGuiId: user.userId,
      tieuDe: dto.title,
      noiDung: dto.content,
      loaiThongBao: 'NOI_BO',
      laGhim: dto.pinned || false,
      lopHocId: dto.audience === 'TAT_CA' ? null : Number(dto.audience)
    };
    await api.post('/thongbao', payload);
  },

  getMyAnnouncements: async (): Promise<any[]> => {
    const user = useAuthStore.getState().user;
    if (!user) return [];
    const response = await api.get(`/thongbao/da-gui/${user.userId}`);
    const data = response.data?.data || response.data || [];
    return data;
  },

  getBadges: async (): Promise<{ huyHieuId: number; tenHuyHieu: string; moTa: string | null; iconUrl: string | null; loai?: string }[]> => {
    const response = await api.get('/huy-hieu');
    const data = response.data?.data || response.data || [];
    return data;
  },

  awardBadge: async (studentId: number, dto: { huyHieuId: number; thuKhen: string }): Promise<void> => {
    const profile = await teacherService.getMyTeacherProfile();
    await api.post('/khen-thuong-hoc-sinh/tang-thu-cong', {
      hocSinhId: studentId,
      huyHieuId: dto.huyHieuId,
      giaoVienId: profile.giaoVienId,
      thuKhen: dto.thuKhen,
      nguonCap: 'THU_CONG'
    });
  },

  generateCommentSuggestions: async (submissionId: number): Promise<{ id: number; suggestions: string[] }> => {
    const response = await api.post(`/goi-y-ai-nhan-xet/bai-nop/${submissionId}`);
    return response.data?.data || response.data;
  },

  chooseCommentSuggestion: async (suggestionId: number): Promise<void> => {
    await api.post(`/goi-y-ai-nhan-xet/${suggestionId}/chon`);
  },

  generateExerciseSuggestions: async (payload: { grade?: number; subjectId?: number; topicHint?: string }): Promise<{ suggestions: string[] }> => {
    const response = await api.post('/goi-y-ai-bai-tap', payload);
    return response.data?.data || response.data;
  },

  getDanhSachXetLopHoc: async (classId: number): Promise<any[]> => {
    const response = await api.get(`/ket-qua-cuoi-nam/lop-hoc/${classId}`);
    return response.data?.data || response.data || [];
  },

  luuKetQuaCuoiNam: async (classId: number, hocSinhId: number, dto: {
    ketQuaHocTap: string;
    ketQuaRenLuyen: string;
    quyetDinh: string;
    duocXetDacCach: boolean;
    lyDoDacCach?: string;
    ghiChu?: string;
  }): Promise<void> => {
    await api.put(`/ket-qua-cuoi-nam/lop-hoc/${classId}/hoc-sinh/${hocSinhId}`, dto);
  },

  getMorningReport: async (classId?: number): Promise<{
    id: number;
    classId: number;
    className: string;
    reportDate: string;
    summary: string;
    generatedAt: string;
  }> => {
    const response = await api.get('/bao-cao-ai-buoi-sang', {
      params: classId ? { lopHocId: classId } : undefined,
    });
    return response.data?.data || response.data;
  },

  getDiemTrungBinhMon: async (hocSinhId: number, hocKyId: number = 1): Promise<any[]> => {
    const response = await api.get(`/thong-ke-diem/hoc-sinh/${hocSinhId}/hoc-ky/${hocKyId}`);
    return response.data?.data || response.data || [];
  },
};
