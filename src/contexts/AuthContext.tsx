import React, { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import type { AdminUser, LoginFormData, RegisterFormData } from '../types';
import { API_BASE_URL } from "../lib/constants";

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('adminToken'));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('adminToken');
      if (storedToken) {
        try {
          // You could verify the token here
          // For now, we'll just set it
          setToken(storedToken);
          const userData = await authAPI.getCurrentAdmin();
          handleAuthSuccess(userData, storedToken);
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('adminToken');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const handleAuthSuccess = (userData: any, authToken: string) => {
    const avatarUrl = userData.avatar ? `${API_BASE_URL}${userData.avatar}` : '/placeholder.svg';
    const adminUser: AdminUser = {
      id: userData.id.toString(),
      username: userData.username,
      firstName: userData.firstName,
      country: userData.country,
      email: userData.email,
      role: 'admin',
      walletBalance: parseFloat(userData.balance || '0'),
      avatarUrl,
      isEmailVerified: userData.isEmailVerified,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    };

    setUser(adminUser);
    setToken(authToken);
    localStorage.setItem('adminToken', authToken);
    navigate('/dashboard');
  };

  const login = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(data);
      handleAuthSuccess(response.user, response.token);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const response = await authAPI.register(data);
      // For admin registration, we don't automatically log in
      // User needs to verify email first
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (email: string, code: string) => {
    setIsLoading(true);
    try {
      await authAPI.verifyEmail(email, code);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Email verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const value = useMemo(() => ({
    user,
    token,
    login,
    register,
    verifyEmail,
    logout,
    isLoading,
  }), [user, token, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 