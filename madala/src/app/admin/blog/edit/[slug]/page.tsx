'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { AdminLayout } from "@/Components/admin/AdminLayout";
import { Button } from "@/Components/ui/button";
import { ArrowLeft, Save, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { useBlogForm } from "@/hooks/useBlogForm";
import BlogBasicInfo from "@/Components/admin/blog/BlogBasicInfo";
import BlogContentEditor from "@/Components/admin/blog/BlogContentEditor";
import BlogImageUpload from "@/Components/admin/blog/BlogImageUpload";
import BlogTagsManager from "@/Components/admin/blog/BlogTagsManager";
import BlogSettings from "@/Components/admin/blog/BlogSettings";

export default function EditBlog() {
  const params = useParams();
  const slug = params.slug as string;
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    getValues,
    reset
  } = useBlogForm();

  // Fetch blog post data
  useEffect(() => {
    if (!slug || dataLoaded) return;

    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/blog/${slug}?admin=true`);
        const result = await response.json();

        if (result.success) {
          const post = result.data.post;
          reset({
            title: post.title,
            slug: post.slug,
            content: post.content,
            excerpt: post.excerpt,
            featuredImage: post.featuredImage,
            tags: post.tags || [],
            isPublished: post.isPublished,
            isFeatured: post.isFeatured
          });
          setDataLoaded(true); // ← Đánh dấu đã load xong
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

  const onSubmit = async (data: any, publish?: boolean) => {
    if (!data.featuredImage) {
      toast.error('Vui lòng chọn ảnh đại diện');
      return;
    }
    try {
      setSaving(true);
      const updateData: any = { ...data };
      if (publish !== undefined) {
        updateData.isPublished = publish;
        if (publish) {
          updateData.publishedAt = new Date().toISOString();
        }
      }
      const response = await fetch(`/api/blog/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      const result = await response.json();
      if (result.success) {
        toast.success('Cập nhật bài viết thành công');
        if (result.data.slug !== slug) {
          window.location.href = `/admin/blog/edit/${result.data.slug}`;
        }
      } else {
        toast.error(result.error || 'Lỗi khi cập nhật bài viết');
      }
    } catch (error) {
      console.error('Error updating blog post:', error);
      toast.error('Lỗi khi cập nhật bài viết');
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
          {/* Nút đã chuyển xuống dưới form, tránh lỗi handleSave/formData */}
        </div>

        <form onSubmit={handleSubmit((data) => onSubmit(data))}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <BlogBasicInfo register={register} errors={errors} watch={watch} />
              <BlogContentEditor register={register} errors={errors} />
            </div>
            {/* Sidebar */}
            <div className="space-y-6">
              <BlogImageUpload control={control} />
              <BlogTagsManager control={control} />
              <BlogSettings control={control} showPublishedToggle={true} />
            </div>
          </div>
          <div className="flex space-x-2 mt-6">
            <Button
              variant="outline"
              type="submit"
              disabled={saving}
              onClick={() => handleSubmit((data) => onSubmit(data))()}
            >
              <Save className="h-4 w-4 mr-2" />
              Lưu thay đổi
            </Button>
            {!watch("isPublished") && (
              <Button
                type="button"
                disabled={saving}
                onClick={() => handleSubmit((data) => onSubmit(data, true))()}
              >
                <Eye className="h-4 w-4 mr-2" />
                Xuất bản
              </Button>
            )}
            {watch("isPublished") && (
              <Button
                variant="secondary"
                type="button"
                disabled={saving}
                onClick={() => handleSubmit((data) => onSubmit(data, false))()}
              >
                Hủy xuất bản
              </Button>
            )}
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
