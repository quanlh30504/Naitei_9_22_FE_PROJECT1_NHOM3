import React, { useState } from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { ICategory } from '@/models/Category';
import { Button } from "@/Components/ui/button";

interface CategorySidebarProps {
  categories: ICategory[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const getCategoryId = (category: ICategory): string => {
    return category.categoryId || '';
  };

  const level1Categories = categories.filter(cat => cat.level === 1).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const getSubcategories = (parentCategoryId: string) => {
    return categories
      .filter(cat => cat.level === 2 && cat.parentId === parentCategoryId)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  };

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
          ☰ DANH MỤC SẢN PHẨM
        </h3>
      </div>

      <div className="p-4 space-y-2">
        {/* Show All Products Button */}
        <Button
          variant="ghost"
          onClick={() => onSelectCategory('')}
          className={`w-full justify-start px-3 py-2 text-sm font-medium border-b border-gray-200 pb-3 mb-3 rounded-none ${
            selectedCategory === ''
              ? 'text-green-600 bg-green-50'
              : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
          }`}
        >
          Tất cả sản phẩm
        </Button>

        {/* Level 1 Categories */}
        {level1Categories.map((category) => {
          const categoryId = getCategoryId(category);
          const subcategories = getSubcategories(categoryId);
          const hasSubcategories = subcategories.length > 0;
          const isExpanded = expandedCategories.has(categoryId);
          const isSelected = selectedCategory === categoryId;

          return (
            <div key={categoryId}>
              {/* Main Category */}
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={() => onSelectCategory(categoryId)}
                  className={`flex-1 justify-start px-3 py-2 text-sm font-medium rounded-none ${
                    isSelected
                      ? 'text-green-600 bg-green-50'
                      : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  {category.name}
                </Button>

                {/* Expand/Collapse Button for categories with subcategories */}
                {hasSubcategories && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleCategory(categoryId)}
                    className="p-1 h-auto text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  >
                    {isExpanded ? (
                      <FaChevronDown className="text-xs" />
                    ) : (
                      <FaChevronRight className="text-xs" />
                    )}
                  </Button>
                )}
              </div>

              {/* Subcategories - shown when expanded */}
              {hasSubcategories && isExpanded && (
                <div className="ml-6 mt-2 space-y-1">
                  {subcategories.map((subcategory) => {
                    const subcategoryId = getCategoryId(subcategory);
                    const isSubcategorySelected = selectedCategory === subcategoryId;

                    return (
                      <Button
                        key={subcategoryId}
                        variant="ghost"
                        onClick={() => onSelectCategory(subcategoryId)}
                        className={`w-full justify-start px-3 py-1.5 text-sm rounded ${
                          isSubcategorySelected
                            ? 'text-green-600 bg-green-50'
                            : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                        }`}
                      >
                        • {subcategory.name}
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default CategorySidebar;
