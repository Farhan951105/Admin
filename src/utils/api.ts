import axios from 'axios';
import type { LoginFormData, RegisterFormData, User, Tournament, Transaction } from '../types';
import type { DashboardStats } from '../lib/types';
import { API_BASE_URL } from "../lib/constants";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (data: LoginFormData) => {
    const response = await api.post('/api/auth/login', data);
    return response.data;
  },
  
  register: async (data: RegisterFormData) => {
    const response = await api.post('/api/admin/register', data);
    return response.data;
  },
  
  verifyEmail: async (email: string, code: string) => {
    const response = await api.post('/api/admin/verify-email', { email, code });
    return response.data;
  },

  getCurrentAdmin: async () => {
    const response = await api.get('/api/admin/me');
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/api/admin/stats');
    return response.data;
  },
  
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get('/api/admin/users');
    return response.data;
  },
  
  getUserProfile: async (userId: string): Promise<User> => {
    const response = await api.get(`/api/admin/users/${userId}`);
    return response.data;
  },
  
  updateUser: async (userId: string, data: Partial<User>): Promise<User> => {
    const response = await api.put(`/api/admin/users/${userId}`, data);
    return response.data;
  },

  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(`/api/admin/users/${userId}`);
  },
  
  getAllTransactions: async (): Promise<Transaction[]> => {
    const response = await api.get('/api/admin/transactions');
    return response.data;
  },
  
  createTournament: async (tournamentData: FormData): Promise<Tournament> => {
    const response = await api.post('/api/admin/create', tournamentData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.tournament;
  },
  
  getAllTournaments: async (): Promise<Tournament[]> => {
    const response = await api.get('/api/admin/tournaments');
    return response.data;
  },

  getTournamentById: async (id: string): Promise<Tournament> => {
    const response = await api.get(`/api/admin/tournaments/${id}`);
    return response.data;
  },

  getTournamentRegistrations: async (id: string) => {
    const response = await api.get(`/api/admin/tournaments/${id}/registrations`);
    return response.data;
  },

  removeTournamentRegistration: async (tournamentId: string, registrationId: string) => {
    const response = await api.delete(`/api/admin/tournaments/${tournamentId}/registrations/${registrationId}`);
    return response.data;
  },

  updateTournamentStatus: async (tournamentId: string, status: string) => {
    console.log('🔧 API: updateTournamentStatus called with:', { tournamentId, status });
    console.log('🔧 API: Base URL:', API_BASE_URL);
    console.log('🔧 API: Full URL:', `${API_BASE_URL}/api/admin/tournaments/${tournamentId}/status`);
    console.log('🔧 API: Request body:', { status });
    
    const token = localStorage.getItem('adminToken');
    console.log('🔧 API: Admin token exists:', !!token);
    
    const response = await api.put(`/api/admin/tournaments/${tournamentId}/status`, { status });
    console.log('🔧 API: Response received:', response.data);
    return response.data;
  },
};

export default api; 