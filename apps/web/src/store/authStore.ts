import { create } from 'zustand';
import type { UserRole, JWTPayload } from '@northstar/shared';

interface User {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  district_id?: string;
  school_id?: string;
  classes_taught?: string[];
  children?: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Initialize from localStorage
  const storedToken = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  
  const initialState: AuthState = {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken,
    isAuthenticated: !!storedToken && !!storedUser,
    setAuth: (user, token) => {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true });
    },
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ user: null, token: null, isAuthenticated: false });
    },
    checkAuth: () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      set({
        token,
        user: user ? JSON.parse(user) : null,
        isAuthenticated: !!token && !!user,
      });
    },
  };

  return initialState;
});



