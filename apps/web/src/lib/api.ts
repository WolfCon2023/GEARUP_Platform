import axios from 'axios';
import type { ApiResponse } from '@northstar/shared';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post<ApiResponse<{ user: any; token: string }>>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },
  register: async (data: any) => {
    const response = await api.post<ApiResponse<{ user: any; token: string }>>('/auth/register', data);
    return response.data;
  },
  me: async () => {
    const response = await api.get<ApiResponse<{ user: any }>>('/auth/me');
    return response.data;
  },
};

// Modules API
export const modulesAPI = {
  getAll: async (filters?: { grade?: string; subject?: string; pillar?: string; published?: boolean }) => {
    const response = await api.get<ApiResponse<any[]>>('/modules', { params: filters });
    return response.data;
  },
  getById: async (moduleId: string) => {
    const response = await api.get<ApiResponse<any>>(`/modules/${moduleId}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post<ApiResponse<any>>('/modules', data);
    return response.data;
  },
  update: async (moduleId: string, data: any) => {
    const response = await api.put<ApiResponse<any>>(`/modules/${moduleId}`, data);
    return response.data;
  },
};

// Assignments API
export const assignmentsAPI = {
  getAll: async (filters?: { school_id?: string; teacher_id?: string; student_id?: string }) => {
    const response = await api.get<ApiResponse<any[]>>('/assignments', { params: filters });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<any>>(`/assignments/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post<ApiResponse<any>>('/assignments', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put<ApiResponse<any>>(`/assignments/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<void>>(`/assignments/${id}`);
    return response.data;
  },
};

// Progress API
export const progressAPI = {
  update: async (data: any) => {
    const response = await api.post<ApiResponse<any>>('/progress/update', data);
    return response.data;
  },
};

// Alerts API
export const alertsAPI = {
  getAll: async (filters?: any) => {
    const response = await api.get<ApiResponse<any[]>>('/alerts', { params: filters });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<any>>(`/alerts/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post<ApiResponse<any>>('/alerts', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put<ApiResponse<any>>(`/alerts/${id}`, data);
    return response.data;
  },
};

// Dashboards API
export const dashboardsAPI = {
  district: async () => {
    const response = await api.get<ApiResponse<any>>('/dashboard/district');
    return response.data;
  },
  school: async () => {
    const response = await api.get<ApiResponse<any>>('/dashboard/school');
    return response.data;
  },
  teacher: async () => {
    const response = await api.get<ApiResponse<any>>('/dashboard/teacher');
    return response.data;
  },
  student: async () => {
    const response = await api.get<ApiResponse<any>>('/dashboard/student');
    return response.data;
  },
  parent: async () => {
    const response = await api.get<ApiResponse<any>>('/dashboard/parent');
    return response.data;
  },
};

// Reports API
export const reportsAPI = {
  apr: async (year: string, district?: string) => {
    const response = await api.get('/reports/apr', {
      params: { year, district },
      responseType: 'blob',
    });
    return response.data;
  },
  dataCompleteness: async (district?: string) => {
    const response = await api.get<ApiResponse<any>>('/reports/data-completeness', {
      params: { district },
    });
    return response.data;
  },
};

