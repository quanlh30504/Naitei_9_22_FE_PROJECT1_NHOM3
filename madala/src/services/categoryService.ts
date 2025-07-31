import { ICategory } from '@/models/Category';

class CategoryService {
    // Lấy tất cả categories
    async getAllCategories(): Promise<ICategory[]> {
        try {
            const response = await fetch('/api/categories', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                next: { revalidate: 300 }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch categories: ${response.statusText}`);
            }

            const categories: ICategory[] = await response.json();
            return categories;
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    }

    // Lấy categories theo level
    async getCategoriesByLevel(level: number): Promise<ICategory[]> {
        const allCategories = await this.getAllCategories();
        return allCategories.filter(cat => cat.level === level);
    }

    // Lấy parent categories (level 1)
    async getParentCategories(): Promise<ICategory[]> {
        return this.getCategoriesByLevel(1);
    }

    // Lấy subcategories (level 2)
    async getSubcategories(parentId?: string): Promise<ICategory[]> {
        const allCategories = await this.getAllCategories();
        if (parentId) {
            return allCategories.filter(cat => cat.level === 2 && cat.parentId === parentId);
        }
        return allCategories.filter(cat => cat.level === 2);
    }

    // Lấy category theo ID
    async getCategoryById(id: string): Promise<ICategory | null> {
        const allCategories = await this.getAllCategories();
        return allCategories.find(cat =>
            String(cat._id) === id ||
            cat.categoryId === id
        ) || null;
    }
}

export const categoryService = new CategoryService();
export default categoryService;
