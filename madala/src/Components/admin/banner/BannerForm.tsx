'use client';

import React, { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import BannerTitleInput from "@/Components/admin/BannerTitleInput";
import BannerDescriptionInput from "@/Components/admin/BannerDescriptionInput";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
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
                            <BannerTitleInput
                                value={formData.title}
                                onChange={value => handleInputChange('title', value)}
                            />

                            {/* Description */}
                            <BannerDescriptionInput
                                value={formData.description}
                                onChange={value => handleInputChange('description', value)}
                            />
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
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('displayOrder', e.target.value)}
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
