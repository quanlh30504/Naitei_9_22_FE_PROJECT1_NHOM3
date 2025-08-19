"use client";
import React, { useTransition, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { addItemToCart } from "@/lib/actions/cart";
import toast from "react-hot-toast";
import { IProduct } from "@/models/Product";
import { Heart, ShoppingCart, Scale } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import SafeImage from "@/Components/SafeImage";
import StarRating from "@/Components/products/StarRating";
import { useCompareStore } from "@/store/useCompareStore";
import { getProductDiscount } from "@/lib/utils";

interface ProductCardProps {
  product: IProduct;
  onAddToCart?: (product: IProduct) => void;
  onToggleFavorite?: (product: IProduct) => void;
}

const ProductCard = React.memo(function ProductCard({
  product,
  onAddToCart,
  onToggleFavorite,
}: ProductCardProps) {
  const router = useRouter();
  const { isInCompare, addToCompare, removeFromCompare } = useCompareStore();
  const { hasDiscount, discountPercent } = useMemo(() =>
    getProductDiscount(product), [product]
  );
  const isProductInCompare = useMemo(() =>
    isInCompare(String(product._id)), [isInCompare, product._id]
  );

  const handleCompareClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const productId = String(product._id) || product.productId || product.id;

    if (isProductInCompare) {
      // Nếu đã có trong danh sách so sánh, loại bỏ
      removeFromCompare(productId);
    } else {
      // Nếu chưa có, thêm vào danh sách so sánh
      addToCompare(product);
    }
  }, [isProductInCompare, removeFromCompare, addToCompare, product]);

  const handleProductClick = useCallback(() => {
    // Chuyển hướng sang page details
    if (product.slug) {
      router.push(`/products/${product.slug}`);
    }
  }, [product.slug, router]);

  const [isPending, startTransition] = useTransition();

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const result = await addItemToCart(String(product._id), 1);
      if (result?.success) {
        toast.success('Đã thêm sản phẩm vào giỏ hàng!');
        router.push('/cart');
      } else {
        toast.error(result?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
      } else {
        toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.035] hover:border-2 hover:border-green-700 dark:hover:border-green-600 border border-transparent transition-all duration-300 overflow-hidden flex flex-col h-full min-h-[400px] cursor-pointer ${isProductInCompare ? "ring-2 ring-[#8ba63a] ring-opacity-50" : ""
        }`}
      onClick={handleProductClick}
    >
      <div
        className="relative group/image cursor-pointer h-48 flex-shrink-0"
        onClick={handleProductClick}
      >
        <SafeImage
          src={product.images?.[0] || ""}
          alt={product.name}
          width={300}
          height={300}
          className="w-full h-full object-cover transition-transform duration-300 group-hover/image:scale-105"
          fallbackClassName="w-full h-full"
        />

        {/* Phần discount */}
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
            -{discountPercent}%
          </div>
        )}

        {/* Button So sánh ở góc trên bên phải */}
        <Button
          size="icon"
          variant={isProductInCompare ? "default" : "secondary"}
          onClick={handleCompareClick}
          className={`absolute top-2 right-2 w-10 h-10 rounded-full transition-all duration-300 ${isProductInCompare
              ? "bg-[#8ba63a] text-white hover:bg-red-500"
              : "bg-white dark:bg-gray-700 bg-opacity-90 dark:bg-opacity-90 text-gray-600 dark:text-gray-300 hover:bg-[#8ba63a] hover:text-white"
            }`}
          title={
            isProductInCompare
              ? "Bỏ khỏi danh sách so sánh"
              : "Thêm vào so sánh"
          }
        >
          <Scale className="w-4 h-4" />
        </Button>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col h-full">
        <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 h-4">
          {product.attributes?.brand || "Brand"}
        </p>

        <h3
          className="font-semibold text-gray-800 dark:text-gray-200 mb-2 line-clamp-2 cursor-pointer hover:text-[#8ba63a] dark:hover:text-[#9CCC65] transition-colors h-12 overflow-hidden leading-5"
          onClick={handleProductClick}
        >
          {product.name}
        </h3>

        <div className="mb-2 h-5">
          <StarRating
            rating={product.rating?.average || 0}
            size="xs"
            showValue={true}
            reviewCount={product.rating?.count || 0}
          />
        </div>

        <div className="mb-3 flex-1 flex items-start">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-[#8ba63a] dark:text-[#9CCC65]">
              {product.salePrice.toLocaleString("vi-VN")}₫
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                {product.price.toLocaleString("vi-VN")}₫
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto pt-2">
          <Button
            onClick={handleBuyNow}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 h-9 shadow-sm hover:shadow-lg hover:scale-105 active:scale-95 focus:ring-2 focus:ring-gray-400"
            disabled={isPending}
            style={{ willChange: 'transform, box-shadow' }}
          >
            <ShoppingCart className="w-3 h-3 mr-1" />
            MUA HÀNG
          </Button>

          <Button
            size="icon"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.(product);
            }}
            className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-9 h-9"
          >
            <Heart className="w-4 h-4 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors" />
          </Button>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
