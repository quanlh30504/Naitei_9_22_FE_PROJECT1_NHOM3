import { NextRequest, NextResponse } from 'next/server';
import BlogPost from '@/models/BlogPost';
import connectToDB from '@/lib/db';


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDB();
    const { slug } = await params;

    // Get current blog post and increment view count
    const blogPost = await BlogPost.findOneAndUpdate(
      { slug, isPublished: true },
      { $inc: { viewCount: 1 } },
      { new: true }
    ).lean();

    if (!blogPost) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy bài viết' },
        { status: 404 }
      );
    }

    const singleBlogPost = Array.isArray(blogPost) ? blogPost[0] : blogPost;

    // Get previous and next posts for navigation
    const [previousPost, nextPost] = await Promise.all([
      BlogPost.findOne({
        isPublished: true,
        publishedAt: { $lt: singleBlogPost.publishedAt }
      })
      .sort({ publishedAt: -1 })
      .select('title slug')
      .lean(),
      
      BlogPost.findOne({
        isPublished: true,
        publishedAt: { $gt: singleBlogPost.publishedAt }
      })
      .sort({ publishedAt: 1 })
      .select('title slug')
      .lean()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        post: blogPost,
        navigation: {
          previous: previousPost,
          next: nextPost
        }
      }
    });

  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi server nội bộ' },
      { status: 500 }
    );
  }
}