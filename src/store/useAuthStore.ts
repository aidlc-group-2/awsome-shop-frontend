import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as apiLogin, logout as apiLogout } from '../services/auth';
import { getBalance } from '../services/points';

export type UserRole = 'employee' | 'admin';

export interface UserInfo {
  userId: number;
  username: string;
  displayName: string;
  role: UserRole;
  points?: number;
  avatar?: string;
}

/** 后端角色 EMPLOYEE/ADMIN → 前端路由用的小写角色 */
const toUserRole = (role: string): UserRole =>
  role === 'ADMIN' ? 'admin' : 'employee';

interface AuthState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshPoints: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: async (username: string, password: string) => {
        try {
          const res = await apiLogin(username, password);
          localStorage.setItem('token', res.token);
          set({
            user: {
              userId: res.userId,
              username: res.username,
              displayName: res.nickname || res.username,
              role: toUserRole(res.role),
            },
            isAuthenticated: true,
          });
          // 积分余额异步补充，不阻塞登录跳转
          get().refreshPoints();
          return true;
        } catch {
          return false;
        }
      },
      logout: () => {
        apiLogout().catch(() => {});
        localStorage.removeItem('token');
        set({ user: null, isAuthenticated: false });
      },
      refreshPoints: async () => {
        const user = get().user;
        if (!user) return;
        try {
          const { balance } = await getBalance(user.userId);
          set({ user: { ...get().user!, points: balance } });
        } catch {
          // 积分服务暂不可用时保留旧值，不影响主流程
        }
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
