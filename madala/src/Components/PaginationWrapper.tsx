'use client';
import React, { useMemo, useCallback, memo } from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/Components/ui/pagination";

interface PaginationWrapperProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    isCompact?: boolean;
    className?: string;
}

const PaginationWrapper = memo(function PaginationWrapper({
    currentPage,
    totalPages,
    onPageChange,
    isCompact = false,
    className = ""
}: PaginationWrapperProps) {
    // Memoize the visible pages calculation
    const visiblePages = useMemo(() => {
        if (totalPages <= 1) return [];

        /**
         * CẢI TIẾN: Logic được viết lại để dễ hiểu và đáng tin cậy hơn.
         * 1. Xác định các trang cần hiển thị (trang đầu, cuối, và các trang lân cận trang hiện tại).
         * 2. Thêm dấu "..." vào giữa các khoảng trống.
         */
        const delta = isCompact ? 1 : 2;
        const range = [];
        for (
            let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++
        ) {
            range.push(i);
        }

        const pages: (number | string)[] = [];

        // Luôn thêm trang 1
        pages.push(1);

        // Thêm dấu "..." bên trái nếu cần
        if (currentPage - delta > 2) {
            pages.push('...');
        }

        // Thêm các trang ở giữa
        pages.push(...range);

        // Thêm dấu "..." bên phải nếu cần
        if (currentPage + delta < totalPages - 1) {
            pages.push('...');
        }

        // Luôn thêm trang cuối (nếu nó chưa có)
        if (!pages.includes(totalPages)) {
            pages.push(totalPages);
        }

        return pages;
    }, [currentPage, totalPages, isCompact]);

    // Memoize handlers
    const handlePageClick = useCallback((page: number | string) => {
        if (typeof page === 'number') {
            onPageChange(page);
        }
    }, [onPageChange]);

    const handlePrevious = useCallback(() => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    }, [currentPage, onPageChange]);

    const handleNext = useCallback(() => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    }, [currentPage, totalPages, onPageChange]);

    if (totalPages <= 1) return null;

    return (
        // SỬA LỖI: Sửa lại cú pháp className
        <Pagination className={`${isCompact ? "mt-4" : "mt-8"} ${className}`.trim()}>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e: React.MouseEvent) => {
                            e.preventDefault();
                            handlePrevious();
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                </PaginationItem>

                {visiblePages.map((page, index) => (
                    <PaginationItem key={`${page}-${index}`}>
                        {page === '...' ? (
                            <PaginationEllipsis />
                        ) : (
                            <PaginationLink
                                href="#"
                                onClick={(e: React.MouseEvent) => {
                                    e.preventDefault();
                                    handlePageClick(page);
                                }}
                                isActive={currentPage === page}
                                className="cursor-pointer"
                            >
                                {page}
                            </PaginationLink>
                        )}
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e: React.MouseEvent) => {
                            e.preventDefault();
                            handleNext();
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
});

export { PaginationWrapper };
