
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { AdminCategory } from '@/types/categoryTypes';

interface AddCategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingCategory: AdminCategory | null;
  setEditingCategory: (category: AdminCategory | null) => void;
  handleSaveCategory: () => void;
}

export const AddCategoryDialog: React.FC<AddCategoryDialogProps> = ({
  isOpen,
  onOpenChange,
  editingCategory,
  setEditingCategory,
  handleSaveCategory,
}) => {
  if (!editingCategory || editingCategory.id) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>
            Create a new puzzle category. Categories help organize puzzles for easier discovery.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="categoryName">Category Name</Label>
            <Input
              id="categoryName"
              value={editingCategory.name}
              onChange={(e) => setEditingCategory({
                ...editingCategory,
                name: e.target.value
              })}
              placeholder="Enter category name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="categoryDescription">Description</Label>
            <Textarea
              id="categoryDescription"
              value={editingCategory.description || ""}
              onChange={(e) => setEditingCategory({
                ...editingCategory,
                description: e.target.value
              })}
              placeholder="Describe this category"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="categoryStatus">Status</Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="categoryStatus"
                checked={editingCategory.status === "active"}
                onCheckedChange={(checked) => setEditingCategory({
                  ...editingCategory,
                  status: checked ? "active" : "inactive"
                })}
              />
              <Label htmlFor="categoryStatus" className="cursor-pointer">
                {editingCategory.status === "active" ? "Active" : "Inactive"}
              </Label>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSaveCategory}>Create Category</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
