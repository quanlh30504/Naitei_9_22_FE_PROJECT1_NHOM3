'use client';

import React, { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Switch } from "@/Components/ui/switch";
import ImageUploader from "@/Components/admin/ImageUploader";
import { createBanner, updateBanner } from "@/lib/actions/banner";
import { IBanner } from "@/models/Banner";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface BannerFormProps {
    banner?: IBanner | null;
    mode: 'create' | 'edit';
}

const BANNER_TYPES = [
    { value: 'sale', label: 'Sale Banner' },
    { value: 'advertisement', label: 'Advertisement' }
];

export default function BannerForm({ banner, mode }: BannerFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // Form state
    const [formData, setFormData] = useState({
        title: banner?.title || '',
        description: banner?.description || '',
        type: banner?.type || 'sale',
        isActive: banner?.isActive ?? true,
        displayOrder: banner?.displayOrder?.toString() || '0'
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleImageChange = (file: File | null, preview: string | null) => {
        setSelectedFile(file);
        setPreviewUrl(preview);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.title.trim()) {
            toast.error('Vui lòng nhập tiêu đề banner');
            return;
        }

        if (!formData.type) {
            toast.error('Vui lòng chọn loại banner');
            return;
        }

        if (mode === 'create' && !selectedFile) {
            toast.error('Vui lòng chọn ảnh banner');
            return;
        }

        const submitFormData = new FormData();
        submitFormData.append('title', formData.title.trim());
        submitFormData.append('description', formData.description.trim());
        submitFormData.append('type', formData.type);
        submitFormData.append('isActive', formData.isActive.toString());
        submitFormData.append('displayOrder', formData.displayOrder);

        if (selectedFile) {
            submitFormData.append('image', selectedFile);
        }

        startTransition(async () => {
            try {
                let result;
                if (mode === 'create') {
                    result = await createBanner(submitFormData);
                } else if (banner) {
                    result = await updateBanner(String(banner._id), submitFormData);
                } else {
                    toast.error('Banner không tồn tại');
                    return;
                }

                if (result.success) {
                    toast.success(result.message);
                    router.push('/admin/banners');
                    router.refresh();
                } else {
                    toast.error(result.message);
                }
            } catch (error) {
                console.error('Form submission error:', error);
                toast.error('Có lỗi xảy ra khi xử lý form');
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Form Fields */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin Banner</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Title */}
                            <div className="space-y-2">
                                <Label htmlFor="title">Tiêu đề *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    placeholder="Nhập tiêu đề banner"
                                    maxLength={200}
                                    required
                                />
                                <p className="text-xs text-gray-500">
                                    {formData.title.length}/200 ký tự
                                </p>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Mô tả</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    placeholder="Nhập mô tả banner (tùy chọn)"
                                    maxLength={500}
                                    rows={3}
                                />
                                <p className="text-xs text-gray-500">
                                    {formData.description.length}/500 ký tự
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Cài đặt</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Type */}
                            <div className="space-y-2">
                                <Label htmlFor="type">Loại Banner *</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value) => handleInputChange('type', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn loại banner" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {BANNER_TYPES.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Display Order */}
                            <div className="space-y-2">
                                <Label htmlFor="displayOrder">Thứ tự hiển thị *</Label>
                                <Input
                                    id="displayOrder"
                                    type="number"
                                    min="0"
                                    value={formData.displayOrder}
                                    onChange={(e) => handleInputChange('displayOrder', e.target.value)}
                                    placeholder="0"
                                    required
                                />
                                <p className="text-xs text-gray-500">
                                    Số nhỏ sẽ hiển thị trước (phải duy nhất cho mỗi loại banner)
                                </p>
                            </div>

                            {/* Active Status */}
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="isActive"
                                        checked={formData.isActive}
                                        onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                                    />
                                    <Label htmlFor="isActive">Kích hoạt banner</Label>
                                </div>

                                {formData.isActive && (formData.type === 'sale' || formData.type === 'advertisement') && (
                                    <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-amber-800">
                                                    Lưu ý quan trọng
                                                </h3>
                                                <div className="mt-2 text-sm text-amber-700">
                                                    <p>
                                                        Chỉ có thể có <strong>1 banner {formData.type === 'sale' ? 'Sale' : 'Advertisement'} active</strong> tại một thời điểm.
                                                        Khi kích hoạt banner này, tất cả banner {formData.type === 'sale' ? 'Sale' : 'Advertisement'} khác sẽ tự động bị tắt.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Image Upload */}
                <div>
                    <ImageUploader
                        title="Ảnh Banner"
                        currentImageUrl={banner?.imageUrl}
                        onImageChange={handleImageChange}
                        maxSizeInMB={5}
                        acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
                        aspectRatio="16/9"
                        showPreview={true}
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
                <Button
                    type="submit"
                    disabled={isPending}
                    className="min-w-[120px]"
                >
                    {isPending ? 'Đang xử lý...' : (mode === 'create' ? 'Tạo Banner' : 'Cập nhật')}
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isPending}
                >
                    Hủy
                </Button>
            </div>
        </form>
    );
}
