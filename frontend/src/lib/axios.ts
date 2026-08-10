import axios from 'axios';
import { useAuthStore } from '../stores/useAuthStore';
import { useAcademicStore } from '../stores/useAcademicStore';

export const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const attachToken = (config: any) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  const selectedNamHoc = useAcademicStore.getState().selectedNamHoc;
  if (selectedNamHoc) {
    config.headers['X-Academic-Year'] = selectedNamHoc;
  }
  
  return config;
};

// --- LOGGING INTERCEPTOR (REQUEST) ---
api.interceptors.request.use((config: any) => {
  console.log(`[API REQUEST] 🚀 ${config.method?.toUpperCase()} ${config.url}`, config.data || config.params || '');
  return attachToken(config);
});

// Client riêng gọi backend H5P (NestJS) — dùng chung JWT với Spring Boot (shared secret)
export const h5pApi = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

h5pApi.interceptors.request.use(attachToken);

// --- LOGGING INTERCEPTOR (RESPONSE) ---
api.interceptors.response.use(
  (response) => {
    console.log(`[API RESPONSE] ✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const failedUrl = originalRequest?.url;
    const failedStatus = error.response?.status;
    console.error(`[AXIOS ❌] ${originalRequest?.method?.toUpperCase()} ${failedUrl} → ${failedStatus}`);

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = useAuthStore.getState().refreshToken;

      if (refreshToken && window.location.pathname !== '/login' && !originalRequest.url?.includes('/refresh')) {
        try {
          const res = await axios.post('http://localhost:8080/api/auth/refresh', { token: refreshToken });
          // Backend trả về { token, authenticated, thongTinUser } — không phải { accessToken }
          const raw = res.data.data || res.data;
          const newToken = raw.token || raw.accessToken;
          const newRefreshToken = raw.refreshToken || raw.token;

          if (newToken) {
            const currentUser = useAuthStore.getState().user;
            if (currentUser) {
              useAuthStore.getState().setAuth(newToken, newRefreshToken, currentUser);
            }
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          console.error('[AXIOS] Refresh token failed, logging out.', refreshError);
          useAuthStore.getState().logout();
          // Tạm thời comment dòng này để không bị mất log
          // window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      // Không có refreshToken hoặc refresh thất bại
      console.error(`[AXIOS ❌ LOGOUT] 401 không thể xử lý → logout. URL gây ra: ${failedUrl}`);
      useAuthStore.getState().logout();
      if (window.location.pathname !== '/login') {
        // Tạm thời comment dòng này để không bị mất log
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
