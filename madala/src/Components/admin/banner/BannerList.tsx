'use client';

import React, { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/Components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import {
    Edit,
    Trash2,
    Plus,
    Eye,
    EyeOff,
    ArrowUp,
    ArrowDown,
    ExternalLink
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { IBanner } from "@/models/Banner";
import { deleteBanner, updateBannerOrder, toggleBannerActive } from "@/lib/actions/banner";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface BannerListProps {
    banners: IBanner[];
}

const BANNER_TYPE_LABELS = {
    sale: 'Sale Banner',
    advertisement: 'Advertisement'
};

const BANNER_TYPE_COLORS = {
    sale: 'bg-red-100 text-red-800',
    advertisement: 'bg-blue-100 text-blue-800'
};

export default function BannerList({ banners }: BannerListProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [bannerToDelete, setBannerToDelete] = useState<IBanner | null>(null);

    const handleDeleteClick = (banner: IBanner) => {
        setBannerToDelete(banner);
        setShowDeleteDialog(true);
    };

    const confirmDelete = async () => {
        if (!bannerToDelete) return;

        const id = String(bannerToDelete._id);
        setDeletingId(id);
        setShowDeleteDialog(false);

        startTransition(async () => {
            try {
                const result = await deleteBanner(id);
                if (result.success) {
                    toast.success(result.message);
                    router.refresh();
                } else {
                    toast.error(result.message);
                }
            } catch (error) {
                console.error('Delete error:', error);
                toast.error('Có lỗi xảy ra khi xóa banner');
            } finally {
                setDeletingId(null);
                setBannerToDelete(null);
            }
        });
    };

    const handleOrderChange = async (bannerId: string, direction: 'up' | 'down') => {
        const currentIndex = banners.findIndex(b => String(b._id) === bannerId);
        if (currentIndex === -1) return;

        const currentBanner = banners[currentIndex];
        let targetIndex: number;

        if (direction === 'up' && currentIndex > 0) {
            targetIndex = currentIndex - 1;
        } else if (direction === 'down' && currentIndex < banners.length - 1) {
            targetIndex = currentIndex + 1;
        } else {
            return; // Can't move
        }

        const targetBanner = banners[targetIndex];

        // Swap display orders
        const updates = [
            { id: String(currentBanner._id), displayOrder: targetBanner.displayOrder },
            { id: String(targetBanner._id), displayOrder: currentBanner.displayOrder }
        ];

        startTransition(async () => {
            try {
                const result = await updateBannerOrder(updates);
                if (result.success) {
                    toast.success('Cập nhật thứ tự thành công');
                    router.refresh();
                } else {
                    toast.error(result.message);
                }
            } catch (error) {
                console.error('Order update error:', error);
                toast.error('Có lỗi xảy ra khi cập nhật thứ tự');
            }
        });
    };

    const handleToggleActive = async (bannerId: string) => {
        startTransition(async () => {
            try {
                const result = await toggleBannerActive(bannerId);
                if (result.success) {
                    toast.success(result.message);
                    router.refresh();
                } else {
                    toast.error(result.message);
                }
            } catch (error) {
                console.error('Toggle active error:', error);
                toast.error('Có lỗi xảy ra khi thay đổi trạng thái banner');
            }
        });
    };

    if (banners.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="text-center space-y-4">
                        <div className="text-gray-500 text-lg">Chưa có banner nào</div>
                        <Link href="/admin/banners/create">
                            <Button className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Tạo Banner Đầu Tiên
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Danh sách Banner ({banners.length})</CardTitle>
                <Link href="/admin/banners/create">
                    <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Tạo Banner
                    </Button>
                </Link>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-20">Ảnh</TableHead>
                                <TableHead>Tiêu đề</TableHead>
                                <TableHead>Loại</TableHead>
                                <TableHead className="w-24">Thứ tự</TableHead>
                                <TableHead className="w-24">Trạng thái</TableHead>
                                <TableHead className="w-32">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {banners.map((banner, index) => (
                                <TableRow key={String(banner._id)}>
                                    <TableCell>
                                        <div className="relative w-16 h-10 rounded overflow-hidden border">
                                            <Image
                                                src={banner.imageUrl}
                                                alt={banner.title}
                                                fill
                                                className="object-cover"
                                                sizes="64px"
                                            />
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="font-medium text-sm line-clamp-2">
                                                {banner.title}
                                            </div>
                                            {banner.description && (
                                                <div className="text-xs text-gray-500 line-clamp-1">
                                                    {banner.description}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <Badge
                                            variant="secondary"
                                            className={BANNER_TYPE_COLORS[banner.type]}
                                        >
                                            {BANNER_TYPE_LABELS[banner.type]}
                                        </Badge>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <span className="text-sm font-medium">
                                                {banner.displayOrder}
                                            </span>
                                            <div className="flex flex-col gap-1 ml-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-4 w-4 p-0"
                                                    disabled={index === 0 || isPending}
                                                    onClick={() => handleOrderChange(String(banner._id), 'up')}
                                                >
                                                    <ArrowUp className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-4 w-4 p-0"
                                                    disabled={index === banners.length - 1 || isPending}
                                                    onClick={() => handleOrderChange(String(banner._id), 'down')}
                                                >
                                                    <ArrowDown className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant={banner.isActive ? "default" : "outline"}
                                                size="sm"
                                                className={`h-6 px-2 text-xs ${banner.isActive
                                                    ? 'bg-green-600 hover:bg-green-700 text-white'
                                                    : 'border-gray-300 hover:bg-gray-50'
                                                    }`}
                                                disabled={isPending}
                                                onClick={() => handleToggleActive(String(banner._id))}
                                            >
                                                {banner.isActive ? (
                                                    <>
                                                        <Eye className="h-3 w-3 mr-1" />
                                                        Hiển thị
                                                    </>
                                                ) : (
                                                    <>
                                                        <EyeOff className="h-3 w-3 mr-1" />
                                                        Ẩn
                                                    </>
                                                )}
                                            </Button>
                                            {(banner.type === 'sale' || banner.type === 'advertisement') && banner.isActive && (
                                                <Badge variant="outline" className="text-xs">
                                                    Duy nhất
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Link href={`/admin/banners/edit/${banner._id}`}>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                                disabled={deletingId === String(banner._id)}
                                                onClick={() => handleDeleteClick(banner)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận xóa banner</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa banner "{bannerToDelete?.title}"?
                            Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteDialog(false)}
                            disabled={isPending}
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={isPending}
                        >
                            {isPending ? 'Đang xóa...' : 'Xóa'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
