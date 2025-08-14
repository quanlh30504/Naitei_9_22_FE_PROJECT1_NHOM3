'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import BannerList from './BannerList';
import { IBanner } from '@/models/Banner';
import { getBanners } from '@/lib/actions/banner';
import toast from 'react-hot-toast';
import { Plus, RefreshCw } from 'lucide-react';
import Link from 'next/link';

const BANNER_TYPES = [
    { value: 'all', label: 'Tất cả', count: 0 },
    { value: 'sale', label: 'Sale Banner', count: 0 },
    { value: 'advertisement', label: 'Advertisement', count: 0 }
];

export default function BannerManager() {
    const [banners, setBanners] = useState<IBanner[]>([]);
    const [filteredBanners, setFilteredBanners] = useState<IBanner[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    const [bannerTypes, setBannerTypes] = useState(BANNER_TYPES);

    const fetchBanners = async () => {
        setLoading(true);
        try {
            const result = await getBanners();
            if (result.success && result.data) {
                setBanners(result.data);
                updateBannerCounts(result.data);
                filterBanners(result.data, activeFilter);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error fetching banners:', error);
            toast.error('Lỗi khi tải danh sách banner');
        } finally {
            setLoading(false);
        }
    };

    const updateBannerCounts = (bannerData: IBanner[]) => {
        const counts = {
            all: bannerData.length,
            sale: bannerData.filter(b => b.type === 'sale').length,
            advertisement: bannerData.filter(b => b.type === 'advertisement').length,
        };

        setBannerTypes(BANNER_TYPES.map(type => ({
            ...type,
            count: counts[type.value as keyof typeof counts] || 0
        })));
    };

    // Thống kê banner active
    const getActiveStats = () => {
        const saleBanners = banners.filter(b => b.type === 'sale');
        const advertisementBanners = banners.filter(b => b.type === 'advertisement');

        return {
            activeSale: saleBanners.filter(b => b.isActive).length,
            totalSale: saleBanners.length,
            activeAdvertisement: advertisementBanners.filter(b => b.isActive).length,
            totalAdvertisement: advertisementBanners.length,
            totalActive: banners.filter(b => b.isActive).length,
            totalBanners: banners.length
        };
    };

    const filterBanners = (bannerData: IBanner[], type: string) => {
        if (type === 'all') {
            setFilteredBanners(bannerData);
        } else {
            setFilteredBanners(bannerData.filter(banner => banner.type === type));
        }
    };

    const handleFilterChange = (value: string) => {
        setActiveFilter(value);
        filterBanners(banners, value);
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="space-y-2">
                        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded w-64 animate-pulse" />
                    </div>
                    <div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
                </div>
                <div className="h-64 bg-gray-200 rounded animate-pulse" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Quản lý Banner</h1>
                    <p className="text-gray-600 mt-1">
                        Quản lý các banner hiển thị trên website
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={fetchBanners}
                        className="flex items-center gap-2"
                        disabled={loading}
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        Làm mới
                    </Button>
                    <Link href="/admin/banners/create">
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Tạo Banner
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {bannerTypes.map((type) => (
                    <Card key={type.value} className="text-center">
                        <CardContent className="pt-4">
                            <div className="text-2xl font-bold text-gray-900">
                                {type.count}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                                {type.label}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Active Banner Status */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <span>Trạng thái Banner Active</span>
                        <span className="text-sm font-normal text-gray-500">
                            (Chỉ 1 banner active cho Sale & Advertisement)
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="text-sm text-blue-600 font-medium">Sale Banner</div>
                            <div className="text-2xl font-bold text-blue-900 mt-1">
                                {getActiveStats().activeSale}/{getActiveStats().totalSale}
                            </div>
                            <div className="text-xs text-blue-600 mt-1">Active/Tổng số</div>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="text-sm text-green-600 font-medium">Advertisement</div>
                            <div className="text-2xl font-bold text-green-900 mt-1">
                                {getActiveStats().activeAdvertisement}/{getActiveStats().totalAdvertisement}
                            </div>
                            <div className="text-xs text-green-600 mt-1">Active/Tổng số</div>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <div className="text-sm text-gray-600 font-medium">Tổng Active</div>
                            <div className="text-2xl font-bold text-gray-900 mt-1">
                                {getActiveStats().totalActive}/{getActiveStats().totalBanners}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">Tất cả loại</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Filter Buttons */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Lọc theo loại Banner</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {bannerTypes.map((type) => (
                            <Button
                                key={type.value}
                                variant={activeFilter === type.value ? "default" : "outline"}
                                onClick={() => handleFilterChange(type.value)}
                                className="flex items-center gap-2"
                            >
                                {type.label}
                                <span className={`px-1.5 py-0.5 rounded-full text-xs ${activeFilter === type.value
                                    ? 'bg-white text-gray-800'
                                    : 'bg-gray-200 text-gray-700'
                                    }`}>
                                    {type.count}
                                </span>
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Banner List */}
            <BannerList banners={filteredBanners} />
        </div>
    );
}
