/**
 * ADMIN.TS - TypeScript Type Definitions cho Admin Features
 * 
 * CHỨC NĂNG CHÍNH:
 * - Centralized type definitions cho tất cả admin-related data structures
 * - Shared interfaces giữa client-side và server-side code
 * - Type safety cho API requests/responses
 * - Consistency trong toàn bộ admin module
 * 
 * INTERFACES:
 * - UserStats: Cấu trúc dữ liệu thống kê users
 * - User: User object với admin fields (roles, isActive)
 * - GetUsersParams: Parameters cho pagination/search
 * - GetUsersResponse: Response format cho danh sách users
 * 
 * USAGE:
 * - Import trong AdminUserService, AdminUserHelper
 * - Import trong React components cần type safety
 * - Đảm bảo consistency giữa API và UI
 * 
 * BENEFITS: Type checking, IntelliSense, Refactoring safety
 */

export interface UserStats {
    totalUsers: number;
    totalAdmins: number;
    totalRegularUsers: number;
    activeUsers: number;
    bannedUsers: number;
    weeklyUsers: number;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    roles: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface GetUsersParams {
    page?: number;
    limit?: number;
    search?: string;
}

export interface GetUsersResponse {
    users: User[];
    totalPages: number;
    currentPage: number;
    totalUsers: number;
}
