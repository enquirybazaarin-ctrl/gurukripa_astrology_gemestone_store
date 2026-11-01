import { api } from './api';

export interface IdentifyRequest {
  name: string;
  phone: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      email: string;
      name?: string;
      role: 'customer' | 'admin';
      phone?: string;
    };
    accessToken: string;
    csrfToken?: string; // CSRF token for state-changing requests
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  identify: async (data: IdentifyRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/identify', data);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};
