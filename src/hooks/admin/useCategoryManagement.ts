
import { useState } from 'react';
import { useClerkAuth } from '@/hooks/useClerkAuth';
import { AdminCategory } from '@/types/categoryTypes';
import { useAdminCategoryQueries } from './useAdminCategoryQueries';
import { useAdminCategoryMutations } from './useAdminCategoryMutations';

export function useCategoryManagement() {
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const { user } = useClerkAuth();
  
  const {
    data: categories = [],
    isLoading,
    isError,
    error,
    refetch
  } = useAdminCategoryQueries();

  const {
    createCategory,
    updateCategory,
    deleteCategory
  } = useAdminCategoryMutations();

  return {
    categories,
    isLoading,
    isError,
    error,
    refetch,
    editingCategory,
    setEditingCategory,
    createCategory,
    updateCategory,
    deleteCategory
  };
}
