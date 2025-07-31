'use client';
import React, { useEffect, useState } from 'react';
import ProductGrid from '@/app/products/components/ProductGrid';
import ProductList from '@/app/products/components/ProductList';
import Advertisement from '@/app/products/components/Advertisement';
import CategorySidebar from '@/app/products/components/CategorySidebar';
import CompareBox from '@/app/products/components/CompareBox';
import TagList from '@/app/products/components/TagList';
import SaleBanner from '@/app/products/components/SaleBanner';
import ViewToggle from '@/app/products/components/ViewToggle';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/Components/ui/pagination";
import { IProduct } from '@/models/Product';
import { ICategory } from '@/models/Category';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';

const ProductPage = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    // MAX prod được hiển thị
    const getProductsPerPage = () => {
        return viewMode === 'list' ? 3 : 6; // max 3 prod cho list mode, 6 prod cho grid mode
    };

    // gộp tags từ sản phẩm, loại bỏ trùng hợp và chuyển thành mảng
    const tags = Array.from(new Set(
        Array.isArray(products) ? products.flatMap(p => p.tags || []) : []
    ));

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Sử dụng categoryService
                const categories = await categoryService.getAllCategories();
                setCategories(categories);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Lấy toàn bộ sản phẩm lần đầu load page
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                // Sử dụng productService 
                const products = await productService.getAllProducts();

                setProducts(products);
                setFilteredProducts(products);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error('Error fetching initial products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Khi filter thay đổi 
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                let products: IProduct[];

                // Kiểm tra nếu không có filter nào được chọn
                if (selectedCategory === '' && selectedTags.length === 0) {
                    // Không có filter nào - lấy tất cả sản phẩm
                    products = await productService.getAllProducts();
                } else {
                    // Có filter - sử dụng productService với logic Advanced (match với route API thực tế)
                    if (selectedCategory && selectedTags.length > 0) {
                        // Có cả category và tags - sử dụng logic phức tạp từ route
                        products = await productService.getProductsByCategoryAndTagsAdvanced(selectedCategory, selectedTags);
                    } else if (selectedCategory) {
                        // Chỉ có category - route sẽ tự động handle subcategories nếu level 1
                        products = await productService.getProductsByCategoryAdvanced(selectedCategory);
                    } else if (selectedTags.length > 0) {
                        // Chỉ có tags - sử dụng logic từ route
                        products = await productService.getProductsByTagsAdvanced(selectedTags);
                    } else {
                        // Fallback
                        products = await productService.getAllProducts();
                    }
                }

                setProducts(products);
                setFilteredProducts(products);
                setCurrentPage(1); // reset về page 1 khi filter thay đổi
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error('Error fetching filtered products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCategory, selectedTags]); 


    const handleCategorySelect = (category: string) => {
        setSelectedCategory(category);
        
        // nếu không có tags được lựa chọn sẽ tự lấy tất cả sản phẩm
        if (category === '' && selectedTags.length === 0) {
            const fetchAllProducts = async () => {
                try {
                    setLoading(true);
                    // Sử dụng productService
                    const products = await productService.getAllProducts();
                    
                    setProducts(products);
                    setFilteredProducts(products);
                    setCurrentPage(1);
                } catch (err) {
                    setError(err instanceof Error ? err.message : 'An error occurred');
                } finally {
                    setLoading(false);
                }
            };
            fetchAllProducts();
        }
    };

    const handleTagSelect = (tag: string) => {
        setSelectedTags(prevTags => {
            if (prevTags.includes(tag)) {
                // Nếu tag được chọn sẽ xóa trong array không hiển thị nữa
                return prevTags.filter(t => t !== tag);
            } else {
                // Ngược lại
                return [...prevTags, tag];
            }
        });
    };

    const handleClearAllTags = () => {
        setSelectedTags([]);
    };

    // Chức năng thêm vào giỏ hàng
    const handleAddToCart = () => {
        // TODO: Implement cart functionality
    };

    // Chức năng yêu thích
    const handleToggleFavorite = () => {
        // TODO: Implement favorite functionality
    };

    // Phân trang
    const productsPerPage = getProductsPerPage();
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

    // reset về page 1 khi đổi view mode
    useEffect(() => {
        setCurrentPage(1);
    }, [viewMode]);

    // Render pagination
    const renderPagination = (isCompact = false) => {
        if (totalPages <= 1) return null;

        const getVisiblePages = () => {
            const delta = isCompact ? 1 : 2;
            const range = [];
            const rangeWithDots = [];

            for (
                let i = Math.max(2, currentPage - delta);
                i <= Math.min(totalPages - 1, currentPage + delta);
                i++
            ) {
                range.push(i);
            }

            if (currentPage - delta > 2) {
                rangeWithDots.push(1, '...');
            } else {
                rangeWithDots.push(1);
            }

            rangeWithDots.push(...range);

            if (currentPage + delta < totalPages - 1) {
                rangeWithDots.push('...', totalPages);
            } else if (totalPages > 1) {
                rangeWithDots.push(totalPages);
            }

            return rangeWithDots;
        };

        const handlePageClick = (page: number | string) => {
            if (typeof page === 'number') {
                setCurrentPage(page);
            }
        };

        const handlePrevious = () => {
            if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }
        };

        const handleNext = () => {
            if (currentPage < totalPages) {
                setCurrentPage(currentPage + 1);
            }
        };

        const visiblePages = getVisiblePages();

        return (
            <Pagination className={isCompact ? "mt-4" : "mt-8"}>
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
                        <PaginationItem key={index}>
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
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg">Đang tải sản phẩm...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-red-500">Lỗi: {error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <SaleBanner />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:hidden space-y-6">
                    <CategorySidebar
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onSelectCategory={handleCategorySelect}
                    />
                    <CompareBox categories={categories} />
                    <TagList
                        tags={tags}
                        selectedTags={selectedTags}
                        onSelectTag={handleTagSelect}
                        onClearAllTags={handleClearAllTags}
                    />

                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-4">
                                <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
                                <span className="text-sm text-gray-600">
                                    {filteredProducts.length} sản phẩm
                                </span>
                            </div>
                            
                            <div className="flex items-center">
                                {totalPages > 1 && renderPagination(true)}
                            </div>
                        </div>

                        {viewMode === 'grid' ? (
                            <ProductGrid
                                products={currentProducts}
                                onAddToCart={handleAddToCart}
                                onToggleFavorite={handleToggleFavorite}
                            />
                        ) : (
                            <ProductList
                                products={currentProducts}
                                onAddToCart={handleAddToCart}
                                onToggleFavorite={handleToggleFavorite}
                            />
                        )}

                        {totalPages > 1 && renderPagination(false)}
                    </div>
                </div>

                <div className="hidden lg:grid lg:grid-cols-4 gap-8">
                    <aside className="col-span-1 space-y-6">
                        <CategorySidebar
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onSelectCategory={handleCategorySelect}
                        />
                        <CompareBox categories={categories} />
                        <TagList
                            tags={tags}
                            selectedTags={selectedTags}
                            onSelectTag={handleTagSelect}
                            onClearAllTags={handleClearAllTags}
                        />
                        <Advertisement />
                    </aside>

                    {/* Main Content */}
                    <main className="col-span-3">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-4">
                                <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
                                <span className="text-sm text-gray-600">
                                    {filteredProducts.length} sản phẩm
                                </span>
                            </div>
                            <div className="flex items-center">
                                {totalPages > 1 && renderPagination(true)}
                            </div>
                        </div>

                        {viewMode === 'grid' ? (
                            <ProductGrid
                                products={currentProducts}
                                onAddToCart={handleAddToCart}
                                onToggleFavorite={handleToggleFavorite}
                            />
                        ) : (
                            <ProductList
                                products={currentProducts}
                                onAddToCart={handleAddToCart}
                                onToggleFavorite={handleToggleFavorite}
                            />
                        )}
                        {totalPages > 1 && renderPagination(false)}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;