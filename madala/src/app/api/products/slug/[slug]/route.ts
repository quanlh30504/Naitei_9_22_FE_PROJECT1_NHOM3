import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// GET /api/products/slug/[slug] - Lấy sản phẩm theo slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const { slug } = await params;
    
    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          error: "Slug is required",
        },
        { status: 400 }
      );
    }

    // Loại bỏ extension nếu có (.jpg, .png, etc.)
    const cleanSlug = slug.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '');
    
    console.log(`Looking for product with slug: ${cleanSlug} (original: ${slug})`);

    // Tìm sản phẩm theo slug (thử cả slug gốc và slug đã clean)
    const product = await db.collection("products").findOne({
      $or: [
        { slug: slug },
        { slug: cleanSlug },
        { productId: slug },
        { productId: cleanSlug }
      ],
      $and: [
        { $or: [{ isActive: { $exists: false } }, { isActive: true }] }
      ]
    });

    if (!product) {
      console.log(`Product not found for slug: ${slug} or cleaned slug: ${cleanSlug}`);
      return NextResponse.json(
        {
          success: false,
          error: "Product not found",
        },
        { status: 404 }
      );
    }

    // Cập nhật view count
    await db
      .collection("products")
      .updateOne(
        { _id: product._id }, 
        { $inc: { viewCount: 1 } }
      );

    // Lấy related products
    const relatedProducts = await db
      .collection("products")
      .find({
        _id: { $ne: product._id },
        categoryIds: { $in: product.categoryIds || [] },
        $or: [{ isActive: { $exists: false } }, { isActive: true }],
      })
      .limit(4)
      .toArray();

    return NextResponse.json({
      success: true,
      data: {
        product: {
          ...product,
          viewCount: (product.viewCount || 0) + 1,
        },
        relatedProducts,
      },
    });
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch product",
      },
      { status: 500 }
    );
  }
}
