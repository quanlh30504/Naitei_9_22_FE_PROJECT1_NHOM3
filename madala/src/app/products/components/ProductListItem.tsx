"use client";
import React, { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { IProduct } from "@/models/Product";
import { Heart, ShoppingCart, Scale } from "lucide-react";
import { Button } from "@/Components/ui/button";
import SafeImage from "@/Components/SafeImage";
import StarRating from "@/Components/products/StarRating";
import { useCompareStore } from "@/store/useCompareStore";
import { getProductDiscount } from "@/lib/utils";

interface ProductListItemProps {
  product: IProduct;
  onAddToCart?: (product: IProduct) => void;
  onToggleFavorite?: (product: IProduct) => void;
}

const ProductListItem: React.FC<ProductListItemProps> = ({
  product,
  onAddToCart,
  onToggleFavorite,
}) => {
  const router = useRouter();
  const { isInCompare, addToCompare, removeFromCompare } = useCompareStore();

  const discountInfo = useMemo(() => getProductDiscount(product), [product]);
  const { hasDiscount, discountPercent } = discountInfo;

  const isProductInCompare = useMemo(() =>
    isInCompare(String(product._id))
    , [isInCompare, product._id]);

  const handleCompareClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const productId = String(product._id) || product.productId || product.id;

    if (isProductInCompare) {
      removeFromCompare(productId);
    } else {
      addToCompare(product);
    }
  }, [isProductInCompare, removeFromCompare, addToCompare, product]);

  const handleProductClick = useCallback(() => {
    if (product.slug) {
      router.push(`/products/${product.slug}`);
    }
  }, [product.slug, router]);

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(product);
  }, [onAddToCart, product]);

  const handleToggleFavorite = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(product);
  }, [onToggleFavorite, product]);

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden p-4 mb-4 ${isProductInCompare ? "ring-2 ring-[#8ba63a] ring-opacity-50" : ""
        }`}
      onClick={handleProductClick}
    >
      <div className="flex flex-col md:flex-row gap-4">
        {/* Product Image */}
        <div
          className="relative flex-shrink-0 w-full md:w-48 group/image cursor-pointer"
          onClick={handleProductClick}
        >
          <SafeImage
            src={product.images?.[0] || ""}
            alt={product.name}
            width={200}
            height={200}
            className="w-full h-48 md:h-32 object-cover rounded-lg transition-transform duration-300 group-hover/image:scale-105"
            fallbackClassName="w-full h-48 md:h-32 rounded-lg"
          />

          {/* Discount Badge */}
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
            className={`absolute top-2 right-2 w-8 h-8 rounded-full transition-all duration-300 ${isProductInCompare
                ? "bg-[#8ba63a] text-white hover:bg-red-500"
                : "bg-white dark:bg-gray-700 bg-opacity-90 dark:bg-opacity-90 text-gray-600 dark:text-gray-300 hover:bg-[#8ba63a] hover:text-white"
              }`}
            title={
              isProductInCompare
                ? "Bỏ khỏi danh sách so sánh"
                : "Thêm vào so sánh"
            }
          >
            <Scale className="w-3 h-3" />
          </Button>
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col">
          {/* Product Details */}
          <div className="flex-1">
            {/* Brand */}
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              {product.attributes?.brand || "Brand"}
            </p>

            {/* Product Name */}
            <h3
              className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2 cursor-pointer hover:text-[#8ba63a] dark:hover:text-[#9CCC65] transition-colors"
              onClick={handleProductClick}
            >
              {product.name}
            </h3>

            {/* Rating */}
            <div className="mb-2">
              <StarRating
                rating={product.rating?.average || 0}
                size="sm"
                showValue={true}
                reviewCount={product.rating?.count || 0}
              />
            </div>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
              {product.shortDescription || product.description}
            </p>

            {/* Price */}
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-[#8ba63a] dark:text-[#9CCC65]">
                  {product.salePrice.toLocaleString("vi-VN")}₫
                </span>
                {hasDiscount && (
                  <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                    {product.price.toLocaleString("vi-VN")}₫
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons - Now at bottom */}
          <div className="flex gap-2 mt-auto">
            <Button
              onClick={handleAddToCart}
              className="flex-1 bg-[#8ba63a] hover:bg-[#7a942c] dark:bg-[#9CCC65] dark:hover:bg-[#8ba63a] text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
            >
              <ShoppingCart className="w-3 h-3 mr-1" />
              MUA HÀNG
            </Button>

            <Button
              size="icon"
              variant="outline"
              onClick={handleToggleFavorite}
              className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Heart className="w-4 h-4 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductListItem);
