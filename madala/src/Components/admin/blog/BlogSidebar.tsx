import BlogImageUpload from "@/Components/admin/blog/BlogImageUpload";
import BlogTagsManager from "@/Components/admin/blog/BlogTagsManager";
import BlogSettings from "@/Components/admin/blog/BlogSettings";

interface BlogSidebarProps {
    formData: any;
    handleImageChange: (url: string) => void;
    handleTagsChange: (tags: string[]) => void;
    handleFeaturedChange: (checked: boolean) => void;
    handlePublishedChange: (checked: boolean) => void;
}

export default function BlogSidebar({
    formData,
    handleImageChange,
    handleTagsChange,
    handleFeaturedChange,
    handlePublishedChange,
}: BlogSidebarProps) {
    return (
        <div className="space-y-6">
            <BlogImageUpload
                featuredImage={formData.featuredImage}
                onImageChange={handleImageChange}
                showChangeButton={true}
            />

            <BlogTagsManager
                tags={formData.tags}
                onTagsChange={handleTagsChange}
            />

            <BlogSettings
                isFeatured={formData.isFeatured}
                isPublished={formData.isPublished}
                onFeaturedChange={handleFeaturedChange}
                onPublishedChange={handlePublishedChange}
                showPublishedToggle={true}
            />
        </div>
    );
}
