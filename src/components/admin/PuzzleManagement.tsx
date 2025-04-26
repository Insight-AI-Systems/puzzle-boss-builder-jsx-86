
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Puzzle } from "lucide-react";
import { PuzzleSearchBar } from './puzzle-management/PuzzleSearchBar';
import { PuzzleTabs } from './puzzle-management/PuzzleTabs';
import { useCategories } from "@/hooks/useCategories";
import { usePuzzleManagement } from "@/hooks/admin/usePuzzleManagement";
import { useUserProfile } from "@/hooks/useUserProfile";
import PuzzleEditPanel from "./PuzzleEditPanel";
import { PuzzleLoadingState } from './puzzle-management/PuzzleLoadingState';
import { PuzzleErrorState } from './puzzle-management/PuzzleErrorState';
import { PuzzleEmptyState } from './puzzle-management/PuzzleEmptyState';

export const PuzzleManagement = () => {
  const { data: categories = [] } = useCategories();
  const { profile } = useUserProfile();
  const {
    puzzles,
    isLoading,
    isError,
    tableExists,
    searchTerm,
    setSearchTerm,
    editingId,
    editPuzzle,
    newPuzzleDialogOpen,
    setNewPuzzleDialogOpen,
    newPuzzle,
    handleNewPuzzleChange,
    saveNewPuzzle,
    handleEditChange,
    startEdit,
    saveEdit,
    cancelEdit,
    handleToggleStatus,
    handleImageUpload,
    deletePuzzle,
  } = usePuzzleManagement();

  if (isLoading) {
    return <PuzzleLoadingState />;
  }

  if (isError || tableExists === false) {
    return <PuzzleErrorState />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Puzzle className="h-5 w-5 mr-2" />
          Puzzle Management
        </CardTitle>
        <CardDescription>Create and manage puzzles for your platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <PuzzleSearchBar 
            searchTerm={searchTerm} 
            onSearch={setSearchTerm} 
          />
          <Dialog open={newPuzzleDialogOpen} onOpenChange={setNewPuzzleDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Puzzle
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl">
              <DialogHeader>
                <DialogTitle>Create New Puzzle</DialogTitle>
                <DialogDescription>
                  Fill in the details for your new puzzle
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <PuzzleEditPanel
                  puzzle={newPuzzle}
                  categories={categories}
                  onChange={handleNewPuzzleChange}
                  onSave={saveNewPuzzle}
                  onCancel={() => setNewPuzzleDialogOpen(false)}
                  onImageUpload={handleImageUpload}
                  currentUser={profile?.display_name || profile?.email || ""}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {puzzles.length === 0 ? (
          <PuzzleEmptyState onCreatePuzzle={() => setNewPuzzleDialogOpen(true)} />
        ) : (
          <Tabs defaultValue="active" className="w-full">
            <PuzzleTabs
              puzzles={puzzles}
              categories={categories}
              editingId={editingId}
              editPuzzle={editPuzzle}
              handleEditChange={handleEditChange}
              saveEdit={saveEdit}
              cancelEdit={cancelEdit}
              startEdit={startEdit}
              handleImageUpload={handleImageUpload}
              handleToggleStatus={handleToggleStatus}
              deletePuzzle={deletePuzzle}
            />
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};
