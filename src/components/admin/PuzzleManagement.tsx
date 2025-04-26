
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Puzzle as PuzzleIcon } from "lucide-react";
import { PuzzleSearchBar } from './puzzle-management/PuzzleSearchBar';
import { PuzzleTabs } from './puzzle-management/PuzzleTabs';
import { useCategories } from "@/hooks/useCategories";
import { usePuzzles } from "@/hooks/usePuzzles";
import PuzzleEditPanel from "./PuzzleEditPanel"; 
import { useUserProfile } from "@/hooks/useUserProfile";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Puzzle } from "@/hooks/puzzles/puzzleTypes"; 

const DEFAULT_NEW_PUZZLE: Partial<Puzzle> = {
  name: "New Puzzle",
  category: "",
  category_id: "",
  difficulty: "medium",
  imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=400&fit=crop",
  timeLimit: 300,
  costPerPlay: 1.99,
  targetRevenue: 199.99,
  status: "draft",
  prize: "New Prize",
  completions: 0,
  avgTime: 0,
  prizeValue: 99.99,
  description: "",
  supplier: "",
  puzzleOwner: ""
};

export const PuzzleManagement = () => {
  const { puzzles, isLoading, isError, createPuzzle, updatePuzzle, deletePuzzle, checkPuzzleTableExists } = usePuzzles();
  const { data: categories = [] } = useCategories();
  const { profile } = useUserProfile();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPuzzle, setEditPuzzle] = useState<any>(null);
  const [tableExists, setTableExists] = useState<boolean | null>(null);
  const [newPuzzleDialogOpen, setNewPuzzleDialogOpen] = useState(false);
  const [newPuzzle, setNewPuzzle] = useState<Partial<Puzzle>>(DEFAULT_NEW_PUZZLE);

  useEffect(() => {
    const checkTable = async () => {
      const exists = await checkPuzzleTableExists();
      setTableExists(exists);
    };
    checkTable();
  }, [checkPuzzleTableExists]);

  useEffect(() => {
    console.log("Current puzzles:", puzzles);
  }, [puzzles]);

  useEffect(() => {
    if (newPuzzleDialogOpen) {
      const initialPuzzle: Partial<Puzzle> = {
        ...DEFAULT_NEW_PUZZLE,
        puzzleOwner: profile?.display_name || profile?.email || ""
      };
      setNewPuzzle(initialPuzzle);
    }
  }, [newPuzzleDialogOpen, profile]);
  
  // Handler functions
  const handleNewPuzzleChange = (field: string, value: any) => {
    console.log("Changing new puzzle field:", field, "to value:", value);
    setNewPuzzle(prev => ({ ...prev, [field]: value }));
  };

  const saveNewPuzzle = () => {
    if (newPuzzle) {
      console.log("Saving new puzzle:", newPuzzle);
      createPuzzle(newPuzzle);
      setNewPuzzleDialogOpen(false);
      toast({
        title: "Puzzle Created",
        description: "New puzzle has been created successfully"
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        if (editingId) {
          setEditPuzzle(prev => ({ ...prev, imageUrl }));
        } else {
          setNewPuzzle(prev => ({ ...prev, imageUrl }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditChange = (field: string, value: any) => {
    console.log("Editing puzzle field:", field, "to value:", value);
    setEditPuzzle(prev => ({ ...prev, [field]: value }));
  };

  const startEdit = (puzzle: Puzzle) => {
    setEditingId(puzzle.id);
    setEditPuzzle({ ...puzzle });
  };

  const saveEdit = () => {
    if (editPuzzle) {
      console.log("Saving edited puzzle:", editPuzzle);
      updatePuzzle(editPuzzle);
      setEditingId(null);
      setEditPuzzle(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditPuzzle(null);
  };

  const handleToggleStatus = (puzzle: Puzzle) => {
    const updatedStatus = puzzle.status === 'active' ? 'draft' : 'active';
    updatePuzzle({ ...puzzle, status: updatedStatus });
  };

  const filteredPuzzles = puzzles.filter(puzzle => 
    puzzle.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    puzzle.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    puzzle.prize?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Puzzle className="h-5 w-5 mr-2" />
            Puzzle Management
          </CardTitle>
          <CardDescription>Loading puzzles...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-puzzle-aqua"></div>
        </CardContent>
      </Card>
    );
  }

  if (isError || tableExists === false) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Puzzle className="h-5 w-5 mr-2" />
            Puzzle Management
          </CardTitle>
          <CardDescription>Set up required before managing puzzles</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Database Configuration Required</AlertTitle>
            <AlertDescription>
              The puzzles table does not exist in the database yet. Please check that the database is properly configured.
            </AlertDescription>
          </Alert>
          <p className="text-muted-foreground mb-4">
            Contact your system administrator to set up the necessary database tables for puzzle management.
          </p>
        </CardContent>
      </Card>
    );
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
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center p-4 mb-4 rounded-full bg-puzzle-aqua/10">
              <Puzzle className="h-8 w-8 text-puzzle-aqua" />
            </div>
            <h3 className="text-lg font-medium mb-2">No puzzles found</h3>
            <p className="text-muted-foreground mb-6">
              Get started by creating your first puzzle
            </p>
            <Button onClick={() => setNewPuzzleDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Puzzle
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="active" className="w-full">
            <PuzzleTabs
              puzzles={filteredPuzzles}
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
