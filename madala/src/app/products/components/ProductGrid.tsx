'use client';
import React from 'react';
import { IProduct } from '@/models/Product';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: IProduct[];
  onAddToCart?: (product: IProduct) => void;
  onToggleFavorite?: (product: IProduct) => void;
}

const ProductGrid = React.memo(function ProductGrid({
  products,
  onAddToCart,
  onToggleFavorite
}: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 auto-rows-fr">
      {products.map((product) => (
        <ProductCard
          key={String(product._id) || product.productId || product.id}
          product={product}
          onAddToCart={onAddToCart}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
});

export default ProductGrid;
