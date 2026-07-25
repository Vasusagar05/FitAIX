import { create } from 'zustand';
import { apiClient } from './apiClient';

export interface User {
  id: string;
  name: string;
  username: string;
  role: 'user' | 'admin';
  avatarUrl: string;
  goal: string;
  scenarioMode: string;
  viewMode: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => {
  // Initialize state from localStorage if available
  const initialToken = typeof window !== 'undefined' ? localStorage.getItem('fitaix_token') : null;
  const initialUserJson = typeof window !== 'undefined' ? localStorage.getItem('fitaix_user') : null;
  let initialUser: User | null = null;
  
  if (initialUserJson) {
    try {
      initialUser = JSON.parse(initialUserJson);
    } catch (e) {
      console.error('Failed to parse initial user from localStorage', e);
    }
  }

  return {
    token: initialToken,
    user: initialUser,
    isAuthenticated: !!initialToken,
    isLoading: false,
    error: null,

    login: async (username, password) => {
      set({ isLoading: true, error: null });
      try {
        const response = await apiClient.post('/auth/login', { username, password });
        const { token, user } = response.data.data;
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('fitaix_token', token);
          localStorage.setItem('fitaix_user', JSON.stringify(user));
        }
        
        set({ token, user, isAuthenticated: true, isLoading: false, error: null });
        return true;
      } catch (err: any) {
        const errMsg = err.message || 'Invalid username or password';
        set({ error: errMsg, isLoading: false });
        return false;
      }
    },

    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('fitaix_token');
        localStorage.removeItem('fitaix_user');
      }
      set({ token: null, user: null, isAuthenticated: false, error: null });
    },

    checkAuth: async () => {
      const token = localStorage.getItem('fitaix_token');
      if (!token) {
        set({ token: null, user: null, isAuthenticated: false, isLoading: false });
        return;
      }

      set({ isLoading: true });
      try {
        const response = await apiClient.get('/auth/me');
        const user = response.data.data;
        set({ user, isAuthenticated: true, isLoading: false });
      } catch (err) {
        // Token is invalid/expired
        if (typeof window !== 'undefined') {
          localStorage.removeItem('fitaix_token');
          localStorage.removeItem('fitaix_user');
        }
        set({ token: null, user: null, isAuthenticated: false, isLoading: false });
      }
    }
  };
});
