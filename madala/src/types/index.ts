// Re-export all types from individual files
export * from './user';
export * from './admin';
export * from './product';
export * from './order';
export * from './category';
export * from './cart';
export * from './review';

// Common interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationData;
}
