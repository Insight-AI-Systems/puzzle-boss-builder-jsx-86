
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Category } from '@/hooks/useCategories';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

// Extend the Category type with admin-specific fields
export interface AdminCategory extends Category {
  puzzleCount?: number;
  activeCount?: number;
  status?: 'active' | 'inactive';
  imageUrl?: string;
}

export function useCategoryManagement() {
  const queryClient = useQueryClient();
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const { user } = useAuth(); // Add auth context to get current user
  const { toast } = useToast();

  // Helper to handle missing fields from the DB results
  const mapDbCategory = (category: Record<string, any>): AdminCategory => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description || '',
    imageUrl: typeof category.image_url === "string" ? category.image_url : "/placeholder.svg",
    status:
      category.status === "active" || category.status === "inactive"
        ? category.status
        : "inactive",
    puzzleCount: 0,
    activeCount: 0,
  });

  // Fetch categories with additional admin fields
  const categoriesQuery = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async (): Promise<AdminCategory[]> => {
      console.log('Admin: Fetching categories from Supabase...');
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching admin categories:', error);
        throw error;
      }

      console.log('Admin categories fetched successfully:', data);

      // Use typeguard/normalization for missing fields
      return Array.isArray(data)
        ? data.map(mapDbCategory)
        : [];
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0, // Always consider data stale
    gcTime: 1000, // Only cache for 1 second
  });

  // Create a new category
  const createCategory = useMutation({
    mutationFn: async (newCategory: Partial<AdminCategory>) => {
      // Check if user is authenticated
      if (!user) {
        console.error("Error creating category: User not authenticated");
        throw new Error("You must be logged in to create a category.");
      }
      
      if (!newCategory.name) {
        throw new Error("Category name is required");
      }
      
      const slug = newCategory.slug || newCategory.name.toLowerCase().replace(/\s+/g, '-');
      
      console.log('Creating new category with data:', {
        ...newCategory,
        slug
      });

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

      if (error) {
        console.error('Error creating category:', error);
        throw error;
      }

      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] }); // Invalidate public categories as well
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

  // Update an existing category
  const updateCategory = useMutation({
    mutationFn: async (category: AdminCategory) => {
      // Check if user is authenticated
      if (!user) {
        console.error("Error updating category: User not authenticated");
        throw new Error("You must be logged in to update a category.");
      }
      
      if (!category.name) {
        throw new Error("Category name is required");
      }
      
      console.log('Updating category with data:', category);

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

      if (error) {
        console.error('Error updating category:', error);
        throw error;
      }

      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] }); // Invalidate public categories as well
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

  // Delete a category
  const deleteCategory = useMutation({
    mutationFn: async (categoryId: string) => {
      // Check if user is authenticated
      if (!user) {
        console.error("Error deleting category: User not authenticated");
        throw new Error("You must be logged in to delete a category.");
      }
      
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) {
        console.error('Error deleting category:', error);
        throw error;
      }

      return categoryId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] }); // Invalidate public categories as well
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
    categories: categoriesQuery.data || [],
    isLoading: categoriesQuery.isLoading,
    isError: categoriesQuery.isError,
    error: categoriesQuery.error,
    refetch: categoriesQuery.refetch,
    editingCategory,
    setEditingCategory,
    createCategory,
    updateCategory,
    deleteCategory
  };
}
