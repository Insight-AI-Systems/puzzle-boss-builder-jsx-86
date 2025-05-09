
import { useState } from 'react';
import { AdminCategory } from '@/types/categoryTypes';
import { useCategoryManagement } from '@/hooks/admin/useCategoryManagement';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useCategoryOperations = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
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

    if (confirm('Are you sure you want to delete this category?')) {
      console.log('Attempting to delete category:', categoryId);
      deleteCategory.mutate(categoryId);
    }
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
    handleAddCategory
  };
};
