
import { apiClient } from '@/integrations/supabase/api-client';
import { useApiQuery, useApiMutation } from './useQueryHelpers';

export type Category = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  status: string;
  slug: string;
  created_at: string;
  updated_at: string;
};

/**
 * Get all categories
 */
export function useCategories() {
  return useApiQuery<Category[]>(
    ['categories'],
    async () => {
      return apiClient.get<Category[]>('categories', {
        query: '*, count:puzzles(count)'
      });
    }
  );
}

/**
 * Get a category by ID
 */
export function useCategoryById(id: string) {
  return useApiQuery<Category>(
    ['category', id],
    async () => {
      return apiClient.getById<Category>('categories', id);
    },
    {
      enabled: !!id
    }
  );
}

/**
 * Create a new category
 */
export function useCreateCategory() {
  return useApiMutation<Category, Omit<Category, 'id' | 'created_at' | 'updated_at'>>(
    async (newCategory) => {
      return apiClient.create<Category>('categories', newCategory);
    }
  );
}

/**
 * Update an existing category
 */
export function useUpdateCategory() {
  return useApiMutation<Category, { id: string, category: Partial<Category> }>(
    async ({ id, category }) => {
      return apiClient.update<Category>('categories', id, category);
    }
  );
}

/**
 * Delete a category
 */
export function useDeleteCategory() {
  return useApiMutation<null, string>(
    async (id) => {
      return apiClient.delete('categories', id);
    }
  );
}

/**
 * Get puzzles by category ID
 */
export function usePuzzlesByCategoryId(categoryId: string | null) {
  return useApiQuery(
    ['puzzles', 'category', categoryId],
    async () => {
      if (!categoryId) {
        return { data: [], error: null };
      }
      
      const { data, error } = await apiClient.query('puzzles')
        .select('id, title, status, image_url')
        .eq('category_id', categoryId);
        
      return { data, error };
    },
    {
      enabled: !!categoryId
    }
  );
}
