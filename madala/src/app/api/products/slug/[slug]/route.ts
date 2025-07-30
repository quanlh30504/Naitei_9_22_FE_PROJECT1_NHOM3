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

    // Tìm sản phẩm theo slug
    const product = await db.collection("products").findOne({
      slug: slug,
      $or: [{ isActive: { $exists: false } }, { isActive: true }],
    });

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: "Product not found",
        },
        { status: 404 }
      );
    }

    await db
      .collection("products")
      .updateOne({ slug: slug }, { $inc: { viewCount: 1 } });

    const relatedProducts = await db
      .collection("products")
      .find({
        _id: { $ne: product._id },
        categoryIds: { $in: product.categoryIds },
        isActive: true,
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
