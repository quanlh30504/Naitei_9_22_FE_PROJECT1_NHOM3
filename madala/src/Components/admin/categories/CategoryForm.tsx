import React from "react";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/Components/ui/select";
import { Switch } from "@/Components/ui/switch";
import { Button } from "@/Components/ui/button";
import { DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/Components/ui/dialog";
import { Category } from "@/types/category";


export interface CategoryFormData {
    name: string;
    slug: string;
    description: string;
    parentId: string;
    sortOrder: number;
    isActive: boolean;
}

interface CategoryFormProps {
    formData: CategoryFormData;
    handleInputChange: (field: keyof CategoryFormData, value: any) => void;
    parentCategories: Category[];
    editingCategory: Category | null;
    setIsDialogOpen: (open: boolean) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
    formData,
    handleInputChange,
    parentCategories,
    editingCategory,
    setIsDialogOpen,
    onSubmit,
}) => (
        <form onSubmit={onSubmit}>
            <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-gray-100">
                    {editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-300">
                    {editingCategory ? 'Cập nhật thông tin danh mục' : 'Tạo danh mục mới cho cửa hàng'}
                </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-2">
                <div>
                    <Label htmlFor="name" className="block font-medium mb-1">Tên danh mục*</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="slug" className="block font-medium mb-1">Slug*</Label>
                    <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => handleInputChange('slug', e.target.value)}
                        className="w-full"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="description" className="block font-medium mb-1">Mô tả</Label>
                    <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="w-full"
                        rows={3}
                    />
                </div>
                <div>
                    <Label htmlFor="parentId" className="block font-medium mb-1">Danh mục cha</Label>
                    <Select
                        value={formData.parentId || "none"}
                        onValueChange={(value) => handleInputChange('parentId', value === "none" ? "" : value)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn danh mục cha (tùy chọn)" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Không có (Danh mục gốc)</SelectItem>
                            {parentCategories.map((category) => (
                                <SelectItem key={String(category.id)} value={String(category.id)}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <Label htmlFor="sortOrder" className="block font-medium mb-1">Thứ tự</Label>
                        <Input
                            id="sortOrder"
                            type="number"
                            value={formData.sortOrder}
                            onChange={(e) => handleInputChange('sortOrder', parseInt(e.target.value))}
                            className="w-full"
                            min="1"
                        />
                    </div>
                    <div className="flex items-end gap-2">
                        <Label htmlFor="isActive" className="block font-medium mb-1">Kích hoạt</Label>
                        <Switch
                            id="isActive"
                            checked={formData.isActive}
                            onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                        />
                    </div>
                </div>
            </div>
            <DialogFooter className="mt-4">
                <Button
                    type="button"
                    variant="outline"
                    className="text-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setIsDialogOpen(false)}
                >
                    Hủy
                </Button>
                <Button
                    type="submit"
                    className="bg-[#8ba63a] hover:bg-[#7a942c] text-white dark:bg-green-700 dark:hover:bg-green-800 dark:text-gray-100"
                >
                    {editingCategory ? 'Cập nhật' : 'Tạo danh mục'}
                </Button>
            </DialogFooter>
        </form>
);

export default CategoryForm;
