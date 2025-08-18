'use client';

import { useState, useEffect, useCallback, memo, useMemo } from "react";
import { AdminLayout } from "@/Components/admin/AdminLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Search, Plus, FileText } from "lucide-react";
import BlogActionButtons from "@/Components/admin/blog/BlogActionButtons";
import toast from "react-hot-toast";
import Image from "next/image";
import { BlogPost, BlogStats } from "@/types/blog";
import { BlogService } from "@/services/blogService";
import BlogStatsCards from "@/Components/admin/blog/BlogStatsCards";

function BlogManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [stats, setStats] = useState<BlogStats>({
    total: 0,
    published: 0,
    draft: 0,
    totalViews: 0
  });
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Memoize fetch blog posts function
  const fetchBlogPosts = useCallback(async () => {
    try {
      setLoading(true);
      const result = await BlogService.getBlogPosts(1, 100, true); // limit=100, includeUnpublished=true
      if (result.success) {
        setBlogPosts(result.data.posts);
        const posts = result.data.posts;
        const totalViews = posts.reduce((sum: number, post: BlogPost) => sum + post.viewCount, 0);
        setStats({
          total: posts.length,
          published: posts.filter((p: BlogPost) => p.isPublished).length,
          draft: posts.filter((p: BlogPost) => !p.isPublished).length,
          totalViews
        });
      } else {
        toast.error('Lỗi khi tải danh sách bài viết');
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách bài viết');
    } finally {
      setLoading(false);
    }
  }, []);

  // Memoize delete handler
  const handleDelete = useCallback(async (slug: string, title: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa bài viết "${title}"?`)) return;
    try {
      setDeleting(slug);
      await BlogService.deleteBlogPost(slug);
      toast.success('Xóa bài viết thành công');
      fetchBlogPosts();
    } catch (error) {
      toast.error('Lỗi khi xóa bài viết');
    } finally {
      setDeleting(null);
    }
  }, [fetchBlogPosts]);

  // Memoize toggle publish handler
  const togglePublishStatus = useCallback(async (slug: string, currentStatus: boolean) => {
    try {
      await BlogService.updateBlogPost(slug, {
        isPublished: !currentStatus
      });
      toast.success(`${!currentStatus ? 'Xuất bản' : 'Hủy xuất bản'} bài viết thành công`);
      fetchBlogPosts();
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  }, [fetchBlogPosts]);

  // Memoize search handler
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  // Memoize filtered posts
  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [blogPosts, searchTerm]);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const getStatusBadge = (isPublished: boolean) => (
    <Badge variant={isPublished ? "default" : "secondary"}>
      {isPublished ? "Đã xuất bản" : "Bản nháp"}
    </Badge>
  );

  const formatDate = (dateInput: string | any) => {
    const date = typeof dateInput === 'object' && dateInput.$date
      ? new Date(dateInput.$date)
      : new Date(dateInput);

    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
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
          <div>
            <h1 className="text-3xl font-bold text-foreground">Quản lý Blog</h1>
            <p className="text-muted-foreground">Quản lý bài viết và tin tức website</p>
          </div>
          <Button onClick={() => window.location.href = '/admin/blog/create'}>
            <Plus className="mr-2 h-4 w-4" />
            Viết bài mới
          </Button>
        </div>

        {/* Stats Cards */}
        <BlogStatsCards stats={stats} />

        {/* Blog Posts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách bài viết</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm bài viết..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-8"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ảnh</TableHead>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Lượt xem</TableHead>
                  <TableHead>Lượt thích</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post._id}>
                    <TableCell>
                      <div className="relative w-16 h-12 rounded-md overflow-hidden">
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div>
                        <p className="font-medium truncate">{post.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{post.excerpt}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{post.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(post.isPublished)}
                    </TableCell>
                    <TableCell>{formatDate(post.createdAt)}</TableCell>
                    <TableCell>{post.viewCount.toLocaleString()}</TableCell>
                    <TableCell>{post.likesCount.toLocaleString()}</TableCell>
                    <TableCell>
                      <BlogActionButtons
                        post={post}
                        deleting={deleting}
                        onDelete={handleDelete}
                        onTogglePublish={togglePublishStatus}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredPosts.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? 'Không tìm thấy bài viết nào phù hợp' : 'Chưa có bài viết nào'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

export default memo(BlogManagement);
