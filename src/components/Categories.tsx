
import React, { useEffect } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { CategoriesLoading } from './categories/CategoriesLoading';
import { CategoriesError } from './categories/CategoriesError';
import { CategoriesEmpty } from './categories/CategoriesEmpty';
import { CategoryGrid } from './categories/CategoryGrid';

const Categories: React.FC = () => {
  const { data: categories, isLoading, error, refetch } = useCategories();
  
  // Enhanced debugging - log when component mounts/unmounts
  useEffect(() => {
    console.log('Categories component mounted');
    return () => console.log('Categories component unmounted');
  }, []);
  
  // Debug categories whenever they change
  useEffect(() => {
    console.log('Categories data changed:', categories);
  }, [categories]);
  
  // Force refetch on mount
  useEffect(() => {
    console.log('Forcing initial categories fetch');
    refetch();
  }, [refetch]);

  const handleManualRefresh = () => {
    console.log('Manual refresh requested');
    refetch();
  };

  if (isLoading) {
    return <CategoriesLoading />;
  }

  if (error) {
    return <CategoriesError onRetry={handleManualRefresh} error={error} />;
  }

  if (!categories?.length) {
    return <CategoriesEmpty onRefresh={handleManualRefresh} />;
  }

  return (
    <section className="py-16 bg-puzzle-black/50" id="categories">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="section-title text-puzzle-white">
              Puzzle <span className="text-puzzle-gold">Categories</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mb-4">
              Explore a wide variety of puzzle types and challenges that test different skills and abilities.
            </p>
          </div>
          <Button onClick={handleManualRefresh} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Categories
          </Button>
        </div>
        
        <CategoryGrid categories={categories} />
      </div>
    </section>
  );
};

export default Categories;
