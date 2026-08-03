import { api } from '../lib/axios';

export interface LoginPayload {
  username?: string;
  emailOrPhone?: string;
  password: string;
}

export interface UserResponse {
  userId: number;
  username: string;
  role: string;
  status: string;
  firstName?: string;
  lastName?: string;
  requirePasswordChange?: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserResponse;
}

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    // Backend expects 'tenDangNhap' and 'password'
    const backendPayload = {
      tenDangNhap: payload.username,
      password: payload.password
    };
    const response = await api.post<any>('/auth/login', backendPayload);
    const data = response.data.data || response.data; // Handle ApiResponse wrapper
    
    // Map backend AuthenticationResponse to frontend AuthResponse
    return {
      accessToken: data.token,
      refreshToken: data.token, // Backend currently doesn't split access/refresh tokens in login response
      tokenType: 'Bearer',
      expiresIn: 3600,
      user: {
        userId: data.thongTinUser?.nguoiDungId,
        username: data.thongTinUser?.tenDangNhap,
        role: data.thongTinUser?.vaiTro,
        status: data.thongTinUser?.trangThai,
        email: data.thongTinUser?.email,
        phone: data.thongTinUser?.soDienThoai
      } as any
    };
  },
  forgotPassword: async (payload: { email: string }) => {
    const response = await api.post('/auth/forgot-password', payload);
    return response.data;
  },
  resetPassword: async (payload: { email: string; otp: string; newPassword: string }) => {
    const response = await api.post('/auth/reset-password', payload);
    return response.data;
  },
  changePassword: async (oldPassword: string, newPassword: string) => {
    const response = await api.post('/auth/change-password', { oldPassword, newPassword });
    return response.data;
  },
  requestChangePasswordOtp: async (oldPassword: string) => {
    const response = await api.post('/auth/change-password/request-otp', { oldPassword });
    return response.data;
  },
  confirmChangePassword: async (otp: string, newPassword: string) => {
    const response = await api.post('/auth/change-password/confirm', { otp, newPassword });
    return response.data;
  }
};
