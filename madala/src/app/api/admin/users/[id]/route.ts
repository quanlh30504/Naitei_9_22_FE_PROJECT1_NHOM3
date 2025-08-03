/**
 * API ROUTE: /api/admin/users/[id]
 * 
 * CHỨC NĂNG:
 * - PATCH: Cập nhật trạng thái user (ban/unban)
 * - Chỉ admin mới có quyền thực hiện
 * 
 * PARAMETERS:
 * - id: User ID cần cập nhật (từ URL path)
 * 
 * REQUEST BODY:
 * {
 *   isActive: boolean // true = unban, false = ban
 * }
 * 
 * RESPONSE FORMAT:
 * {
 *   success: boolean,
 *   data: User,
 *   message: string
 * }
 * 
 * AUTHENTICATION: Admin role required
 * DATABASE: Gọi AdminUserHelper.updateUserStatus()
 */

import { NextRequest, NextResponse } from 'next/server';
import { AdminUserHelper } from '@/lib/admin-user-helper';
import { auth } from '@/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication and admin role
    const session = await auth();
    if (!session || session.user?.roles !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { isActive } = body;

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'isActive must be a boolean' 
        },
        { status: 400 }
      );
    }

    const user = await AdminUserHelper.updateUserStatus(id, isActive);

    return NextResponse.json({
      success: true,
      data: user,
      message: 'Cập nhật trạng thái thành công'
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Lỗi khi cập nhật trạng thái người dùng',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
