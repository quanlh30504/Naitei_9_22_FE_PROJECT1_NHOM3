/**
 * ADMINUSERSERVICE.TS - Client-side API Service cho Admin User Management
 * 
 * CHỨC NĂNG CHÍNH:
 * - Client-side service để gọi admin APIs từ React components
 * - Wrapper cho HTTP requests đến backend API endpoints
 * - Type-safe responses với TypeScript
 * - Centralized error handling cho API calls
 * 
 * METHODS:
 * - getUserStats(): Gọi GET /api/admin/users/stats
 * - getUsers(): Gọi GET /api/admin/users với pagination/search
 * - updateUserStatus(): Gọi PATCH /api/admin/users/[id] để ban/unban
 * 
 * HTTP FEATURES:
 * - Automatic JSON parsing
 * - Response validation (success/error)
 * - Proper error throwing với meaningful messages
 * - URL parameter building cho search/pagination
 * 
 * USAGE: Import và sử dụng trong React components (browser-side)
 * 
 * PATTERN: Mỗi method = 1 API call với standardized response handling
 */

'use client';

import { UserStats, GetUsersResponse, User as UserType } from '@/types/admin';

export class AdminUserService {
    // Lấy thống kê người dùng từ API
    static async getUserStats(): Promise<UserStats> {
        const response = await fetch('/api/admin/users/stats');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Failed to fetch stats');
        }

        return data.data;
    }

    // Lấy danh sách người dùng từ API
    static async getUsers(page = 1, limit = 10, search = ''): Promise<GetUsersResponse> {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (search) {
            params.append('search', search);
        }

        const response = await fetch(`/api/admin/users?${params}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Failed to fetch users');
        }

        return {
            users: data.data.users,
            totalPages: data.data.pagination.totalPages,
            currentPage: data.data.pagination.currentPage,
            totalUsers: data.data.pagination.totalUsers
        };
    }

    // Cập nhật trạng thái người dùng qua API
    static async updateUserStatus(userId: string, isActive: boolean): Promise<UserType> {
        const response = await fetch(`/api/admin/users/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ isActive }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message || 'Failed to update user status');
        }

        return data.data;
    }
}
