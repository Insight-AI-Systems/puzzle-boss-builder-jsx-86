
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { AdminCategory } from '@/hooks/admin/useCategoryManagement';
import { CategoryImageUpload } from "./CategoryImageUpload";
import { PlayablePuzzleCountCell } from "./PlayablePuzzleCountCell";

interface CategoryTableProps {
  categories: AdminCategory[];
  editingCategory: AdminCategory | null;
  setEditingCategory: (category: AdminCategory | null) => void;
  handleEditCategory: (category: AdminCategory) => void;
  handleDeleteCategory: (categoryId: string) => void;
  handleSaveCategory: () => void;
}

export const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  editingCategory,
  setEditingCategory,
  handleEditCategory,
  handleDeleteCategory,
  handleSaveCategory,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Playable Puzzles</TableHead>
            <TableHead>Active</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                <CategoryImageUpload
                  imageUrl={category.imageUrl}
                  onChange={(url) => {
                    if (editingCategory?.id === category.id) {
                      setEditingCategory({ ...editingCategory, imageUrl: url });
                    }
                  }}
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
              <TableCell>
                {editingCategory?.id === category.id ? (
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
                {editingCategory?.id === category.id ? (
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
