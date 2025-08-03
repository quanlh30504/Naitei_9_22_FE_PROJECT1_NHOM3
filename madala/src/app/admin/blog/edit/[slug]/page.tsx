'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { AdminLayout } from "@/Components/admin/AdminLayout";
import { Button } from "@/Components/ui/button";
import { ArrowLeft, Save, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { BlogService } from "@/services/blogService";
import { useBlogForm } from "@/hooks/useBlogForm";
import BlogMainContent from "@/Components/admin/blog/BlogMainContent";
import BlogSidebar from "@/Components/admin/blog/BlogSidebar";

export default function EditBlog() {
  const params = useParams();
  const slug = params.slug as string;
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  const {
    formData,
    handleTitleChange,
    handleSlugChange,
    handleExcerptChange,
    handleContentChange,
    handleImageChange,
    handleTagsChange,
    handleFeaturedChange,
    handlePublishedChange,
    updateFormData
  } = useBlogForm();

  // Fetch blog post data
  useEffect(() => {
    if (!slug || dataLoaded) return;

    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        const result = await BlogService.getBlogPost(slug + '?admin=true');
        if (result.success) {
          const post = result.data.post;
          updateFormData({
            title: post.title,
            slug: post.slug,
            content: post.content,
            excerpt: post.excerpt,
            featuredImage: post.featuredImage,
            tags: post.tags || [],
            isPublished: post.isPublished,
            isFeatured: post.isFeatured
          });
          setDataLoaded(true);
        } else {
          toast.error('Không tìm thấy bài viết');
          window.location.href = '/admin/blog';
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
        toast.error('Lỗi khi tải bài viết');
        window.location.href = '/admin/blog';
      } finally {
        setLoading(false);
      }
    };
    fetchBlogPost();
  }, [slug]); // ← Chỉ dependency slug

  const handleSave = async (publish?: boolean) => {
    if (!formData.title.trim() || !formData.content.trim() || !formData.excerpt.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (!formData.featuredImage) {
      toast.error('Vui lòng chọn ảnh đại diện');
      return;
    }

    try {
      setSaving(true);
      const updateData: any = { ...formData };
      if (publish !== undefined) {
        updateData.isPublished = publish;
        if (publish) {
          updateData.publishedAt = new Date().toISOString();
        }
      }
      const result = await BlogService.updateBlogPost(slug, updateData);
      if (result.success) {
        toast.success('Cập nhật bài viết thành công');
        if (result.data.slug !== slug) {
          window.location.href = `/admin/blog/edit/${result.data.slug}`;
        }
      } else {
        toast.error(result.error || 'Lỗi khi cập nhật bài viết');
      }
    } catch (error: any) {
      console.error('Error updating blog post:', error);
      toast.error(error.message || 'Lỗi khi cập nhật bài viết');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => window.location.href = '/admin/blog'}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Chỉnh sửa bài viết</h1>
              <p className="text-muted-foreground">Cập nhật nội dung bài viết</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => handleSave()}
              disabled={saving}
            >
              <Save className="h-4 w-4 mr-2" />
              Lưu thay đổi
            </Button>
            {!formData.isPublished && (
              <Button
                onClick={() => handleSave(true)}
                disabled={saving}
              >
                <Eye className="h-4 w-4 mr-2" />
                Xuất bản
              </Button>
            )}
            {formData.isPublished && (
              <Button
                variant="secondary"
                onClick={() => handleSave(false)}
                disabled={saving}
              >
                Hủy xuất bản
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <BlogMainContent
            formData={formData}
            handleTitleChange={handleTitleChange}
            handleSlugChange={handleSlugChange}
            handleExcerptChange={handleExcerptChange}
            handleContentChange={handleContentChange}
          />

          {/* Sidebar */}
          <BlogSidebar
            formData={formData}
            handleImageChange={handleImageChange}
            handleTagsChange={handleTagsChange}
            handleFeaturedChange={handleFeaturedChange}
            handlePublishedChange={handlePublishedChange}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
