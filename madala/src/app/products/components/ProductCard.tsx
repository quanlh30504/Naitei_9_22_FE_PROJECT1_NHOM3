"use client";
import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { buyNowAndRedirect } from "@/lib/actions/cart";
import toast from "react-hot-toast";
import { Product } from "@/types/product";
import { useFavorite } from "@/hooks/useFavorite";
import { Heart, ShoppingCart, Scale } from "lucide-react";
import { Button } from "@/Components/ui/button";
import SafeImage from "@/Components/SafeImage";
import StarRating from "@/Components/products/StarRating";
import { useCompareStore } from "@/store/useCompareStore";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
}


import { getProductDiscount } from "@/lib/utils";

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleFavorite,
}) => {
  const { favoriteIds, refreshFavorites, setFavoriteIds } = useFavorite();
  const isFavorite = favoriteIds.includes(String(product._id));
  const router = useRouter();
  const { isInCompare, addToCompare, removeFromCompare } = useCompareStore();
  const { hasDiscount, discountPercent } = getProductDiscount(product);
  const isProductInCompare = isInCompare(String(product._id));

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const productId = String(product._id) || product.productId;

    if (isProductInCompare) {
      // Nếu đã có trong danh sách so sánh, loại bỏ
      removeFromCompare(productId);
    } else {
      // Nếu chưa có, thêm vào danh sách so sánh
      addToCompare(product);
    }
  };

  const handleProductClick = () => {
    // Chuyển hướng sang page details
    if (product.slug) {
      router.push(`/products/${product.slug}`);
    }
  };

  const [isPending, startTransition] = useTransition();

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    startTransition(async () => {
      try {
        const result = await buyNowAndRedirect(String(product._id), 1);
        if (result?.error) {
          toast.error(result.error);
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
        } else {
          toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
        }
      }
    });
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.035] hover:border-2 hover:border-green-700 dark:hover:border-green-600 border border-transparent transition-all duration-300 overflow-hidden flex flex-col h-full min-h-[400px] cursor-pointer ${isProductInCompare ? "ring-2 ring-green-600/50" : ""
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
              ? "bg-green-600 text-white hover:bg-red-500"
              : "bg-white dark:bg-gray-700 bg-opacity-90 dark:bg-opacity-90 text-gray-600 dark:text-gray-300 hover:bg-green-600 hover:text-white"
            }`}
          title={
            isProductInCompare
              ? "Bỏ khỏi danh sách so sánh"
              : "Thêm vào so sánh"
          }
        >
          <Scale className="w-4 h-4" />
        </Button>


        {/* Brand */}
        <div className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
          {product.attributes?.brand ? product.attributes.brand : 'BRAND'}
        </div>
        <h3
          className="font-semibold text-gray-800 dark:text-gray-200 mb-2 line-clamp-2 cursor-pointer hover:text-green-600 dark:hover:text-lime-400 transition-colors h-12 overflow-hidden leading-5"
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
            <span className="text-lg font-bold text-green-600 dark:text-lime-400">
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
            variant={isFavorite ? "default" : "outline"}
            onClick={async (e) => {
              e.stopPropagation();
              try {
                const method = isFavorite ? 'DELETE' : 'POST';
                const res = await fetch('/api/users/favorites', {
                  method,
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ productId: String(product._id) })
                });
                const data = await res.json();
                if (res.ok && Array.isArray(data.favorites)) {
                  setFavoriteIds(data.favorites);
                  toast.success(isFavorite ? 'Đã bỏ khỏi yêu thích' : 'Đã thêm vào yêu thích');
                  refreshFavorites();
                } else {
                  toast.error(data.message || 'Có lỗi xảy ra');
                }
              } catch (err) {
                toast.error('Có lỗi xảy ra');
              }
            }}
            className={`border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-9 h-9 flex items-center justify-center ${isFavorite ? 'bg-red-600' : ''}`}
            title={isFavorite ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích'}
          >
            <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'text-white fill-white' : 'text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400'}`} fill={isFavorite ? 'currentColor' : 'none'} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
