
import { useState } from 'react';
import { AdminCategory } from '@/types/categoryTypes';
import { useCategoryManagement } from '@/hooks/admin/useCategoryManagement';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useCategoryOperations = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { 
    categories,
    isLoading,
    isError,
    error,
    refetch,
    createCategory,
    updateCategory,
    deleteCategory
  } = useCategoryManagement();

  const handleEditCategory = (category: AdminCategory) => {
    setEditingCategory({...category});
  };

  const handleSaveCategory = () => {
    if (editingCategory) {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to manage categories.",
          variant: "destructive",
        });
        return;
      }

      if (!editingCategory.name || editingCategory.name.trim() === "") {
        toast({
          title: "Validation Error",
          description: "Category name is required.",
          variant: "destructive",
        });
        return;
      }

      if (editingCategory.id) {
        updateCategory.mutate(editingCategory);
      } else {
        createCategory.mutate(editingCategory);
        setIsAddDialogOpen(false);
      }
      setEditingCategory(null);
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to delete categories.",
        variant: "destructive",
      });
      return;
    }

    console.log('Delete category requested for ID:', categoryId);
    // Set the category for deletion
    setCategoryToDelete(categoryId);
    setIsDeleteConfirmOpen(true);
  };
  
  const confirmDeleteCategory = () => {
    if (categoryToDelete) {
      console.log('Delete confirmed by user for category:', categoryToDelete);
      deleteCategory.mutate(categoryToDelete);
    }
  };
  
  const cancelDeleteCategory = () => {
    console.log('User cancelled category deletion');
    setIsDeleteConfirmOpen(false);
    setCategoryToDelete(null);
  };

  const handleAddCategory = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create categories.",
        variant: "destructive",
      });
      return;
    }
    
    const newCategory: Partial<AdminCategory> = {
      name: "",
      imageUrl: "/placeholder.svg",
      description: "",
      puzzleCount: 0,
      activeCount: 0,
      status: "inactive"
    };
    
    setEditingCategory(newCategory as AdminCategory);
    setIsAddDialogOpen(true);
  };

  const handleDeletePuzzle = async (puzzleId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to delete puzzles.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Deleting puzzle with ID:', puzzleId);
      
      // Delete the puzzle from the puzzles table
      const { error } = await supabase
        .from('puzzles')
        .delete()
        .eq('id', puzzleId);

      if (error) {
        console.error('Error deleting puzzle:', error);
        toast({
          title: "Error",
          description: `Failed to delete puzzle: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      // Success
      toast({
        title: "Success",
        description: "Puzzle removed successfully",
      });

      // Invalidate relevant queries to refresh data
      refetch();
    } catch (error: any) {
      console.error('Failed to delete puzzle:', error);
      toast({
        title: "Error",
        description: `An unexpected error occurred: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return {
    isAddDialogOpen,
    setIsAddDialogOpen,
    editingCategory,
    setEditingCategory,
    categories,
    isLoading,
    isError,
    error,
    refetch,
    handleEditCategory,
    handleSaveCategory,
    handleDeleteCategory,
    handleAddCategory,
    isDeleteConfirmOpen,
    setIsDeleteConfirmOpen,
    confirmDeleteCategory,
    cancelDeleteCategory,
    categoryToDelete,
    handleDeletePuzzle
  };
};
