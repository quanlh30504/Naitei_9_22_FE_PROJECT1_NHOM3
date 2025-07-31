"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/Components/ui/button";
import { ChevronLeft, ChevronRight, Grid, List } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import {
  BlogService,
  BlogPost,
  formatDate,
} from "@/services/blogService";
import { BlogPostCard } from "@/Components/news/BlogPostCard";
import { PaginationWrapper } from "@/Components/ui/pagination-wrapper";

export default function NewsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const postsPerPage = 6;

  useEffect(() => {
    fetchBlogPosts(currentPage);
  }, [currentPage]);

  const fetchBlogPosts = async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await BlogService.getBlogPosts(page, postsPerPage);
      setBlogPosts(response.data.posts);
      setTotalPages(response.data.pagination.totalPages);
    } catch (err) {
      setError("Không thể tải danh sách bài viết");
      console.error("Error fetching blog posts:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Đang tải...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <span>/</span>
        <span>Tin tức</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">TIN TỨC</h1>

        {/* View Toggle */}
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div
        className={`grid gap-6 mb-8 ${
          viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        }`}
      >
        {blogPosts.map((post) => (
          <BlogPostCard key={post._id} post={post} viewMode={viewMode} />
        ))}
      </div>

      {/* Pagination */}
      <PaginationWrapper
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
