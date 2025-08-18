'use client';
import React, { useState, useCallback, memo } from 'react';
import { useCompare } from '@/contexts/CompareContext';
import { ICategory } from '@/models/Category';
import { IProduct } from '@/models/Product';
import CompareModal from '@/app/products/components/CompareModal';
import { FaBalanceScale } from 'react-icons/fa';

interface FloatingCompareButtonProps {
    categories: ICategory[];
    onAddToCart?: (product: IProduct) => void;
}

const FloatingCompareButton = memo(function FloatingCompareButton({ categories, onAddToCart }: FloatingCompareButtonProps) {
    const { compareProducts, compareCount, removeFromCompare } = useCompare();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Memoize modal open handler
    const handleOpenModal = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    // Memoize modal close handler
    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    if (compareCount === 0) return null;

    return (
        <>
            {/* Floating Compare Button */}
            <div className="fixed bottom-4 right-4 z-40">
                <button
                    onClick={handleOpenModal}
                    className="bg-[#8ba63a] hover:bg-[#7a942c] text-white p-3 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                    <FaBalanceScale className="text-lg" />
                    <span className="bg-white text-[#8ba63a] rounded-full px-2 py-1 text-xs font-bold">
                        {compareCount}
                    </span>
                </button>
            </div>

            {/* Compare Modal */}
            <CompareModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                products={compareProducts}
                categories={categories}
                onRemoveProduct={removeFromCompare}
                onAddToCart={onAddToCart}
            />
        </>
    );
});

export default FloatingCompareButton;
