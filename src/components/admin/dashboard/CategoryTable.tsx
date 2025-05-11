
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, AlertCircle } from "lucide-react";
import { AdminCategory } from '@/types/categoryTypes';
import { CategoryImageUpload } from "./CategoryImageUpload";
import { PlayablePuzzleCountCell } from "./PlayablePuzzleCountCell";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { usePuzzlesByCategoryId } from '@/hooks/admin/usePuzzlesByCategory';

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
    
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
  
  // Use custom hook to fetch puzzles for the editing category
  const { puzzles, isLoading } = usePuzzlesByCategoryId(
    editingCategory?.id || expandedCategoryId || null
  );

  return (
    <>
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
              <React.Fragment key={category.id}>
                <TableRow>
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
                          onClick={() => {
                            handleEditCategory(category);
                            setExpandedCategoryId(category.id);
                          }}
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
                
                {/* Show puzzles when category is being edited */}
                {editingCategory?.id === category.id && (
                  <TableRow>
                    <TableCell colSpan={6} className="bg-gray-50 p-3">
                      <div className="mt-2 mb-3">
                        <h4 className="text-sm font-semibold mb-2">Assigned Puzzles</h4>
                        {isLoading ? (
                          <p className="text-sm text-muted-foreground">Loading puzzles...</p>
                        ) : puzzles.length > 0 ? (
                          <div className="border rounded-md">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Title</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {puzzles.map((puzzle) => (
                                  <TableRow key={puzzle.id}>
                                    <TableCell>{puzzle.title}</TableCell>
                                    <TableCell>
                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                        ${puzzle.status === 'active' ? 'bg-green-100 text-green-800' : 
                                          puzzle.status === 'draft' ? 'bg-gray-100 text-gray-800' : 
                                          'bg-amber-100 text-amber-800'}`
                                      }>
                                        {puzzle.status}
                                      </span>
                                    </TableCell>
                                    <TableCell>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeletePuzzle && handleDeletePuzzle(puzzle.id)}
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <Trash2 className="h-3 w-3 mr-1" /> Remove
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No puzzles assigned to this category</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          Note: All puzzles must be removed before the category can be deleted.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog 
        open={isDeleteConfirmOpen} 
        onOpenChange={(open) => {
          if (!open) cancelDeleteCategory();
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
            <AlertDialogCancel onClick={cancelDeleteCategory}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteCategory} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
