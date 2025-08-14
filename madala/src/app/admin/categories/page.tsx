'use client';

import React, { useState, useEffect } from 'react';
import { AdminGuard } from '@/Components/admin/AdminGuard';
import { AdminLayout } from '@/Components/admin/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import CategoryForm from '@/Components/admin/categories/CategoryForm';
import { CategoryTable } from '@/Components/admin/categories/CategoryTable';
import { Category } from '@/types/category';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/Components/ui/dialog';
import { Label } from '@/Components/ui/label';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ICategory } from '@/models/Category';
import { categoryService } from '@/services/categoryService';

interface CategoryFormData {
    name: string;
    slug: string;
    description: string;
    parentId: string;
    level: number;
    sortOrder: number;
    isActive: boolean;
}

const initialFormData: CategoryFormData = {
    name: '',
    slug: '',
    description: '',
    parentId: '',
    level: 1,
    sortOrder: 1,
    isActive: true,
};

export default function CategoriesPage() {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [parentCategories, setParentCategories] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
    const [formData, setFormData] = useState<CategoryFormData>(initialFormData);

    // Fetch data
    useEffect(() => {
        fetchCategories();
        fetchParentCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await categoryService.getAllCategories({ includeInactive: true });
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Không thể tải danh sách danh mục');
        } finally {
            setLoading(false);
        }
    };

    const fetchParentCategories = async () => {
        try {
            const data = await categoryService.getParentCategories();
            setParentCategories(data);
        } catch (error) {
            console.error('Error fetching parent categories:', error);
        }
    };

    // Convert ICategory[] to Category[] for UI components
    const convertToCategory = (cat: ICategory): Category => ({
        id: cat.categoryId || cat.id || '',
        name: cat.name,
        slug: cat.slug,
        description: cat.description || '',
        parentId: cat.parentId ?? null,
        level: cat.level,
        sortOrder: cat.sortOrder,
        isActive: cat.isActive,
    });

    const categoriesForUI: Category[] = categories.map(convertToCategory);
    const parentCategoriesForUI: Category[] = parentCategories.map(convertToCategory);
    const filteredCategories: Category[] = categoriesForUI.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Form handlers
    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Auto-generate slug when name changes
        if (field === 'name') {
            setFormData(prev => ({
                ...prev,
                slug: categoryService.generateSlug(value)
            }));
        }

        // Auto-set level based on parentId
        if (field === 'parentId') {
            setFormData(prev => ({
                ...prev,
                level: value ? 2 : 1
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const categoryData = {
                ...formData,
                parentId: formData.parentId || null,
            };

            let result;
            if (editingCategory) {
                result = await categoryService.updateCategory(String(editingCategory._id), categoryData);
            } else {
                result = await categoryService.createCategory(categoryData);
            }

            if (result.success) {
                toast.success(result.message || (editingCategory ? 'Cập nhật thành công' : 'Tạo danh mục thành công'));
                setIsDialogOpen(false);
                resetForm();
                fetchCategories();
                if (!editingCategory) fetchParentCategories(); // Refresh parent categories if new category
            } else {
                toast.error(result.error || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Error saving category:', error);
            toast.error('Có lỗi xảy ra khi lưu danh mục');
        }
    };

    const handleEdit = (category: ICategory) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            slug: category.slug,
            description: category.description || '',
            parentId: category.parentId || '',
            level: category.level,
            sortOrder: category.sortOrder,
            isActive: category.isActive,
        });
        setIsDialogOpen(true);
    };

    const handleDelete = async (category: ICategory) => {
        if (!confirm(`Bạn có chắc chắn muốn xóa danh mục "${category.name}"?`)) {
            return;
        }

        try {
            const result = await categoryService.deleteCategory(String(category._id));

            if (result.success) {
                toast.success(result.message || 'Xóa danh mục thành công');
                fetchCategories();
                fetchParentCategories();
            } else {
                toast.error(result.error || 'Có lỗi xảy ra khi xóa danh mục');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            toast.error('Có lỗi xảy ra khi xóa danh mục');
        }
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setEditingCategory(null);
    };

    const getParentCategoryName = (parentId: string | null | undefined) => {
        if (!parentId) return '-';
        const parent = categoriesForUI.find(cat => String(cat.id) === parentId);
        return parent ? parent.name : parentId;
    };

    return (
        <AdminGuard>
            <AdminLayout>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Quản lý danh mục</h1>
                            <p className="text-gray-600 mt-1">
                                Quản lý danh mục sản phẩm của cửa hàng
                            </p>
                        </div>

                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={resetForm} className="bg-[#8ba63a] hover:bg-[#7a942c]">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Thêm danh mục
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <CategoryForm
                                    formData={formData}
                                    handleInputChange={handleInputChange}
                                    parentCategories={parentCategoriesForUI}
                                    editingCategory={editingCategory ? convertToCategory(editingCategory) : null}
                                    setIsDialogOpen={setIsDialogOpen}
                                    onSubmit={handleSubmit}
                                />
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Search */}
                    <div className="flex items-center space-x-2">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm danh mục..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                        <Badge variant="secondary">
                            {filteredCategories.length} danh mục
                        </Badge>
                    </div>

                    {/* Categories Table */}
                    <CategoryTable
                        categories={categoriesForUI}
                        loading={loading}
                        filteredCategories={filteredCategories}
                        getParentCategoryName={getParentCategoryName}
                        handleEdit={(cat) => handleEdit(categories.find(c => (c.categoryId || c.id) === cat.id) as ICategory)}
                        handleDelete={(cat) => handleDelete(categories.find(c => (c.categoryId || c.id) === cat.id) as ICategory)}
                    />
                </div>
            </AdminLayout>
        </AdminGuard>
    );
}
