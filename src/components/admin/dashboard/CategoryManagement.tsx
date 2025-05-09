
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon, Plus, RefreshCw, AlertCircle } from "lucide-react";
import { Loader2 } from 'lucide-react';
import { CategoryTable } from './CategoryTable';
import { AddCategoryDialog } from './AddCategoryDialog';
import { useCategoryOperations } from '@/hooks/admin/useCategoryOperations';

export const CategoryManagement: React.FC = () => {
  const {
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
    confirmDeleteCategory,
    cancelDeleteCategory,
    categoryToDelete
  } = useCategoryOperations();

  // Create wrapper functions for the refetch calls to fix TypeScript errors
  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-puzzle-aqua" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <div className="flex flex-col items-center gap-2 mb-4">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <div className="text-red-500">
            Failed to load categories. Please try again later.
          </div>
          <div className="text-sm text-muted-foreground">
            Error: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        </div>
        <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <ImageIcon className="h-5 w-5 mr-2" />
                Category Management
              </CardTitle>
              <CardDescription>Manage puzzle categories and items</CardDescription>
            </div>
            <Button onClick={handleRefresh} variant="outline" size="sm" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-medium">Categories</h3>
              <p className="text-sm text-muted-foreground">
                {categories.length} total categories, {categories.filter(c => c.status === "active").length} active
              </p>
            </div>
            <Button onClick={handleAddCategory}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
          
          {categories.length === 0 ? (
            <div className="text-center py-6 border rounded-md">
              <p className="text-muted-foreground">No categories available. Add your first category to get started.</p>
            </div>
          ) : (
            <CategoryTable
              categories={categories}
              editingCategory={editingCategory}
              setEditingCategory={setEditingCategory}
              handleEditCategory={handleEditCategory}
              handleDeleteCategory={handleDeleteCategory}
              handleSaveCategory={handleSaveCategory}
              isDeleteConfirmOpen={isDeleteConfirmOpen}
              confirmDeleteCategory={confirmDeleteCategory}
              cancelDeleteCategory={cancelDeleteCategory}
              categoryToDelete={categoryToDelete}
            />
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Categories will be available for puzzle creation once activated.
          </p>
        </CardFooter>
      </Card>
      
      <AddCategoryDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        editingCategory={editingCategory}
        setEditingCategory={setEditingCategory}
        handleSaveCategory={handleSaveCategory}
      />
    </div>
  );
};
