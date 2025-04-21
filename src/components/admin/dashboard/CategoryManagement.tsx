import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogClose 
} from "@/components/ui/dialog";
import { Trash2, Edit, Plus, ImageIcon, RefreshCw, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCategoryManagement, AdminCategory } from '@/hooks/admin/useCategoryManagement';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { CategoryImageUpload } from "./CategoryImageUpload";
import { usePuzzleCount } from "./usePuzzleCount";

export const CategoryManagement: React.FC = () => {
  const { 
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
  } = useCategoryManagement();
  
  // Log component lifecycle and data changes
  useEffect(() => {
    console.log('CategoryManagement component mounted');
    return () => console.log('CategoryManagement component unmounted');
  }, []);
  
  useEffect(() => {
    console.log('Admin categories data changed:', categories);
  }, [categories]);
  
  // Force refetch on mount
  useEffect(() => {
    console.log('Forcing initial admin categories fetch');
    refetch();
  }, [refetch]);
  
  const handleEditCategory = (category: AdminCategory) => {
    setEditingCategory({...category});
  };
  
  const handleSaveCategory = () => {
    if (editingCategory) {
      if (editingCategory.id) {
        // Update existing category
        updateCategory.mutate(editingCategory);
      } else {
        // Create new category
        createCategory.mutate(editingCategory);
      }
      setEditingCategory(null);
    }
  };
  
  const handleDeleteCategory = (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      deleteCategory.mutate(categoryId);
    }
  };
  
  const handleAddCategory = () => {
    const newCategory: Partial<AdminCategory> = {
      name: "New Category",
      imageUrl: "/placeholder.svg",
      puzzleCount: 0,
      activeCount: 0,
      status: "inactive"
    };
    
    setEditingCategory(newCategory as AdminCategory);
  };
  
  const handleManualRefresh = () => {
    console.log('Manual refresh of admin categories requested');
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
        <Button onClick={handleManualRefresh} variant="outline" className="flex items-center gap-2">
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
            <Button onClick={handleManualRefresh} variant="outline" size="sm" className="flex items-center gap-2">
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
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Playable Puzzles</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <CategoryImageUpload
                          imageUrl={category.imageUrl}
                          onChange={(url) =>
                            setEditingCategory({ ...category, imageUrl: url })
                          }
                          disabled={editingCategory?.id !== category.id}
                        />
                      </TableCell>
                      <TableCell>
                        {editingCategory?.id === category.id ? (
                          <Input
                            value={editingCategory.name}
                            onChange={(e) => setEditingCategory({
                              ...editingCategory,
                              name: e.target.value
                            })}
                          />
                        ) : (
                          <span>{category.name}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingCategory?.id === category.id ? (
                          <Textarea
                            value={editingCategory.description || ""}
                            onChange={(e) =>
                              setEditingCategory({
                                ...editingCategory,
                                description: e.target.value,
                              })
                            }
                          />
                        ) : (
                          <span className="max-w-xs block truncate text-muted-foreground">
                            {category.description || <span className="italic text-xs text-gray-400">No description</span>}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <PlayablePuzzleCountCell categoryId={category.id} />
                      </TableCell>
                      <TableCell className="text-right">
                        {editingCategory?.id === category.id ? (
                          <Button onClick={handleSaveCategory} size="sm">Save</Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingCategory({ ...category })}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Categories will be available for puzzle creation once activated.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

// Helper component for displaying puzzle count
function PlayablePuzzleCountCell({ categoryId }: { categoryId: string }) {
  const { data, isLoading, isError } = usePuzzleCount(categoryId);
  if (isLoading) return <span>Loading…</span>;
  if (isError) return <span>—</span>;
  return <span>{data}</span>;
}
