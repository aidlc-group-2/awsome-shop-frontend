import axios from 'axios';

/**
 * Backend uses a uniform envelope: { code, message, data }.
 * `code === 'SUCCESS'` means success; otherwise treat as an error.
 */
export interface ApiResult<T> {
  code: string;
  message: string;
  data: T;
}

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
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
  (response) => {
    const body = response.data as ApiResult<unknown>;
    if (body && typeof body === 'object' && 'code' in body) {
      if (body.code === 'SUCCESS') {
        return body.data;
      }
      return Promise.reject(new Error(body.message || body.code || '请求失败'));
    }
    return response.data;
  },
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default request;
