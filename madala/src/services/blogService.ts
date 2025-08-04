const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt: string;
  featuredImage: string;
  tags: string[];
  viewCount: number;
  likesCount: number;
  commentsCount: number;
  publishedAt: string;
  formattedDate?: string;
}

export interface BlogListResponse {
  success: boolean;
  data: {
    posts: BlogPost[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalPosts: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface BlogDetailResponse {
  success: boolean;
  data: {
    post: BlogPost;
    navigation: {
      previous: BlogPost | null;
      next: BlogPost | null;
    };
  };
}

export class BlogService {
  /**
   * Get paginated list of blog posts
   */
  static async getBlogPosts(page: number = 1, limit: number = 6): Promise<BlogListResponse> {
    const url = `${API_BASE_URL}/api/blog?page=${page}&limit=${limit}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Lỗi khi tải danh sách bài viết');
    }
    
    return response.json();
  }

  /**
   * Get blog post detail by slug
   */
  static async getBlogPost(slug: string): Promise<BlogDetailResponse> {
    const url = `${API_BASE_URL}/api/blog/${slug}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Lỗi khi tải bài viết');
    }
    
    return response.json();
  }
}

/**
 * Format date string to Vietnamese locale
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

/**
 * Convert image path to API endpoint URL
 */
export const getImageUrl = (imagePath: string): string => {
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  if (imagePath.startsWith('/images/')) {
    return imagePath.replace('/images/', '/api/images/');
  }
  
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return cleanPath.replace('/images/', '/api/images/');
};
