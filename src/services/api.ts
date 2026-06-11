import request from './request';

export interface PageResult<T> {
  current: number;
  size: number;
  total: number;
  pages: number;
  records: T[];
}

function post<T>(url: string, body?: unknown): Promise<T> {
  return request.post(url, body ?? {}) as unknown as Promise<T>;
}

export interface LoginResponse {
  token: string;
  userId: number;
  username: string;
  nickname: string;
  role: string;
}

export const authApi = {
  login(username: string, password: string) {
    return post<LoginResponse>('/public/auth/login', { username, password });
  },
  logout() {
    return post<void>('/public/auth/logout');
  },
};

export interface ApiProduct {
  id: number;
  name: string;
  sku: string;
  category: string;
  brand: string;
  pointsPrice: number;
  marketPrice: number;
  stock: number;
  soldCount: number;
  status: number;
  description: string;
  imageUrl: string;
  subtitle: string;
  deliveryMethod: string;
  serviceGuarantee: string;
  promotion: string;
  colors: string;
  specs: Array<Record<string, string>>;
  createdAt: string;
  updatedAt: string;
}

export interface ListProductParams {
  page?: number;
  size?: number;
  name?: string;
  category?: string;
}

export const productApi = {
  list(params: ListProductParams = {}) {
    return post<PageResult<ApiProduct>>('/public/product/list', {
      page: params.page ?? 1,
      size: params.size ?? 20,
      name: params.name,
      category: params.category,
    });
  },
};

export interface ApiCategory {
  id: number;
  name: string;
  parentId: number | null;
  icon: string;
  sortOrder: number;
  status: number;
  description: string;
  productCount: number;
  children?: ApiCategory[];
}

export const categoryApi = {
  list() {
    return post<ApiCategory[]>('/public/category/list');
  },
};
