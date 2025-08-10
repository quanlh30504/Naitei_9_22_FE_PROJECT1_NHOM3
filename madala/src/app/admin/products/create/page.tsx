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
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { validateProductForm, uploadImagesToCloudinary } from "@/lib/utils/productUtils"
import PriceStockSection from '@/Components/admin/products/PriceStockSection';
import ProductImagesSection from '@/Components/admin/products/ProductImagesSection';
import ProductCategoriesTagsSection from '@/Components/admin/products/ProductCategoriesTagsSection';
import ProductAttributesSection from '@/Components/admin/products/ProductAttributesSection';
import ProductSettingsSection from '@/Components/admin/products/ProductSettingsSection';
import ProductBasicInfoSection from '@/Components/admin/products/ProductBasicInfoSection';

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
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:text-black dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700 dark:hover:text-yellow-300"
                  onClick={() => router.push('/admin/products')}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Quay lại
                </Button>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-800">
                  Thêm sản phẩm mới
                </h1>
                <p className="text-base font-medium text-gray-700 dark:text-white">Tạo sản phẩm mới trong hệ thống</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Thông tin cơ bản */}
          <ProductBasicInfoSection
            name={formData.name}
            sku={formData.sku}
            shortDescription={formData.shortDescription}
            description={formData.description}
            handleInputChange={handleInputChange}
          />

          {/* Giá và kho */}
          <PriceStockSection formData={formData} handleInputChange={handleInputChange} />

          {/* Hình ảnh */}
          <ProductImagesSection
            images={formData.images}
            uploadingImage={uploadingImage}
            handleImageUpload={handleImageUpload}
            removeImage={removeImage}
          />

          {/* Danh mục và Tags */}
          <ProductCategoriesTagsSection
            categoryIds={formData.categoryIds}
            tags={formData.tags}
            newCategory={newCategory}
            newTag={newTag}
            setNewCategory={setNewCategory}
            setNewTag={setNewTag}
            addCategory={addCategory}
            removeCategory={removeCategory}
            addTag={addTag}
            removeTag={removeTag}
          />

          {/* Thuộc tính */}
          <ProductAttributesSection
            attributes={formData.attributes}
            handleAttributeChange={handleAttributeChange}
          />

          {/* Cài đặt */}
          <ProductSettingsSection
            isActive={formData.isActive}
            isFeatured={formData.isFeatured}
            isHotTrend={formData.isHotTrend}
            handleInputChange={handleInputChange}
          />

          {/* Submit buttons */}
          <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  className="border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:text-black dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700 dark:hover:text-yellow-300"
                  onClick={() => router.push('/admin/products')}
                >
                  Hủy
                </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang tạo...' : 'Tạo sản phẩm'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
