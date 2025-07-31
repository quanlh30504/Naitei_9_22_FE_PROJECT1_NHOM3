import { Product } from '@/types/product';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface ProductsResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface ProductResponse {
  success: boolean;
  data: {
    product: Product;
    relatedProducts: Product[];
  };
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  featured?: boolean;
  hotTrend?: boolean;
}

class ProductService {
  // Lấy tất cả sản phẩm với các tùy chọn filter
  async getProducts(params: ProductQueryParams = {}): Promise<ProductsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.category) searchParams.append('category', params.category);
    if (params.search) searchParams.append('search', params.search);
    if (params.featured) searchParams.append('featured', 'true');
    if (params.hotTrend) searchParams.append('hotTrend', 'true');
    
    const url = `${API_BASE_URL}/api/products?${searchParams.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  // Lấy sản phẩm featured/hot trend cho trang chủ
  async getFeaturedProducts(limit: number = 6): Promise<Product[]> {
    const response = await this.getProducts({ 
      featured: true, 
      hotTrend: true, 
      limit 
    });
    return response.data.products;
  }
  
  // Lấy chi tiết sản phẩm theo ID
  async getProductById(id: string): Promise<ProductResponse> {
    const url = `${API_BASE_URL}/api/products/${id}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 } 
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  // Lấy chi tiết sản phẩm theo slug
  async getProductBySlug(slug: string): Promise<ProductResponse> {
    const url = `${API_BASE_URL}/api/products/slug/${slug}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  // Tìm kiếm sản phẩm
  async searchProducts(query: string, page: number = 1, limit: number = 12): Promise<ProductsResponse> {
    return this.getProducts({
      search: query,
      page,
      limit
    });
  }
}

export const productService = new ProductService();
export default productService;
