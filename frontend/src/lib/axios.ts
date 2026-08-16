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

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

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
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = 'Bearer ' + token;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = useAuthStore.getState().refreshToken;

      if (refreshToken && window.location.pathname !== '/login' && !originalRequest.url?.includes('/refresh')) {
        try {
          const res = await axios.post('http://localhost:8080/api/auth/refresh', { token: refreshToken });
          const raw = res.data.data || res.data;
          const newToken = raw.token || raw.accessToken;
          const newRefreshToken = raw.refreshToken || raw.token;

          if (newToken) {
            const currentUser = useAuthStore.getState().user;
            if (currentUser) {
              useAuthStore.getState().setAuth(newToken, newRefreshToken, currentUser);
            }
            processQueue(null, newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          console.error('[AXIOS] Refresh token failed, logging out.', refreshError);
          useAuthStore.getState().logout();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        isRefreshing = false;
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
