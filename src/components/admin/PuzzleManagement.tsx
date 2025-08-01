
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Puzzle, BarChart3 } from "lucide-react";
import { PuzzleSearchBar } from './puzzle-management/PuzzleSearchBar';
import { PuzzleTabs } from './puzzle-management/PuzzleTabs';
import { EnhancedImageUpload } from './puzzle-management/EnhancedImageUpload';
import { GameSessionMonitor } from './puzzle-management/GameSessionMonitor';
import { PuzzleGameConfiguration } from './puzzle-management/PuzzleGameConfiguration';
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
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="active">Puzzles</TabsTrigger>
              <TabsTrigger value="upload">Image Upload</TabsTrigger>
              <TabsTrigger value="sessions">Live Sessions</TabsTrigger>
              <TabsTrigger value="configuration">Game Config</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="active">
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
            </TabsContent>

            <TabsContent value="upload">
              <EnhancedImageUpload
                onImageReady={(imageData) => {
                  console.log('New image ready for puzzle:', imageData);
                  // Auto-create puzzle with uploaded image
                  handleNewPuzzleChange('imageUrl', imageData.url);
                  handleNewPuzzleChange('name', `Puzzle: ${imageData.filename.replace(/\.[^/.]+$/, '')}`);
                  setNewPuzzleDialogOpen(true);
                }}
                onUploadComplete={(images) => {
                  console.log('Batch upload complete:', images.length, 'images');
                }}
              />
            </TabsContent>

            <TabsContent value="sessions">
              <GameSessionMonitor />
            </TabsContent>

            <TabsContent value="configuration">
              <PuzzleGameConfiguration />
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Puzzle Analytics
                  </CardTitle>
                  <CardDescription>Coming soon - detailed puzzle performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Analytics dashboard in development</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};
