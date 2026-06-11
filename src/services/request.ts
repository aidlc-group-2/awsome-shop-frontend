import axios from 'axios';

/** 后端统一响应包装（Result<T>） */
export interface ApiResult<T> {
  code: string;
  message: string;
  data: T;
}

/** 后端统一分页结构（PageResult<T>） */
export interface PageResult<T> {
  current: number;
  size: number;
  total: number;
  pages: number;
  records: T[];
}

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
});

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    // 网关/后端失败时也可能带 Result 结构，提取可读 message
    const message =
      error.response?.data?.message || error.message || 'Request failed';
    return Promise.reject(new Error(message));
  },
);

/**
 * 发 POST 并解包 Result<T>：code 非 SUCCESS 时抛错（message 为后端文案）。
 * 全部后端业务接口均为 POST + JSON body。
 */
export async function post<T>(url: string, body: object = {}): Promise<T> {
  const res = (await request.post(url, body)) as unknown as ApiResult<T>;
  if (res.code !== 'SUCCESS') {
    throw new Error(res.message || `API error: ${res.code}`);
  }
  return res.data;
}

export default request;
