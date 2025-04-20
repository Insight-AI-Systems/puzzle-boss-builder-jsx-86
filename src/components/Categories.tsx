
import React, { useEffect } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { Loader2 } from 'lucide-react';

interface CategoryProps {
  title: string;
  description: string;
  icon?: string;
  color: string;
}

const CategoryCard: React.FC<CategoryProps> = ({ title, description, icon, color }) => {
  return (
    <div className="card-highlight p-6 hover:translate-y-[-5px] transition-all duration-300">
      <div className={`w-16 h-16 ${color} rounded-full flex items-center justify-center mx-auto mb-4`}>
        <span className="text-3xl">{icon || '🎯'}</span>
      </div>
      <h3 className="text-xl font-bold text-center mb-2">{title}</h3>
      <p className="text-muted-foreground text-center">{description}</p>
    </div>
  );
};

const getColorForIndex = (index: number): string => {
  const colors = [
    'bg-puzzle-aqua/20',
    'bg-puzzle-gold/20',
    'bg-puzzle-burgundy/20',
    'bg-purple-500/20',
    'bg-green-500/20',
    'bg-blue-500/20'
  ];
  return colors[index % colors.length];
};

const Categories: React.FC = () => {
  const { data: categories, isLoading, error, refetch } = useCategories();
  
  // Add effect to log categories when they change
  useEffect(() => {
    console.log('Categories in component:', categories);
  }, [categories]);
  
  // Force refetch on mount
  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-puzzle-aqua" />
      </div>
    );
  }

  if (error) {
    console.error('Error loading categories:', error);
    return (
      <div className="text-center text-red-500 py-8">
        Failed to load categories. Please try again later.
      </div>
    );
  }

  if (!categories?.length) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No categories available.
      </div>
    );
  }

  return (
    <section className="py-16 bg-puzzle-black/50" id="categories">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-puzzle-white">
          Puzzle <span className="text-puzzle-gold">Categories</span>
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          Explore a wide variety of puzzle types and challenges that test different skills and abilities.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.id}
              title={category.name}
              description={category.description || `Explore our ${category.name} puzzle collection`}
              icon={category.icon}
              color={getColorForIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
