export interface Product {
  _id: string;
  productId: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  salePrice: number;
  sku: string;
  stock: number;
  images: string[];
  categoryIds: string[];
  tags: string[];
  attributes: {
    color?: string;
    material?: string;
    brand?: string;
    type?: string;
    size?: Record<string, string> | string;
    weight?: string;
  };
  rating: {
    average: number;
    count: number;
    details: Record<string, number>;
  };
  isActive: boolean;
  isFeatured: boolean;
  isHotTrend: boolean;
  viewCount: number;
  discountPercentage: number;
  commentCount?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// Dùng cho form nhập liệu sản phẩm (tạo/sửa), các trường số là string để dễ validate
export interface ProductFormData {
  name: string;
  description: string;
  shortDescription: string;
  price: string;
  salePrice: string;
  sku: string;
  stock: string;
  images: string[];
  categoryIds: string[];
  tags: string[];
  attributes: {
    brand?: string;
    type?: string;
    material?: string;
    color?: string;
    size?: string;
    weight?: string;
  };
  isActive: boolean;
  isFeatured: boolean;
  isHotTrend: boolean;
  discountPercentage: string;
}
