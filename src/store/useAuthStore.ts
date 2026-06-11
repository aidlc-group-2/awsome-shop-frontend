import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../services/api';

export type UserRole = 'employee' | 'admin';

export interface UserInfo {
  username: string;
  displayName: string;
  role: UserRole;
  points?: number;
  avatar?: string;
}

interface AuthState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

function normalizeRole(role: string): UserRole {
  return role?.toUpperCase() === 'ADMIN' ? 'admin' : 'employee';
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (username: string, password: string) => {
        try {
          const res = await authApi.login(username, password);
          localStorage.setItem('token', res.token);
          set({
            user: {
              username: res.username,
              displayName: res.nickname || res.username,
              role: normalizeRole(res.role),
            },
            isAuthenticated: true,
          });
          return true;
        } catch {
          return false;
        }
      },
      logout: () => {
        authApi.logout().catch(() => {});
        localStorage.removeItem('token');
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
