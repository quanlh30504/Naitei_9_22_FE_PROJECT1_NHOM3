'use client';

import { useState } from "react";
import { AdminLayout } from "@/Components/admin/AdminLayout";
import { Button } from "@/Components/ui/button";
import BlogFormHeader from "@/Components/admin/blog/BlogFormHeader";
import toast from "react-hot-toast";
import { useBlogForm } from "@/hooks/useBlogForm";
import BlogBasicInfo from "@/Components/admin/blog/BlogBasicInfo";
import BlogContentEditor from "@/Components/admin/blog/BlogContentEditor";
import BlogImageUpload from "@/Components/admin/blog/BlogImageUpload";
import BlogTagsManager from "@/Components/admin/blog/BlogTagsManager";
import BlogSettings from "@/Components/admin/blog/BlogSettings";

export default function CreateBlog() {
  const [saving, setSaving] = useState(false);
  const {
    formData,
    handleTitleChange,
    handleSlugChange,
    handleExcerptChange,
    handleContentChange,
    handleImageChange,
    handleTagsChange,
    handleFeaturedChange
  } = useBlogForm();

  const handleSave = async (publish = false) => {
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
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          isPublished: publish,
          publishedAt: publish ? new Date().toISOString() : undefined
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`${publish ? 'Xuất bản' : 'Lưu'} bài viết thành công`);
        window.location.href = '/admin/blog';
      } else {
        toast.error(result.error || 'Lỗi khi lưu bài viết');
      }
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast.error('Lỗi khi lưu bài viết');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <BlogFormHeader
          title="Tạo bài viết mới"
          subtitle="Viết và xuất bản bài viết mới"
          saving={saving}
        >
          <Button
            variant="secondary"
            className="text-gray-700 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => handleSave(false)}
            disabled={saving}
          >
            Lưu nháp
          </Button>
          <Button
            onClick={() => handleSave(true)}
            disabled={saving}
          >
            Xuất bản
          </Button>
        </BlogFormHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <BlogBasicInfo
              formData={formData}
              onTitleChange={handleTitleChange}
              onSlugChange={handleSlugChange}
              onExcerptChange={handleExcerptChange}
            />

            <BlogContentEditor
              content={formData.content}
              onChange={handleContentChange}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <BlogImageUpload
              featuredImage={formData.featuredImage}
              onImageChange={handleImageChange}
            />

            <BlogTagsManager
              tags={formData.tags}
              onTagsChange={handleTagsChange}
            />

            <BlogSettings
              isFeatured={formData.isFeatured}
              onFeaturedChange={handleFeaturedChange}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
