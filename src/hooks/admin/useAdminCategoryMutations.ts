
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminCategory } from '@/types/categoryTypes';
import { useToast } from '@/hooks/use-toast';

export function useAdminCategoryMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createCategory = useMutation({
    mutationFn: async (newCategory: Partial<AdminCategory>) => {
      if (!newCategory.name) {
        throw new Error("Category name is required");
      }
      
      const slug = newCategory.slug || newCategory.name.toLowerCase().replace(/\s+/g, '-');
      
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: newCategory.name,
          slug: slug,
          description: newCategory.description || '',
          image_url: newCategory.imageUrl || '/placeholder.svg',
          status: newCategory.status || 'inactive'
        })
        .select();

      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Success",
        description: "Category created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create category: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const updateCategory = useMutation({
    mutationFn: async (category: AdminCategory) => {
      if (!category.name) {
        throw new Error("Category name is required");
      }
      
      const { data, error } = await supabase
        .from('categories')
        .update({
          name: category.name,
          slug: category.slug || category.name.toLowerCase().replace(/\s+/g, '-'),
          description: category.description || '',
          image_url: category.imageUrl || '/placeholder.svg',
          status: category.status || 'inactive'
        })
        .eq('id', category.id)
        .select();

      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update category: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const deleteCategory = useMutation({
    mutationFn: async (categoryId: string) => {
      console.log('Starting category deletion process for ID:', categoryId);
      
      try {
        // First check if there are any puzzles using this category
        const { data: puzzles, error: checkError, count } = await supabase
          .from('puzzles')
          .select('id', { count: 'exact' })
          .eq('category_id', categoryId);

        if (checkError) {
          console.error('Error checking for puzzles:', checkError);
          throw checkError;
        }
        
        // Log for debugging
        console.log(`Found ${count || 0} puzzles for category ${categoryId}`);
        
        // If puzzles are found, prevent deletion
        if (count && count > 0) {
          console.log(`Preventing deletion: ${count} puzzles are using this category`);
          throw new Error(`Cannot delete category: ${count} puzzle(s) are using this category. Please reassign or delete these puzzles first.`);
        }

        // If no puzzles found, proceed with deletion
        console.log('No puzzles found, proceeding with deletion');
        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', categoryId);

        if (error) {
          console.error('Error deleting category:', error);
          throw error;
        }
        
        console.log('Category successfully deleted');
        return categoryId;
      } catch (error) {
        console.error('Category deletion failed:', error);
        throw error;
      }
    },
    onSuccess: (deletedId) => {
      console.log('Category deletion mutation succeeded:', deletedId);
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    },
    onError: (error: Error) => {
      console.error('Category deletion mutation error:', error);
      toast({
        title: "Error",
        description: `${error.message}`,
        variant: "destructive",
      });
    }
  });

  return {
    createCategory,
    updateCategory,
    deleteCategory
  };
}
