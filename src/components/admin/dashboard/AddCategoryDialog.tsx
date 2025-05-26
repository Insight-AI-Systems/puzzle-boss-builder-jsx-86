
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AdminCategory } from '@/types/categoryTypes';

interface AddCategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingCategory: AdminCategory | null;
  setEditingCategory: (category: AdminCategory | null) => void;
  handleSaveCategory: (category: AdminCategory) => void;
}

export function AddCategoryDialog({
  isOpen,
  onOpenChange,
  editingCategory,
  setEditingCategory,
  handleSaveCategory
}: AddCategoryDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingCategory ? 'Edit Category' : 'Add Category'}
          </DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p>Category dialog content would go here</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
