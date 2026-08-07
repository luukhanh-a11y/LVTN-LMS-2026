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
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = useAuthStore.getState().refreshToken;

      if (refreshToken && window.location.pathname !== '/login' && !originalRequest.url?.includes('/refresh')) {
        try {
          const res = await axios.post('http://localhost:8080/api/auth/refresh', { token: refreshToken });
          const { accessToken, refreshToken: newRefreshToken } = res.data.data || res.data;

          if (accessToken) {
            const currentUser = useAuthStore.getState().user;
            if (currentUser) {
              useAuthStore.getState().setAuth(accessToken, newRefreshToken, currentUser);
            }
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          useAuthStore.getState().logout();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      useAuthStore.getState().logout();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
