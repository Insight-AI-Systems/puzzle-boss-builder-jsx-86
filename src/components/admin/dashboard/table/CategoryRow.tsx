
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { AdminCategory } from '@/types/categoryTypes';
import { CategoryImageUpload } from "../CategoryImageUpload";
import { PlayablePuzzleCountCell } from "../PlayablePuzzleCountCell";

interface CategoryRowProps {
  category: AdminCategory;
  editingCategory: AdminCategory | null;
  setEditingCategory: (category: AdminCategory | null) => void;
  handleEditCategory: (category: AdminCategory) => void;
  handleDeleteCategory: (categoryId: string) => void;
  handleSaveCategory: () => void;
}

export const CategoryRow: React.FC<CategoryRowProps> = ({
  category,
  editingCategory,
  setEditingCategory,
  handleEditCategory,
  handleDeleteCategory,
  handleSaveCategory
}) => {
  const isEditing = editingCategory?.id === category.id;
  
  return (
    <TableRow>
      <TableCell>
        <CategoryImageUpload
          imageUrl={category.imageUrl}
          onChange={(url) => {
            if (isEditing) {
              setEditingCategory({ ...editingCategory, imageUrl: url });
            }
          }}
          disabled={!isEditing}
        />
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            value={editingCategory.name}
            onChange={(e) => setEditingCategory({
              ...editingCategory,
              name: e.target.value
            })}
          />
        ) : (
          <span className="text-foreground">{category.name}</span>
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
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
          <span className="max-w-xs block truncate text-foreground">
            {category.description || <span className="italic text-xs text-gray-400">No description</span>}
          </span>
        )}
      </TableCell>
      <TableCell>
        <PlayablePuzzleCountCell categoryId={category.id} />
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Switch
            checked={editingCategory.status === "active"}
            onCheckedChange={(checked) =>
              setEditingCategory({
                ...editingCategory,
                status: checked ? "active" : "inactive",
              })
            }
            id={`active-switch-${category.id}`}
          />
        ) : (
          <Switch
            checked={category.status === "active"}
            disabled
            id={`active-switch-view-${category.id}`}
          />
        )}
      </TableCell>
      <TableCell className="text-right">
        {isEditing ? (
          <Button onClick={handleSaveCategory} size="sm">Save</Button>
        ) : (
          <div className="flex justify-end space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEditCategory(category)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteCategory(category.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};
