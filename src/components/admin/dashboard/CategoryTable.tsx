
import React from 'react';
import { useCategories, useDeleteCategory, Category } from '@/hooks/api/useCategoryApi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface CategoryTableProps {
  onEdit: (category: Category) => void;
}

export const CategoryTable: React.FC<CategoryTableProps> = ({ onEdit }) => {
  const { data: categories, isLoading, error } = useCategories();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading categories...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Error loading categories: {error.message}
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No categories found. Create your first category to get started!
      </div>
    );
  }

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the "${name}" category?`)) {
      deleteCategory(id, {
        onSuccess: () => {
          toast.success('Category deleted', `'${name}' has been deleted successfully.`);
          queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
        onError: (error) => {
          toast.error('Failed to delete category', error.message);
        }
      });
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell className="font-medium">{category.name}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded text-xs ${
                category.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {category.status}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(category)}
                >
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(category.id, category.name)}
                  disabled={isDeleting}
                >
                  <Trash className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
