import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/services/userService';

// GET - Lấy tất cả users
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || undefined;

    const result = await UserService.getAllUsers(page, limit, search);
    
    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch users' 
      },
      { status: 500 }
    );
  }
}

// POST - Tạo user mới  
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, image, roles, firstName, lastName, fullName, phone, isActive } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Name, email and password are required' 
        },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid email format' 
        },
        { status: 400 }
      );
    }

    // Password validation
    if (password.length < 6) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Password must be at least 6 characters long' 
        },
        { status: 400 }
      );
    }

    const user = await UserService.createUser({
      name,
      email,
      password,
      image,
      roles,
      firstName,
      lastName,
      fullName,
      phone,
      isActive
    });

    return NextResponse.json({
      success: true,
      data: user,
      message: 'User created successfully'
    }, { status: 201 });
    
  } catch (error: any) {
    if (error.message === 'User with this email already exists') {
      return NextResponse.json(
        { 
          success: false, 
          error: error.message 
        },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create user' 
      },
      { status: 500 }
    );
  }
}
