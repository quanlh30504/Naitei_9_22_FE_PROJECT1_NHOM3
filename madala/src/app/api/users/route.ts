import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/lib/db';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

// GET /api/users - Lấy danh sách users với filter và pagination
export async function GET(request: NextRequest) {
    try {
        await connectToDB();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search');
        const role = searchParams.get('role');
        const isActive = searchParams.get('isActive');

        // Xây dựng filter
        const filter: any = {};
        
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        
        if (role) {
            filter.roles = role;
        }
        
        if (isActive !== null && isActive !== undefined) {
            filter.isActive = isActive === 'true';
        }

        // Pagination
        const skip = (page - 1) * limit;

        // Execute queries
        const [users, total] = await Promise.all([
            User.find(filter)
                .select('-password') // Exclude password
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            User.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            success: true,
            data: users,
            totalPages,
            currentPage: page,
            total,
            hasMore: page < totalPages
        });
    } catch (err) {
        console.error('Failed to fetch users:', err);
        return NextResponse.json({ 
            success: false,
            error: 'Failed to fetch users' 
        }, { status: 500 });
    }
}

// POST /api/users - Tạo user mới (nếu cần)
export async function POST(request: NextRequest) {
    try {
        await connectToDB();
        
        const body = await request.json();
        const { name, email, password, roles } = body;

        // Validate required fields
        if (!name || !email || !password) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Name, email and password are required",
                },
                { status: 400 }
            );
        }

        // Kiểm tra email trùng lặp
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Email already exists",
                },
                { status: 400 }
            );
        }

        const newUser = new User({
            name,
            email,
            password, // Sẽ được hash trong pre-save middleware
            roles: roles || 'user',
            isActive: true,
        });

        const savedUser = await newUser.save();
        
        // Remove password from response
        const userResponse = savedUser.toObject();
        delete userResponse.password;
        
        return NextResponse.json({
            success: true,
            data: userResponse,
            message: "User created successfully",
        }, { status: 201 });
    } catch (err) {
        console.error('Failed to create user:', err);
        return NextResponse.json({ 
            success: false,
            error: 'Failed to create user' 
        }, { status: 500 });
    }
}
