
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesApi } from '@/api/categories-api';
import { CategoryModel, CategoryCreateDTO, CategoryUpdateDTO } from '@/types/category-models';
import { showErrorToast } from '@/utils/error-handling';

/**
 * React Query hook for fetching and managing categories
 */
export function useCategoriesQuery(options?: {
  status?: string;
  includeCount?: boolean;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: ['categories', options?.status, options?.includeCount],
    queryFn: async () => {
      const categories = await categoriesApi.getCategories({
        status: options?.status,
        includeCount: options?.includeCount,
        orderBy: 'name',
        ascending: true
      });
      return categories;
    },
    enabled: options?.enabled !== false
  });
}

/**
 * React Query hook for fetching a single category
 */
export function useCategoryQuery(id: string | undefined, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['category', id],
    queryFn: async () => {
      if (!id) return null;
      return await categoriesApi.getCategoryById(id);
    },
    enabled: !!id && options?.enabled !== false
  });
}

/**
 * React Query hooks for category mutations
 */
export function useCategoryMutations() {
  const queryClient = useQueryClient();
  
  const createCategory = useMutation({
    mutationFn: async (newCategory: CategoryCreateDTO) => {
      const result = await categoriesApi.createCategory(newCategory);
      if (!result) {
        throw new Error('Failed to create category');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to create category');
    }
  });
  
  const updateCategory = useMutation({
    mutationFn: async (updatedCategory: CategoryUpdateDTO) => {
      const result = await categoriesApi.updateCategory(updatedCategory);
      if (!result) {
        throw new Error('Failed to update category');
      }
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category', variables.id] });
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to update category');
    }
  });
  
  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const success = await categoriesApi.deleteCategory(id);
      if (!success) {
        throw new Error('Failed to delete category');
      }
      return success;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category', id] });
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to delete category');
    }
  });
  
  return {
    createCategory,
    updateCategory,
    deleteCategory
  };
}
