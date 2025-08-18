'use client'

import { useState, useEffect, useCallback, memo } from "react"
import { AdminLayout } from "@/Components/admin/AdminLayout"
import { Button } from "@/Components/ui/button"
import { PaginationWrapper } from "@/Components/PaginationWrapper";
import { Input } from "@/Components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Badge } from "@/Components/ui/badge"
import { Search, Plus, Edit, Trash2, Eye, Image as ImageIcon } from "lucide-react"
import { Product } from "@/types/product"
import toast from "react-hot-toast"
import Link from "next/link"
import { getImageUrl, formatPrice } from "@/lib/utils/productUtils"
import { ProductImage } from "@/Components/admin/ProductImage"
import { StatusBadge } from "@/Components/StatusBadge"

interface ProductsResponse {
  success: boolean
  data: {
    products: Product[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
      hasNext: boolean
      hasPrev: boolean
    }
  }
}

const ProductManagement = memo(function ProductManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  // Memoize fetch products function
  const fetchProducts = useCallback(async (page = 1, search = "") => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...(search && { search })
      })

      const response = await fetch(`/api/admin/products?${params}`)
      const data: ProductsResponse = await response.json()

      if (data.success) {
        setProducts(data.data.products)
        setCurrentPage(data.data.pagination.page)
        setTotalPages(data.data.pagination.totalPages)
        setTotal(data.data.pagination.total)
      } else {
        toast.error("Lỗi khi tải danh sách sản phẩm")
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error("Lỗi khi tải danh sách sản phẩm")
    } finally {
      setLoading(false)
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts(1, searchTerm)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, fetchProducts])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Memoize delete handler
  const handleDelete = useCallback(async (productId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Xóa sản phẩm thành công")
        fetchProducts(currentPage, searchTerm)
      } else {
        toast.error(data.error || "Lỗi khi xóa sản phẩm")
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error("Lỗi khi xóa sản phẩm")
    }
  }, [currentPage, searchTerm, fetchProducts]);

  // Memoize toggle status handler
  const handleToggleStatus = useCallback(async (productId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isActive: !currentStatus
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success(`${!currentStatus ? 'Kích hoạt' : 'Vô hiệu hóa'} sản phẩm thành công`)
        fetchProducts(currentPage, searchTerm)
      } else {
        toast.error(data.error || "Lỗi khi cập nhật trạng thái sản phẩm")
      }
    } catch (error) {
      console.error('Error updating product status:', error)
      toast.error("Lỗi khi cập nhật trạng thái sản phẩm")
    }
  }, [currentPage, searchTerm, fetchProducts]);

  // Memoize stock display function
  const getStockDisplay = useCallback((stock: number) => {
    const stockClass = stock === 0 ? "text-red-500 font-semibold" : stock < 10 ? "text-orange-500" : ""
    return <span className={stockClass}>{stock}</span>
  }, []);

  // Memoize search handler
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Quản lý sản phẩm</h1>
            <p className="text-muted-foreground">
              Quản lý kho sản phẩm và danh mục ({total} sản phẩm)
            </p>
          </div>
          <Link href="/admin/products/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm sản phẩm
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách sản phẩm</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-8"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hình ảnh</TableHead>
                      <TableHead>Tên sản phẩm</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Giá</TableHead>
                      <TableHead>Giá khuyến mãi</TableHead>
                      <TableHead>Tồn kho</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Lượt xem</TableHead>
                      <TableHead>Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product._id}>
                        <TableCell>
                          <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                            {product.images && product.images.length > 0 ? (
                              <ProductImage
                                src={getImageUrl(product.images[0])}
                                alt={product.name}
                                width={48}
                                height={48}
                                className="object-cover w-full h-full"
                                fallbackClassName="w-12 h-12"
                              />
                            ) : (
                              <ImageIcon className="w-6 h-6 text-muted-foreground" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-xs">
                              {product.shortDescription}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {product.sku}
                          </code>
                        </TableCell>
                        <TableCell>{formatPrice(product.price)}</TableCell>
                        <TableCell>
                          {product.salePrice && product.salePrice < product.price ? (
                            <span className="text-red-600 font-semibold">
                              {formatPrice(product.salePrice)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>{getStockDisplay(product.stock)}</TableCell>
                        <TableCell>
                          <button
                            onClick={() => handleToggleStatus(product._id, product.isActive)}
                            className="cursor-pointer"
                          >
                            <StatusBadge product={product} />
                          </button>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {product.viewCount || 0}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Link href={`/products/${product.slug}`} target="_blank">
                              <Button variant="ghost" size="sm" title="Xem sản phẩm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/admin/products/${product._id}/edit`}>
                              <Button variant="ghost" size="sm" title="Chỉnh sửa">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Xóa sản phẩm"
                              onClick={() => handleDelete(product._id)}
                              disabled={loading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <>
                    <div className="text-sm text-muted-foreground py-2">
                      Hiển thị {products.length} trên {total} sản phẩm
                    </div>
                    <PaginationWrapper
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={(page) => fetchProducts(page, searchTerm)}
                    />
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
});

export default ProductManagement;
