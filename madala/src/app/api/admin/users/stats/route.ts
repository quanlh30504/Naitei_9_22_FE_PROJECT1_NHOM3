/**
 * API ROUTE: /api/admin/users/stats
 * 
 * CHỨC NĂNG:
 * - GET: Lấy thống kê tổng quan về users trong hệ thống
 * - Chỉ admin mới có quyền truy cập
 * 
 * THỐNG KÊ BAO GỒM:
 * - totalUsers: Tổng số users
 * - totalAdmins: Số lượng admin users
 * - totalRegularUsers: Số lượng regular users  
 * - activeUsers: Số users đang active
 * - bannedUsers: Số users bị banned
 * - weeklyUsers: Số users đăng ký trong 7 ngày qua
 * 
 * RESPONSE FORMAT:
 * {
 *   success: boolean,
 *   data: UserStats
 * }
 * 
 * AUTHENTICATION: Admin role required
 * DATABASE: Gọi AdminUserHelper.getUserStats()
 */

import { NextResponse } from 'next/server';
import { AdminUserHelper } from '@/lib/admin-user-helper';
import { auth } from '@/auth';

export async function GET() {
  try {
    // Check authentication and admin role
    const session = await auth();
    if (!session || session.user?.roles !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const stats = await AdminUserHelper.getUserStats();

    return NextResponse.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Lỗi khi lấy thống kê người dùng',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}