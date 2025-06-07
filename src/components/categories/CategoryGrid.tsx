
import React from 'react';
import { Category } from '@/hooks/useCategories';
import { CategoryCard } from './CategoryCard';
import { getColorForIndex, getCategoryImage } from './categoryUtils';

interface CategoryGridProps {
  categories: Category[];
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {categories.map((category, index) => (
        <CategoryCard
          key={category.id}
          categoryId={category.id}
          title={category.name}
          description={category.description || `Explore our ${category.name} puzzle collection`}
          icon={category.icon || undefined}
          color={getColorForIndex(index)}
          imageUrl={category.image_url || getCategoryImage(category.name)}
        />
      ))}
    </div>
  );
};
