import { post, type PageResult } from './request';

export interface LoginResponse {
  token: string;
  userId: number;
  username: string;
  nickname: string;
  role: 'EMPLOYEE' | 'ADMIN';
}

export interface RegisterResponse extends LoginResponse {
  email: string;
}

export interface UserDTO {
  id: number;
  username: string;
  email: string;
  nickname: string;
  role: 'EMPLOYEE' | 'ADMIN';
  status: string;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const login = (username: string, password: string) =>
  post<LoginResponse>('/v1/public/auth/login', { username, password });

export const register = (username: string, email: string, password: string, nickname?: string) =>
  post<RegisterResponse>('/v1/public/auth/register', { username, email, password, nickname });

export const logout = () => post<void>('/v1/public/auth/logout');

export const listUsers = (params: {
  page?: number;
  size?: number;
  username?: string;
  role?: string;
  status?: string;
}) => post<PageResult<UserDTO>>('/v1/auth/user/list', params);

export const getUserDetail = (userId: number) =>
  post<UserDTO>('/v1/auth/user/detail', { userId });

export const changeUserRole = (userId: number, role: string) =>
  post<UserDTO>('/v1/auth/user/role', { userId, role });
