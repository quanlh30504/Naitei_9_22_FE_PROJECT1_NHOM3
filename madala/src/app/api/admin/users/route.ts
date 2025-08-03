/**
 * API ROUTE: /api/admin/users
 * 
 * CHỨC NĂNG:
 * - GET: Lấy danh sách users với pagination và search
 * - Chỉ admin mới có quyền truy cập
 * 
 * QUERY PARAMETERS:
 * - page: Số trang (default: 1)
 * - limit: Số users per page (default: 10)  
 * - search: Tìm kiếm theo name, email, phone
 * 
 * RESPONSE FORMAT:
 * {
 *   success: boolean,
 *   data: {
 *     users: User[],
 *     pagination: {
 *       currentPage: number,
 *       totalPages: number,
 *       totalUsers: number
 *     }
 *   }
 * }
 * 
 * AUTHENTICATION: Admin role required
 * DATABASE: Gọi AdminUserHelper.getUsers()
 */

import { NextRequest, NextResponse } from 'next/server';
import { AdminUserHelper } from '@/lib/admin-user-helper';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await auth();
    if (!session || session.user?.roles !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const result = await AdminUserHelper.getUsers({ page, limit, search });

    return NextResponse.json({
      success: true,
      data: {
        users: result.users,
        pagination: {
          currentPage: result.currentPage,
          totalPages: result.totalPages,
          totalUsers: result.totalUsers
        }
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Lỗi khi lấy danh sách người dùng',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}