import { NextResponse } from 'next/server';
import connectToDB from '@/lib/db';
import Category from '@/models/Category';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectToDB();

        // truy vấn db lấy categories active, sắp xếp theo level và sortOrder
        const categories = await Category.find({ isActive: true })
            .sort({ level: 1, sortOrder: 1 });

        return NextResponse.json(categories);
    } catch (err) {
        console.error('Failed to fetch categories:', err);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}
// Tạo category mới trong database, phục vụ cho admin 
export async function POST(request: Request) {
    try {
        await connectToDB();
        
        const body = await request.json();
        const category = new Category(body);
        const savedCategory = await category.save();
        
        return NextResponse.json(savedCategory, { status: 201 });
    } catch (err) {
        console.error('Failed to create category:', err);
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}
