
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
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;
      return categoryId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete category: ${error.message}`,
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
