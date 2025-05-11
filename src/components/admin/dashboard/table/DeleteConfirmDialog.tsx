
import React from 'react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { AlertCircle } from "lucide-react";
import { AdminCategory } from '@/types/categoryTypes';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  categoryBeingDeleted: AdminCategory | null;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  isOpen,
  onCancel,
  onConfirm,
  categoryBeingDeleted
}) => {
  return (
    <AlertDialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Delete Category?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the category. This action cannot be undone.
            
            {categoryBeingDeleted && (
              <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
                <p className="font-medium">Important:</p>
                <p>Before deleting this category, ensure that no puzzles are using it (including inactive or draft puzzles). If any puzzles are assigned to this category, 
                you must first reassign or delete those puzzles.</p>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
