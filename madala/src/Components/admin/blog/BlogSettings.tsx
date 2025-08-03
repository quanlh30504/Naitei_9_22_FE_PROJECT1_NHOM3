import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";

interface BlogSettingsProps {
    isFeatured: boolean;
    isPublished?: boolean;
    onFeaturedChange: (featured: boolean) => void;
    onPublishedChange?: (published: boolean) => void;
    showPublishedToggle?: boolean;
}

export default function BlogSettings({
    isFeatured,
    isPublished,
    onFeaturedChange,
    onPublishedChange,
    showPublishedToggle = false
}: BlogSettingsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Cài đặt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="isFeatured"
                        checked={isFeatured}
                        onChange={(e) => onFeaturedChange(e.target.checked)}
                        className="rounded border-gray-300"
                    />
                    <label htmlFor="isFeatured" className="text-sm font-medium">
                        Bài viết nổi bật
                    </label>
                </div>

                {showPublishedToggle && onPublishedChange && (
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="isPublished"
                            checked={isPublished}
                            onChange={(e) => onPublishedChange(e.target.checked)}
                            className="rounded border-gray-300"
                        />
                        <label htmlFor="isPublished" className="text-sm font-medium">
                            Đã xuất bản
                        </label>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}