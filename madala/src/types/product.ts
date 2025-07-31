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
    size?: Record<string, string>;
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
}
