import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Upload } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

interface BlogImageUploadProps {
    featuredImage: string;
    onImageChange: (url: string) => void;
    showChangeButton?: boolean;
}

export default function BlogImageUpload({
    featuredImage,
    onImageChange,
    showChangeButton = false
}: BlogImageUploadProps) {
    const [imageUploading, setImageUploading] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formDataImg = new FormData();
        formDataImg.append('image', file);

        try {
            setImageUploading(true);
            const response = await fetch('/api/blog/upload-image', {
                method: 'POST',
                body: formDataImg,
            });

            const result = await response.json();

            if (result.success) {
                onImageChange(result.data.url);
                toast.success('Tải ảnh lên thành công');
            } else {
                toast.error(result.error || 'Lỗi khi tải ảnh lên');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Lỗi khi tải ảnh lên');
        } finally {
            setImageUploading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Ảnh đại diện</CardTitle>
            </CardHeader>
            <CardContent>
                {featuredImage ? (
                    <div className="space-y-4">
                        <div className="relative aspect-video rounded-lg overflow-hidden">
                            <Image
                                src={featuredImage}
                                alt="Featured image"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex space-x-2">
                            {showChangeButton && (
                                <>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        id="featured-image-change"
                                        disabled={imageUploading}
                                    />
                                    <label htmlFor="featured-image-change" className="flex-1">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full"
                                            disabled={imageUploading}
                                            asChild
                                        >
                                            <span>
                                                {imageUploading ? 'Đang tải...' : 'Thay đổi ảnh'}
                                            </span>
                                        </Button>
                                    </label>
                                </>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onImageChange('')}
                            >
                                Xóa ảnh
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="featured-image"
                            disabled={imageUploading}
                        />
                        <label
                            htmlFor="featured-image"
                            className="cursor-pointer flex flex-col items-center space-y-2"
                        >
                            <Upload className="h-8 w-8 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                                {imageUploading ? 'Đang tải lên...' : 'Chọn ảnh đại diện'}
                            </p>
                        </label>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
