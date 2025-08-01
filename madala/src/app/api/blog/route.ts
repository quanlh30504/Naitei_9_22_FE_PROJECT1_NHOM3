import { NextRequest, NextResponse } from 'next/server';
import BlogPost from '@/models/BlogPost';
import connectToDB from '@/lib/db';


export async function GET(request: NextRequest) {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '6');
    const featured = searchParams.get('featured') === 'true';

    const skip = (page - 1) * limit;

    // Build query
    const query: any = { isPublished: true };
    if (featured) {
      query.isFeatured = true;
    }

    // Get total count and blog posts in parallel
    const [total, blogPosts] = await Promise.all([
      BlogPost.countDocuments(query),
      BlogPost.find(query)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('title slug excerpt featuredImage tags viewCount likesCount commentsCount publishedAt')
        .lean()
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        posts: blogPosts,
        pagination: {
          currentPage: page,
          totalPages,
          totalPosts: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi server nội bộ' },
      { status: 500 }
    );
  }
}
