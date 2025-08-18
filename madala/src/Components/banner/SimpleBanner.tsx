'use client';

import React, { useEffect, useState, useCallback, memo, useMemo } from 'react';
import Image from 'next/image';
import { getActiveBannerByType } from '@/lib/actions/banner';
import { IBanner } from '@/models/Banner';

interface SimpleBannerProps {
    type: 'sale' | 'advertisement';
    className?: string;
    showBadge?: boolean;
}

function SimpleBanner({ type, className = '', showBadge = false }: SimpleBannerProps) {
    const [banner, setBanner] = useState<IBanner | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Memoize fetch banner function
    const fetchBanner = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await getActiveBannerByType(type);
            if (response.success && response.data) {
                setBanner(response.data);
            } else {
                console.log(`No active ${type} banner found:`, response.message);
                setBanner(null);
            }
        } catch (error) {
            console.error('Error fetching banner:', error);
            setError('Lỗi khi tải banner');
        } finally {
            setLoading(false);
        }
    }, [type]);

    useEffect(() => {
        fetchBanner();
    }, [fetchBanner]);

    // Memoize banner type display text
    const bannerTypeText = useMemo(() => {
        return type === 'sale' ? 'Sale' : 'Advertisement';
    }, [type]);

    // Memoize badge configuration
    const badgeConfig = useMemo(() => ({
        className: banner?.type === 'sale' ? 'bg-red-500' : 'bg-blue-500',
        text: banner?.type === 'sale' ? 'SALE' : 'AD'
    }), [banner?.type]);

    // Memoize BannerContent component
    const BannerContent = useMemo(() => {
        if (!banner) return null;

        return (
            <div className={`relative overflow-hidden rounded-lg shadow-lg group ${className}`}>
                <div className="relative h-48 md:h-64 lg:h-80">
                    {/* Chỉ hiển thị ảnh banner */}
                    <Image
                        src={banner.imageUrl}
                        alt={banner.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Badge tùy chọn */}
                    {showBadge && (
                        <div className="absolute top-4 right-4 z-10">
                            <span className={`px-3 py-1 text-xs font-bold rounded-full text-white ${badgeConfig.className}`}>
                                {badgeConfig.text}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    }, [banner, className, showBadge, badgeConfig]);

    if (loading) {
        return (
            <div className={`bg-gray-200 h-48 md:h-64 rounded-lg flex items-center justify-center animate-pulse ${className}`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto mb-2"></div>
                    <p className="text-gray-500">Đang tải banner...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`bg-red-50 border border-red-200 h-48 md:h-64 rounded-lg flex items-center justify-center ${className}`}>
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (!banner) {
        return (
            <div className={`bg-gray-100 h-48 md:h-64 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 ${className}`}>
                <div className="text-center space-y-2">
                    <p className="text-gray-500">Không có banner {bannerTypeText} active</p>
                    <p className="text-xs text-gray-400">Vui lòng kích hoạt banner trong trang quản trị</p>
                </div>
            </div>
        );
    }

    return BannerContent;
}

export default memo(SimpleBanner);
