
import React from 'react';
import { Table, TableBody } from "@/components/ui/table";
import { AdminCategory } from '@/types/categoryTypes';
import { CategoryRow } from './table/CategoryRow';
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
}) => {
  // Find the category being deleted (for showing puzzle count in warning)
  const categoryBeingDeleted = categoryToDelete 
    ? categories.find(cat => cat.id === categoryToDelete) 
    : null;

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
