import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/services/userService';

// PATCH - Cập nhật role của user
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { role } = body;

    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User ID is required' 
        },
        { status: 400 }
      );
    }

    if (!role) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Role is required' 
        },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['user', 'admin'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid role. Must be either "user" or "admin"' 
        },
        { status: 400 }
      );
    }

    const user = await UserService.updateUserRole(id, role);

    return NextResponse.json({
      success: true,
      data: user,
      message: 'User role updated successfully'
    });
    
  } catch (error: any) {
    if (error.message === 'User not found') {
      return NextResponse.json(
        { 
          success: false, 
          error: error.message 
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to update user role' 
      },
      { status: 500 }
    );
  }
}
