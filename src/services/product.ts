import { post, type PageResult } from './request';

export interface ProductDTO {
  id: number;
  name: string;
  sku: string;
  category: string;
  brand: string | null;
  pointsPrice: number;
  marketPrice: number | null;
  stock: number;
  soldCount: number;
  /** 0-已下架 1-已上架 */
  status: number;
  description: string | null;
  imageUrl: string | null;
  subtitle: string | null;
  deliveryMethod: string | null;
  serviceGuarantee: string | null;
  promotion: string | null;
  colors: string | null;
  specs: Array<Record<string, string>> | null;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryDTO {
  id: number;
  name: string;
  parentId: number | null;
  icon: string | null;
  sortOrder: number;
  status: number;
  description: string | null;
  productCount: number;
  children: CategoryDTO[] | null;
}

export interface CreateProductInput {
  name: string;
  sku: string;
  category: string;
  brand?: string;
  pointsPrice: number;
  marketPrice?: number;
  stock?: number;
  status?: number;
  description?: string;
  imageUrl?: string;
  subtitle?: string;
  deliveryMethod?: string;
  serviceGuarantee?: string;
  promotion?: string;
  colors?: string;
  specs?: Array<Record<string, string>>;
}

export const listProducts = (params: {
  page?: number;
  size?: number;
  name?: string;
  category?: string;
}) => post<PageResult<ProductDTO>>('/v1/public/product/list', params);

export const createProduct = (input: CreateProductInput) =>
  post<ProductDTO>('/v1/public/product/create', input);

export const listCategories = (params: { name?: string; status?: number } = {}) =>
  post<CategoryDTO[]>('/v1/public/category/list', params);
