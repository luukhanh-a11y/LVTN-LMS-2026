import { api } from '../lib/axios';

export interface UserProfileDto {
  username: string;
  email: string | null;
  phone: string | null;
  role: string;
  fullName: string;
  avatarUrl: string | null;
  studentId?: number;
  classId?: number;
  className?: string;
  totalXp?: number;
}

export interface StudentDashboardDto {
  fullName: string;
  className: string;
  academicYear: string;
  totalXp: number;
  recentEvaluations: {
    assignmentTitle: string;
    score?: string;
    grade?: string;
    comment: string;
    evaluatedAt: string;
  }[];
}

export interface TeacherDashboardDto {
  fullName: string;
  homeroomClass: string;
  department: string;
  totalMaterials: number;
  totalAssignments: number;
}

export interface ParentDashboardDto {
  fullName: string;
  phone: string;
  notificationEmail: string;
  children: {
    studentName: string;
    className: string;
  }[];
}

export const userService = {
  getMyProfile: async (): Promise<UserProfileDto> => {
    // 1. Get base info
    const infoRes = await api.get('/nguoi-dung/my-info');
    const baseInfo = infoRes.data.data || infoRes.data;
    const role = baseInfo.vaiTro;

    let profileData: any = {};
    let className = 'Chưa có lớp';

    try {
      if (role === 'HOC_SINH') {
        const hsRes = await api.get('/hoso-hocsinh/my-profile');
        profileData = hsRes.data.data || hsRes.data;
        
        if (profileData.lopHocId) {
          try {
            const lopRes = await api.get(`/lophoc/${profileData.lopHocId}`);
            className = lopRes.data.data?.tenLop || lopRes.data?.tenLop || className;
          } catch(e) {
            console.warn("Could not fetch class name", e);
          }
        }
      } else if (role === 'GIAO_VIEN') {
        const gvRes = await api.get('/hoso-giaovien/my-profile');
        profileData = gvRes.data.data || gvRes.data;
      } else if (role === 'PHU_HUYNH') {
        const phRes = await api.get('/hoso-phuhuynh/my-profile');
        profileData = phRes.data.data || phRes.data;
      }
    } catch (err) {
      console.warn("Could not fetch detailed profile for role:", role, err);
    }

    return {
      username: baseInfo.tenDangNhap,
      email: baseInfo.email,
      phone: baseInfo.soDienThoai,
      role: baseInfo.vaiTro,
      fullName: profileData.hoTen || baseInfo.tenDangNhap, // Fallback to username
      avatarUrl: profileData.anhDaiDienUrl || null,
      // Additional properties based on role can be added here if needed
      studentId: profileData.hocSinhId,
      classId: profileData.lopHocId,
      className: className,
      totalXp: profileData.tongXp
    } as any;
  },
  
  getStudentDashboard: async (): Promise<StudentDashboardDto> => {
    const profile = await userService.getMyProfile();

    return {
      fullName: profile.fullName,
      className: profile.className || 'Chưa có lớp',
      academicYear: '2023 - 2024',
      totalXp: profile.totalXp || 0,
      recentEvaluations: [] // TODO: Fetch from actual grading endpoint when available
    };
  },

  getTeacherDashboard: async (): Promise<TeacherDashboardDto> => {
    const response = await api.get<TeacherDashboardDto>('/teachers/me/dashboard');
    return response.data;
  },

  getParentDashboard: async (): Promise<ParentDashboardDto> => {
    const response = await api.get<ParentDashboardDto>('/parents/me/dashboard');
    return response.data;
  }
};
