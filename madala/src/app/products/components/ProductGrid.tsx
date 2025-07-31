'use client';
import React from 'react';
import { IProduct } from '@/models/Product';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: IProduct[];
  onAddToCart?: (product: IProduct) => void;
  onToggleFavorite?: (product: IProduct) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  onAddToCart, 
  onToggleFavorite
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {products.map((product) => (
        <div key={String(product._id) || product.productId || product.id} className="h-full">
          <ProductCard
            product={product}
            onAddToCart={onAddToCart}
            onToggleFavorite={onToggleFavorite}
          />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
