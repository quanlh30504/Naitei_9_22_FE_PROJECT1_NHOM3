'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Upload, X, Eye } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

interface ImageUploaderProps {
    title?: string;
    currentImageUrl?: string;
    onImageChange: (file: File | null, previewUrl: string | null) => void;
    maxSizeInMB?: number;
    acceptedTypes?: string[];
    aspectRatio?: string;
    showPreview?: boolean;
}

export default function ImageUploader({
    title = "Upload Image",
    currentImageUrl,
    onImageChange,
    maxSizeInMB = 5,
    acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    aspectRatio = "16/9",
    showPreview = true
}: ImageUploaderProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
    const [isDragging, setIsDragging] = useState(false);

    const validateFile = useCallback((file: File): boolean => {
        if (!acceptedTypes.includes(file.type)) {
            toast.error(`File phải có định dạng: ${acceptedTypes.join(', ')}`);
            return false;
        }

        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
        if (file.size > maxSizeInBytes) {
            toast.error(`Kích thước file không được vượt quá ${maxSizeInMB}MB`);
            return false;
        }

        return true;
    }, [acceptedTypes, maxSizeInMB]);

    const handleFileChange = useCallback((file: File | null) => {
        if (!file) {
            setPreviewUrl(currentImageUrl || null);
            onImageChange(null, null);
            return;
        }

        if (!validateFile(file)) {
            return;
        }

        const preview = URL.createObjectURL(file);
        setPreviewUrl(preview);
        onImageChange(file, preview);
    }, [currentImageUrl, onImageChange, validateFile]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        handleFileChange(file);
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileChange(files[0]);
        }
    }, [handleFileChange]);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const clearImage = () => {
        if (previewUrl && previewUrl !== currentImageUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(currentImageUrl || null);
        onImageChange(null, null);
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Upload Area */}
                <div
                    className={`
            relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
            ${isDragging
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }
          `}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                    <input
                        type="file"
                        accept={acceptedTypes.join(',')}
                        onChange={handleInputChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="image-upload"
                    />

                    <div className="space-y-3">
                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                        <div>
                            <p className="text-sm font-medium text-gray-900">
                                Kéo thả ảnh vào đây hoặc click để chọn
                            </p>
                            <p className="text-xs text-gray-500">
                                Định dạng: {acceptedTypes.join(', ')} (tối đa {maxSizeInMB}MB)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Preview */}
                {showPreview && previewUrl && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900">Xem trước</h4>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(previewUrl, '_blank')}
                                    className="flex items-center gap-1"
                                >
                                    <Eye className="h-3 w-3" />
                                    Xem
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={clearImage}
                                    className="flex items-center gap-1 text-red-600 hover:text-red-700"
                                >
                                    <X className="h-3 w-3" />
                                    Xóa
                                </Button>
                            </div>
                        </div>

                        <div
                            className="relative w-full overflow-hidden rounded-lg border"
                            style={{ aspectRatio }}
                        >
                            <Image
                                src={previewUrl}
                                alt="Preview"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
