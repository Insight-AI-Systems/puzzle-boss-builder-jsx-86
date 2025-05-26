
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

interface Category {
  id: string;
  name: string;
  status: string;
}

interface CategoryTableProps {
  categories: Category[];
  editingCategory: Category | null;
  setEditingCategory: (category: Category | null) => void;
  handleEditCategory: (category: Category) => void;
  handleDeleteCategory: (id: string, name: string) => void;
  handleSaveCategory: (category: Category) => void;
  isDeleteConfirmOpen: boolean;
  confirmDeleteCategory: () => void;
  cancelDeleteCategory: () => void;
  categoryToDelete: Category | null;
  handleDeletePuzzle: (puzzleId: string) => Promise<void>;
}

export const CategoryTable: React.FC<CategoryTableProps> = ({ 
  categories,
  handleEditCategory,
  handleDeleteCategory
}) => {
  const { toast } = useToast();

  if (!categories || categories.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No categories found. Create your first category to get started!
      </div>
    );
  }

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
                  onClick={() => handleEditCategory(category)}
                >
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteCategory(category.id, category.name)}
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
