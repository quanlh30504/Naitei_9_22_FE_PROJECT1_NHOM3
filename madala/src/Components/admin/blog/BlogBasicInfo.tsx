import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { BlogFormData } from "@/types/blog";

interface BlogBasicInfoProps {
    formData: BlogFormData;
    onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSlugChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onExcerptChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function BlogBasicInfo({
    formData,
    onTitleChange,
    onSlugChange,
    onExcerptChange
}: BlogBasicInfoProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <label className="text-sm font-medium">
                        Tiêu đề <span className="text-red-500">*</span>
                    </label>
                    <Input
                        placeholder="Nhập tiêu đề bài viết..."
                        value={formData.title}
                        onChange={onTitleChange}
                        className="mt-1"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">Slug</label>
                    <Input
                        placeholder="slug-bai-viet"
                        value={formData.slug}
                        onChange={onSlugChange}
                        className="mt-1"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">
                        Mô tả ngắn <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        placeholder="Nhập mô tả ngắn về bài viết..."
                        value={formData.excerpt}
                        onChange={onExcerptChange}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={3}
                        maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        {formData.excerpt.length}/500 ký tự
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
