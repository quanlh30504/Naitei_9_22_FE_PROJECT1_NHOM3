import { Button } from "@/Components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { BlogPost } from "@/types/blog";
import { useCallback, memo } from "react";

interface BlogActionButtonsProps {
    post: BlogPost;
    deleting: string | null;
    onDelete: (slug: string, title: string) => void;
    onTogglePublish: (slug: string, isPublished: boolean) => void;
}

const BlogActionButtons = memo(function BlogActionButtons({
    post,
    deleting,
    onDelete,
    onTogglePublish
}: BlogActionButtonsProps) {
    // Memoize view handler
    const handleView = useCallback(() => {
        window.open(`/news/${post.slug}`, '_blank');
    }, [post.slug]);

    // Memoize edit handler
    const handleEdit = useCallback(() => {
        window.location.href = `/admin/blog/edit/${post.slug}`;
    }, [post.slug]);

    // Memoize toggle publish handler
    const handleTogglePublish = useCallback(() => {
        onTogglePublish(post.slug, post.isPublished);
    }, [onTogglePublish, post.slug, post.isPublished]);

    // Memoize delete handler
    const handleDelete = useCallback(() => {
        onDelete(post.slug, post.title);
    }, [onDelete, post.slug, post.title]);
    return (
        <div className="flex items-center space-x-2">
            <Button
                variant="ghost"
                size="sm"
                onClick={handleView}
                title="Xem bài viết"
            >
                <Eye className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                title="Chỉnh sửa"
            >
                <Edit className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={handleTogglePublish}
                className={post.isPublished ? "text-yellow-600" : "text-green-600"}
                title={post.isPublished ? "Hủy xuất bản" : "Xuất bản"}
            >
                {post.isPublished ? "Hủy xuất bản" : "Xuất bản"}
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={deleting === post.slug}
                className="text-red-600 hover:text-red-700"
                title="Xóa bài viết"
            >
                {deleting === post.slug ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                ) : (
                    <Trash2 className="h-4 w-4" />
                )}
            </Button>
        </div>
    );
});

export default BlogActionButtons;
