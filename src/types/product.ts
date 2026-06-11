export type ProductStatus = 'active' | 'inactive';

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  pointsPrice: number;
  imageUrl: string;
  stock: number;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  key: string;
  label: string;
}

export interface ProductFormData {
  name: string;
  category: string;
  description: string;
  pointsPrice: number;
  imageUrl: string;
  stock: number;
}

export type CreateProductDto = ProductFormData;

export type UpdateProductDto = Partial<ProductFormData>;

export interface GetProductsParams {
  page: number;
  pageSize: number;
  search?: string;
  category?: string;
  status?: ProductStatus;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}
