import { api } from '../lib/axios';

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

export interface BoSachContentItem {
  id: number;
  tenDangBai: string;
  loai: 'LY_THUYET' | 'TRAC_NGHIEM' | 'NOI_CAP' | 'DIEN_KHUYET' | null;
  hasContent: boolean;
  xpThuong: number;
  baiHocId: number;
  tenBaiHoc: string;
  tenChuDe: string;
  tenSach: string;
  khoiLop: number;
  hocKy: number | null;
  monHocId: number;
  tenMon: string;
}

export interface BaiHocDetailItem {
  id: number;
  tenDangBai: string;
  loai: 'LY_THUYET' | 'TRAC_NGHIEM' | 'NOI_CAP' | 'DIEN_KHUYET' | null;
  xpThuong: number;
  cauHinh: any;
  dapAnChuan: any;
}

export interface BaiHocDetail {
  baiHocId: number;
  tenBaiHoc: string;
  tenChuDe: string;
  tenSach: string;
  khoiLop: number;
  tenMon: string;
  items: BaiHocDetailItem[];
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
  // Lấy danh sách lớp của giáo viên hiện tại (chỉ lớp mình chủ nhiệm)
  getClasses: async (): Promise<ClassRoom[]> => {
    const response = await api.get<ClassRoom[]>('/teachers/me/classes');
    return response.data;
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

  getSubjects: async (): Promise<Subject[]> => {
    const response = await api.get<Subject[]>('/subjects');
    return response.data;
  },

  // Giao bài tập mới
  createAssignment: async (dto: AssignmentCreateDTO): Promise<Assignment> => {
    const response = await api.post<Assignment>('/assignments', dto);
    return response.data;
  },

  // Lấy danh sách bài nộp theo ID bài tập
  getSubmissions: async (assignmentId: number): Promise<Submission[]> => {
    const response = await api.get<Submission[]>(`/assignments/${assignmentId}/submissions`);
    return response.data;
  },

  // Lấy chi tiết một bài nộp (nội dung, điểm, đánh giá nếu đã chấm)
  getSubmissionDetail: async (submissionId: number | string): Promise<SubmissionDetail> => {
    const response = await api.get<SubmissionDetail>(`/submissions/${submissionId}`);
    return response.data;
  },

  // Lấy danh sách bài tập của một lớp
  getAssignmentsByClass: async (classId: number): Promise<Assignment[]> => {
    const response = await api.get<{ content: Assignment[] }>(`/assignments?classId=${classId}`);
    return response.data.content;
  },

  evaluateSubmission: async (submissionId: number, dto: EvaluateDTO): Promise<any> => {
    const response = await api.post(`/submissions/${submissionId}/evaluate`, dto);
    return response.data;
  },

  getAllTeachers: async (): Promise<TeacherProfile[]> => {
    const response = await api.get('/teachers');
    return response.data;
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

  getThuVienGocLibrary: async (): Promise<BoSachContentItem[]> => {
    const response = await api.get<BoSachContentItem[]>('/dang-bai/thu-vien-goc');
    return response.data;
  },

  getBaiHocDetail: async (baiHocId: number): Promise<BaiHocDetail> => {
    const response = await api.get<BaiHocDetail>(`/dang-bai/bai-hoc/${baiHocId}`);
    return response.data;
  },

  getQuizSlots: async (subjectId: number, grade: number): Promise<any[]> => {
    const response = await api.get('/dang-bai/quiz-slots', { params: { subjectId, grade } });
    return response.data;
  },

  getQuizContent: async (dangBaiId: number): Promise<any> => {
    const response = await api.get(`/dang-bai/${dangBaiId}/noi-dung`);
    return response.data;
  },

  saveQuizContent: async (dangBaiId: number, payload: { loai: string; cauHinh: any; dapAnChuan: any }): Promise<void> => {
    await api.put(`/dang-bai/${dangBaiId}/noi-dung`, payload);
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
};
