import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/services/userService';
import User from '@/models/User';
import connectToDB from '@/lib/db';

// GET - Tạo admin user đầu tiên nếu chưa có
export async function GET() {
  try {
    await connectToDB();
    
    // Kiểm tra xem đã có admin chưa
    const existingAdmin = await User.findOne({ roles: 'admin' });
    if (existingAdmin) {
      return NextResponse.json({
        success: false,
        message: 'Admin user already exists',
        data: {
          email: existingAdmin.email,
          name: existingAdmin.name
        }
      });
    }

    // Tạo admin user đầu tiên
    const adminData = {
      name: 'Admin Madala',
      email: 'admin@madala.com',
      password: 'admin123456',
      roles: 'admin'
    };

    const adminUser = await UserService.createUser(adminData);

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      data: {
        email: adminData.email,
        password: adminData.password,
        note: 'Please change password after first login'
      }
    });

  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create admin user' 
      },
      { status: 500 }
    );
  }
}
