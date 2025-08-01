
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AdminCategory } from '@/types/categoryTypes';
import { useAdminCategoryQueries } from './useAdminCategoryQueries';
import { useAdminCategoryMutations } from './useAdminCategoryMutations';

export function useCategoryManagement() {
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const { user } = useAuth();
  
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
