import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/services/userService';

// GET - Lấy thống kê users
export async function GET() {
  try {
    const stats = await UserService.getUserStats();
    
    return NextResponse.json({
      success: true,
      data: stats
    });
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch user statistics' 
      },
      { status: 500 }
    );
  }
}
