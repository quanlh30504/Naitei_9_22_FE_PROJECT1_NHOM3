"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Badge } from "@/Components/ui/badge";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { CommentForm } from '@/Components/news/CommentForm'; 

import {
  BlogService,
  BlogPost,
  formatDate,
  getImageUrl,
} from "@/services/blogService";
import toast from "react-hot-toast";
import { Breadcrumbs } from "@/Components/Breadcrumbs";

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [navigation, setNavigation] = useState<{
    previous: BlogPost | null;
    next: BlogPost | null;
  }>({ previous: null, next: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [commentForm, setCommentForm] = useState({
    name: "",
    email: "",
    comment: "",
  });

  useEffect(() => {
    if (slug) {
      fetchBlogPost(slug);
    }
  }, [slug]);

  const fetchBlogPost = async (postSlug: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await BlogService.getBlogPost(postSlug);
      setBlogPost(response.data.post);
      setNavigation(response.data.navigation);
    } catch (err) {
      setError("Không thể tải bài viết");
      console.error("Error fetching blog post:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Hiển thị toast thành công
    toast.success("Gửi ý kiến thành công!", {
      duration: 3000,
      position: "top-right",
    });

    // Reset form
    setCommentForm({ name: "", email: "", comment: "" });
  };

  const handleInputChange = (field: string, value: string) => {
    setCommentForm((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Đang tải...</div>
        </div>
      </div>
    );
  }

  if (error || !blogPost) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-500">
            {error || "Không tìm thấy bài viết"}
          </div>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { href: "/", label: "Trang chủ" },
    { href: "/news", label: "Tin tức" },
    { href: `/news/${blogPost.slug}`, label: blogPost.title },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Breadcrumb */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Featured Image */}
      <div className="mb-8">
        <img
          src={getImageUrl(blogPost.featuredImage)}
          alt={blogPost.title}
          className="w-full h-64 md:h-96 object-cover rounded-lg"
        />
      </div>

      {/* Article Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          {blogPost.title}
        </h1>
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {blogPost.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none mb-8">
        <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
          {blogPost.content}
        </div>
      </div>

      {/* Article Meta */}
      <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-muted-foreground">
        <span>Ngày đăng: {formatDate(blogPost.publishedAt)}</span>
        <span>{blogPost.viewCount} lượt xem</span>
        <span>{blogPost.likesCount} lượt thích</span>
        <span>{blogPost.commentsCount} bình luận</span>
      </div>

      {/* Comment Form */}
      <CommentForm
        formData={commentForm}
        onFormChange={handleInputChange}
        onSubmit={handleCommentSubmit}
      />
    </div>
  );
}
