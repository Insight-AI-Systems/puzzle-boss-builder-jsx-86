
import React from 'react';
import { Table, TableBody } from "@/components/ui/table";
import { AdminCategory } from '@/types/categoryTypes';
import { usePuzzlesByCategoryId } from '@/hooks/admin/usePuzzlesByCategory';
import { CategoryRow } from './table/CategoryRow';
import { AssignedPuzzlesRow } from './table/AssignedPuzzlesRow';
import { DeleteConfirmDialog } from './table/DeleteConfirmDialog';
import { CategoryTableHeader } from './table/CategoryTableHeader';

interface CategoryTableProps {
  categories: AdminCategory[];
  editingCategory: AdminCategory | null;
  setEditingCategory: (category: AdminCategory | null) => void;
  handleEditCategory: (category: AdminCategory) => void;
  handleDeleteCategory: (categoryId: string) => void;
  handleSaveCategory: () => void;
  isDeleteConfirmOpen: boolean;
  confirmDeleteCategory: () => void;
  cancelDeleteCategory: () => void;
  categoryToDelete: string | null;
  handleDeletePuzzle?: (puzzleId: string) => void;
}

export const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  editingCategory,
  setEditingCategory,
  handleEditCategory,
  handleDeleteCategory,
  handleSaveCategory,
  isDeleteConfirmOpen,
  confirmDeleteCategory,
  cancelDeleteCategory,
  categoryToDelete,
  handleDeletePuzzle
}) => {
  // Find the category being deleted (for showing puzzle count in warning)
  const categoryBeingDeleted = categoryToDelete 
    ? categories.find(cat => cat.id === categoryToDelete) 
    : null;
    
  // Use custom hook to fetch puzzles for the editing category
  const { puzzles, isLoading } = usePuzzlesByCategoryId(
    editingCategory?.id || null
  );

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <CategoryTableHeader />
          <TableBody>
            {categories.map((category) => (
              <React.Fragment key={category.id}>
                <CategoryRow
                  category={category}
                  editingCategory={editingCategory}
                  setEditingCategory={setEditingCategory}
                  handleEditCategory={handleEditCategory}
                  handleDeleteCategory={handleDeleteCategory}
                  handleSaveCategory={handleSaveCategory}
                />
                <AssignedPuzzlesRow
                  categoryId={category.id}
                  isEditing={editingCategory?.id === category.id}
                  puzzles={puzzles}
                  isLoading={isLoading}
                  handleDeletePuzzle={handleDeletePuzzle}
                />
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>

      <DeleteConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onCancel={cancelDeleteCategory}
        onConfirm={confirmDeleteCategory}
        categoryBeingDeleted={categoryBeingDeleted}
      />
    </>
  );
};
