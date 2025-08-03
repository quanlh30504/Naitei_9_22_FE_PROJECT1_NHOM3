/**
 * ADMIN-USER-HELPER.TS - Database Operations cho Admin User Management
 * 
 * CHỨC NĂNG CHÍNH:
 * - Server-side database operations cho admin user management
 * - Tương tác trực tiếp với MongoDB qua Mongoose
 * - Helper functions được gọi bởi API routes
 * - KHÔNG được import ở client-side (browser)
 * 
 * METHODS:
 * - getUserStats(): Tính toán thống kê users (total, active, banned, etc.)
 * - getUsers(): Lấy danh sách users với pagination và search
 * - getUserById(): Lấy thông tin user theo ID
 * - updateUserStatus(): Cập nhật trạng thái ban/unban user
 * 
 * DATABASE OPERATIONS:
 * - User.countDocuments() cho statistics
 * - User.find() với pagination, sorting, searching
 * - User.findByIdAndUpdate() cho status updates
 * - Proper error handling và data formatting
 * 
 * USAGE: Chỉ được sử dụng trong API routes (/api/admin/users/*)
 */

import connectToDB from '@/lib/db';
import User from '@/models/User';
import { UserStats, GetUsersParams, GetUsersResponse, User as UserType } from '@/types/admin';

export class AdminUserHelper {
    // Lấy thống kê người dùng từ database
    static async getUserStats(): Promise<UserStats> {
        try {
            await connectToDB();

            const [
                totalUsers,
                totalAdmins,
                totalRegularUsers,
                activeUsers,
                bannedUsers,
                weeklyUsers
            ] = await Promise.all([
                User.countDocuments(),
                User.countDocuments({ roles: 'admin' }),
                User.countDocuments({ roles: { $ne: 'admin' } }),
                User.countDocuments({ isActive: true }),
                User.countDocuments({ isActive: false }),
                User.countDocuments({
                    createdAt: {
                        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    }
                })
            ]);

            return {
                totalUsers,
                totalAdmins,
                totalRegularUsers,
                activeUsers,
                bannedUsers,
                weeklyUsers
            };
        } catch (error) {
            console.error('Error fetching user stats:', error);
            throw new Error('Lỗi khi lấy thống kê người dùng');
        }
    }

    // Lấy danh sách người dùng từ database với phân trang và tìm kiếm
    static async getUsers(params: GetUsersParams = {}): Promise<GetUsersResponse> {
        try {
            await connectToDB();

            const { page = 1, limit = 10, search = '' } = params;
            const skip = (page - 1) * limit;

            // Tạo query tìm kiếm
            let searchQuery = {};
            if (search) {
                searchQuery = {
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { email: { $regex: search, $options: 'i' } },
                        { phone: { $regex: search, $options: 'i' } }
                    ]
                };
            }

            // Lấy users và tổng số
            const [users, totalUsers] = await Promise.all([
                User.find(searchQuery)
                    .select('name email phone roles isActive createdAt updatedAt')
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                User.countDocuments(searchQuery)
            ]);

            const totalPages = Math.ceil(totalUsers / limit);

            return {
                users: users.map((user: any) => ({
                    _id: user._id.toString(),
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    roles: user.roles || 'user',
                    isActive: user.isActive ?? true,
                    createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
                    updatedAt: user.updatedAt ? new Date(user.updatedAt).toISOString() : new Date().toISOString()
                })),
                totalPages,
                currentPage: page,
                totalUsers
            };
        } catch (error) {
            console.error('Error fetching users:', error);
            throw new Error('Lỗi khi lấy danh sách người dùng');
        }
    }

    // Lấy thông tin người dùng theo ID từ database
    static async getUserById(userId: string): Promise<UserType> {
        try {
            await connectToDB();

            const user = await User.findById(userId)
                .select('name email phone roles isActive createdAt updatedAt');

            if (!user) {
                throw new Error('Không tìm thấy người dùng');
            }

            return {
                _id: user._id.toString(),
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                roles: user.roles || 'user',
                isActive: user.isActive ?? true,
                createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
                updatedAt: user.updatedAt ? new Date(user.updatedAt).toISOString() : new Date().toISOString()
            };
        } catch (error) {
            console.error('Error fetching user by ID:', error);
            throw new Error('Lỗi khi lấy thông tin người dùng');
        }
    }

    // Cập nhật trạng thái người dùng trong database (ban/unban)
    static async updateUserStatus(userId: string, isActive: boolean): Promise<UserType> {
        try {
            await connectToDB();

            const user = await User.findByIdAndUpdate(
                userId,
                { isActive },
                { new: true }
            ).select('name email phone roles isActive createdAt updatedAt');

            if (!user) {
                throw new Error('Không tìm thấy người dùng');
            }

            return {
                _id: user._id.toString(),
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                roles: user.roles || 'user',
                isActive: user.isActive ?? true,
                createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
                updatedAt: user.updatedAt ? new Date(user.updatedAt).toISOString() : new Date().toISOString()
            };
        } catch (error) {
            console.error('Error updating user status:', error);
            throw new Error('Lỗi khi cập nhật trạng thái người dùng');
        }
    }
}
