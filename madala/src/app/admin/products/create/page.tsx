'use client'

import { useState } from "react"
import { AdminLayout } from "@/Components/admin/AdminLayout"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Textarea } from "@/Components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Label } from "@/Components/ui/label"
import { Switch } from "@/Components/ui/switch"
import { ArrowLeft, Upload, X, Plus } from "lucide-react"
import PriceStockSection from "@/Components/admin/products/PriceStockSection";
import ProductImagesSection from "@/Components/admin/products/ProductImagesSection";
import CategoryTagsSection from "@/Components/admin/products/CategoryTagsSection";
import ProductAttributesSection from "@/Components/admin/products/ProductAttributesSection";
import ProductSettingsSection from "@/Components/admin/products/ProductSettingsSection";
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { validateProductForm, uploadImagesToCloudinary } from "@/lib/utils/productUtils"

interface ProductFormData {
  name: string
  description: string
  shortDescription: string
  price: string
  salePrice: string
  sku: string
  stock: string
  images: string[]
  categoryIds: string[]
  tags: string[]
  attributes: {
    brand?: string
    type?: string
    material?: string
    color?: string
    size?: string
    weight?: string
  }
  isActive: boolean
  isFeatured: boolean
  isHotTrend: boolean
  discountPercentage: string
}

export default function CreateProduct() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    salePrice: '',
    sku: '',
    stock: '0',
    images: [],
    categoryIds: [],
    tags: [],
    attributes: {},
    isActive: true,
    isFeatured: false,
    isHotTrend: false,
    discountPercentage: '0'
  })

  const [newTag, setNewTag] = useState('')
  const [newCategory, setNewCategory] = useState('')

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAttributeChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [key]: value
      }
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const addCategory = () => {
    if (newCategory.trim() && !formData.categoryIds.includes(newCategory.trim())) {
      setFormData(prev => ({
        ...prev,
        categoryIds: [...prev.categoryIds, newCategory.trim()]
      }))
      setNewCategory('')
    }
  }

  const removeCategory = (categoryToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.filter(cat => cat !== categoryToRemove)
    }))
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) {
      toast.error('Vui lòng chọn ít nhất một file')
      return
    }

    setUploadingImage(true)
    try {
      const imageUrls = await uploadImagesToCloudinary(files)

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...imageUrls]
      }))

      toast.success(`Tải lên ${imageUrls.length} ảnh thành công`)
    } catch (cloudinaryError) {
      console.error('Cloudinary upload failed:', cloudinaryError)
      toast.error(cloudinaryError instanceof Error ? cloudinaryError.message : 'Lỗi khi tải lên ảnh')
    } finally {
      setUploadingImage(false)
    }
  }

  const removeImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation using utility function
    const validationError = validateProductForm(formData)
    if (validationError) {
      toast.error(validationError)
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Tạo sản phẩm thành công!')
        router.push('/admin/products')
      } else {
        toast.error(data.error || 'Lỗi khi tạo sản phẩm')
      }
    } catch (error) {
      console.error('Error creating product:', error)
      toast.error('Lỗi khi tạo sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/products">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Thêm sản phẩm mới</h1>
              <p className="text-muted-foreground">Tạo sản phẩm mới trong hệ thống</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Thông tin cơ bản */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên sản phẩm *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Nhập tên sản phẩm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">Mã SKU *</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    placeholder="Ví dụ: MYPHAM-001"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Mô tả ngắn</Label>
                <Input
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                  placeholder="Mô tả ngắn về sản phẩm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả chi tiết</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Mô tả chi tiết về sản phẩm"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Giá và kho */}
          <PriceStockSection formData={formData} handleInputChange={handleInputChange} />

          {/* Hình ảnh */}
          <ProductImagesSection
            images={formData.images}
            uploadingImage={uploadingImage}
            handleImageUpload={handleImageUpload}
            removeImage={removeImage}
            getImageUrl={(url) => url}
          />

          {/* Danh mục và Tags */}
          <CategoryTagsSection
            newCategory={newCategory}
            setNewCategory={setNewCategory}
            addCategory={addCategory}
            removeCategory={removeCategory}
            categoryIds={formData.categoryIds}
            newTag={newTag}
            setNewTag={setNewTag}
            addTag={addTag}
            removeTag={removeTag}
            tags={formData.tags}
          />

          {/* Thuộc tính */}
          <ProductAttributesSection attributes={formData.attributes} handleAttributeChange={handleAttributeChange} />

          {/* Cài đặt */}
          <ProductSettingsSection
            isActive={formData.isActive}
            isFeatured={formData.isFeatured}
            isHotTrend={formData.isHotTrend}
            handleInputChange={handleInputChange}
          />

          {/* Submit buttons */}
          <div className="flex justify-end space-x-4">
            <Link href="/admin/products">
              <Button type="button" variant="outline" disabled={loading}>
                Hủy
              </Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang tạo...' : 'Tạo sản phẩm'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
