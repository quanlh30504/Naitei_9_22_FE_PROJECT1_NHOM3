'use client'

import { useState, useEffect, use } from "react"
import { AdminLayout } from "@/Components/admin/AdminLayout"
import { Button } from "@/Components/ui/button"
import { ArrowLeft, Upload, X, Plus } from "lucide-react"
import ProductBasicInfoSection from '@/Components/admin/products/ProductBasicInfoSection';
import PriceStockSection from '@/Components/admin/products/PriceStockSection';
import ProductImagesSection from '@/Components/admin/products/ProductImagesSection';
import ProductCategoriesTagsSection from '@/Components/admin/products/ProductCategoriesTagsSection';
import ProductAttributesSection from '@/Components/admin/products/ProductAttributesSection';
import ProductSettingsSection from '@/Components/admin/products/ProductSettingsSection';
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Product } from "@/types/product"
import { getImageUrl, convertAttributesForForm, validateProductForm, uploadImagesToCloudinary } from "@/lib/utils/productUtils"

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

export default function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const [loading, setLoading] = useState(false)
  const [loadingProduct, setLoadingProduct] = useState(true)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [productId, setProductId] = useState<string>('')
  
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

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/admin/products/${resolvedParams.id}`)
        const data = await response.json()
        
        if (data.success) {
          const product: Product = data.data
          setProductId(product._id)
          setFormData({
            name: product.name,
            description: product.description,
            shortDescription: product.shortDescription,
            price: product.price.toString(),
            salePrice: product.salePrice?.toString() || '',
            sku: product.sku,
            stock: product.stock.toString(),
            images: product.images || [],
            categoryIds: product.categoryIds || [],
            tags: product.tags || [],
            attributes: convertAttributesForForm(product.attributes),
            isActive: product.isActive,
            isFeatured: product.isFeatured,
            isHotTrend: product.isHotTrend,
            discountPercentage: product.discountPercentage?.toString() || '0'
          })
        } else {
          toast.error('Không tìm thấy sản phẩm')
          router.push('/admin/products')
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        toast.error('Lỗi khi tải thông tin sản phẩm')
        router.push('/admin/products')
      } finally {
        setLoadingProduct(false)
      }
    }

    fetchProduct()
  }, [resolvedParams.id, router])

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
    if (newTag.trim() && !(formData.tags || []).includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(tag => tag !== tagToRemove)
    }))
  }

  const addCategory = () => {
    if (newCategory.trim() && !(formData.categoryIds || []).includes(newCategory.trim())) {
      setFormData(prev => ({
        ...prev,
        categoryIds: [...(prev.categoryIds || []), newCategory.trim()]
      }))
      setNewCategory('')
    }
  }

  const removeCategory = (categoryToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: (prev.categoryIds || []).filter(cat => cat !== categoryToRemove)
    }))
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploadingImage(true)
    try {
      // Try Cloudinary first, fallback to local upload
      try {
        const imageUrls = await uploadImagesToCloudinary(files)
        
        setFormData(prev => ({
          ...prev,
          images: [...(prev.images || []), ...imageUrls]
        }))
        
        toast.success(`Tải lên ${imageUrls.length} ảnh thành công`)
      } catch (cloudinaryError) {
        console.warn('Cloudinary upload failed, trying local upload:', cloudinaryError)
        
        // Fallback to local upload via API
        const formData = new FormData()
        Array.from(files).forEach(file => {
          formData.append('files', file)
        })
        
        const response = await fetch('/api/upload?type=product', {
          method: 'POST',
          body: formData
        })
        
        const result = await response.json()
        
        if (result.success) {
          setFormData(prev => ({
            ...prev,
            images: [...(prev.images || []), ...(result.data.files || [])]
          }))
          
          toast.success(`Tải lên ${result.data.files.length} ảnh thành công (local)`)
        } else {
          throw new Error(result.error || 'Local upload failed')
        }
      }
    } catch (error) {
      console.error('Error uploading images:', error)
      toast.error(error instanceof Error ? error.message : 'Lỗi khi tải lên ảnh')
    } finally {
      setUploadingImage(false)
    }
  }

  const removeImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, index) => index !== indexToRemove)
    }))
  }

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('https://res.cloudinary.com')) {
      return imagePath
    }
    return imagePath.replace('/public/', '/')
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
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success('Cập nhật sản phẩm thành công!')
        router.push('/admin/products')
      } else {
        toast.error(data.error || 'Lỗi khi cập nhật sản phẩm')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error('Lỗi khi cập nhật sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  if (loadingProduct) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    )
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
              Chỉnh sửa sản phẩm
            </h1>
            <p className="text-base font-medium text-gray-700 dark:text-gray-400">Cập nhật thông tin sản phẩm</p>
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
              {loading ? 'Đang cập nhật...' : 'Cập nhật sản phẩm'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
