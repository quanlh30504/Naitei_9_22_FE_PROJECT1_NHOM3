// Admin-specific interfaces (User interface is now in user.ts)

export interface UserStats {
  totalUsers: number;
  adminUsers: number;
  regularUsers: number;
  recentUsers: number;
  weeklyUsers: number;
  userGrowth: {
    weekly: number;
    monthly: number;
  };
}

export interface UserFormData {
  name: string;
  email: string;
  password: string;
  image: string;
  roles: 'user' | 'admin';
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  isActive: boolean;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Extend NextAuth types
declare module "next-auth" {
  interface User {
    roles?: string;
  }
  
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string | null;
      roles?: string;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    roles?: string;
  }
}
