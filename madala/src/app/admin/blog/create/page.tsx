"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { useBlogForm } from "@/hooks/useBlogForm";
import BlogBasicInfo from "@/components/admin/blog/BlogBasicInfo";
import BlogContentEditor from "@/components/admin/blog/BlogContentEditor";
import BlogImageUpload from "@/components/admin/blog/BlogImageUpload";
import BlogTagsManager from "@/components/admin/blog/BlogTagsManager";
import BlogSettings from "@/components/admin/blog/BlogSettings";

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
    handleFeaturedChange,
  } = useBlogForm();

  const handleSave = async (publish = false) => {
    if (
      !formData.title.trim() ||
      !formData.content.trim() ||
      !formData.excerpt.trim()
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    if (!formData.featuredImage) {
      toast.error("Vui lòng chọn ảnh đại diện");
      return;
    }

    try {
      setSaving(true);
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          isPublished: publish,
          publishedAt: publish ? new Date().toISOString() : undefined,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`${publish ? "Xuất bản" : "Lưu"} bài viết thành công`);
        window.location.href = "/admin/blog";
      } else {
        toast.error(result.error || "Lỗi khi lưu bài viết");
      }
    } catch (error) {
      console.error("Error saving blog post:", error);
      toast.error("Lỗi khi lưu bài viết");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Tạo bài viết mới</h1>
              <p className="text-muted-foreground">
                Viết và xuất bản bài viết mới
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => handleSave(false)}
              disabled={saving}
            >
              <Save className="h-4 w-4 mr-2" />
              Lưu nháp
            </Button>
            <Button onClick={() => handleSave(true)} disabled={saving}>
              <Eye className="h-4 w-4 mr-2" />
              Xuất bản
            </Button>
          </div>
        </div>

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
