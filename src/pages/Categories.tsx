
import React from 'react';
import { useCategories } from '@/hooks/useCategories';
import PageLayout from '@/components/layouts/PageLayout';
import { CategoryGrid } from '@/components/categories/CategoryGrid';
import { CategoriesLoading } from '@/components/categories/CategoriesLoading';
import { CategoriesError } from '@/components/categories/CategoriesError';
import { CategoriesEmpty } from '@/components/categories/CategoriesEmpty';

const Categories = () => {
  const { data: categories, isLoading, error, refetch } = useCategories();

  const handleRetry = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <PageLayout title="Puzzle Categories" className="max-w-7xl">
        <CategoriesLoading />
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="Puzzle Categories" className="max-w-7xl">
        <CategoriesError onRetry={handleRetry} error={error} />
      </PageLayout>
    );
  }

  if (!categories?.length) {
    return (
      <PageLayout title="Puzzle Categories" className="max-w-7xl">
        <CategoriesEmpty onRefresh={handleRetry} />
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Puzzle Categories" className="max-w-7xl">
      <section className="mb-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Puzzle Categories</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore our diverse collection of puzzle categories. Each category offers unique challenges 
          and beautiful imagery to test your puzzle-solving skills.
        </p>
      </section>
      
      <CategoryGrid categories={categories} />
    </PageLayout>
  );
};

export default Categories;
