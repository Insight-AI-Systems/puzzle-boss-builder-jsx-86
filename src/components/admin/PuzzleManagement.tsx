import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Puzzle, 
  Clock, 
  Award, 
  Shuffle, 
  Edit, 
  Trash2, 
  Image, 
  ToggleLeft, 
  ToggleRight,
  AlertCircle
} from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { usePuzzles, Puzzle as PuzzleType } from "@/hooks/usePuzzles";
import PuzzleEditPanel from "./PuzzleEditPanel";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const PuzzlePreview = ({ imageUrl, difficulty }: { imageUrl: string, difficulty: string }) => {
  const grid = { easy: 3, medium: 4, hard: 5 }[difficulty] || 4;
  const boxSize = 64;
  return (
    <div
      className="relative bg-gradient-to-br from-puzzle-aqua/20 to-puzzle-black/70 rounded-md border border-puzzle-aqua/40 flex items-center justify-center overflow-hidden"
      style={{ width: boxSize * grid, height: boxSize * grid }}
    >
      <img
        src={imageUrl}
        alt="Puzzle"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
        style={{ pointerEvents: 'none' }}
      />
      <div
        className="absolute inset-0 grid"
        style={{
          gridTemplateRows: `repeat(${grid}, 1fr)`,
          gridTemplateColumns: `repeat(${grid}, 1fr)`,
          zIndex: 1,
        }}>
        {[...Array(grid * grid)].map((_, i) => (
          <div
            key={i}
            className="border border-puzzle-aqua/30"
            style={{
              width: boxSize,
              height: boxSize,
              boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.07)',
            }}
          ></div>
        ))}
      </div>
      <span className="absolute left-1 top-1 text-xs rounded px-2 py-0.5 bg-black/60 text-puzzle-aqua z-10">Ghost Image</span>
    </div>
  );
};

const DEFAULT_NEW_PUZZLE: Partial<PuzzleType> = {
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

export const PuzzleManagement: React.FC = () => {
  const { puzzles, isLoading, isError, createPuzzle, updatePuzzle, deletePuzzle, checkPuzzleTableExists } = usePuzzles();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPuzzle, setEditPuzzle] = useState<any>(null);
  const [tableExists, setTableExists] = useState<boolean | null>(null);
  const [newPuzzleDialogOpen, setNewPuzzleDialogOpen] = useState(false);
  const [newPuzzle, setNewPuzzle] = useState<Partial<PuzzleType>>({...DEFAULT_NEW_PUZZLE});
  const { data: categories = [] } = useCategories();
  const { profile } = useUserProfile();
  const { toast } = useToast();

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
      setNewPuzzle({
        ...DEFAULT_NEW_PUZZLE,
        puzzleOwner: profile?.display_name || profile?.email || "",
      });
    }
  }, [newPuzzleDialogOpen, profile]);

  const filteredPuzzles = puzzles.filter(puzzle => 
    puzzle.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    puzzle.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    puzzle.prize?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activePuzzles = filteredPuzzles.filter(p => p.status === "active");
  const scheduledPuzzles = filteredPuzzles.filter(p => p.status === "scheduled");
  const completedPuzzles = filteredPuzzles.filter(p => p.status === "completed");
  const draftPuzzles = filteredPuzzles.filter(p => p.status === "draft");

  const formatTime = (seconds: number) => {
    if (seconds === 0) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startEdit = (puzzle: any) => {
    console.log("Starting edit for puzzle:", puzzle);
    setEditingId(puzzle.id);
    setEditPuzzle({ ...puzzle });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditPuzzle(null);
  };

  const handleEditChange = (field: string, value: any) => {
    setEditPuzzle((prev: any) => ({ ...prev, [field]: value }));
  };

  const saveEdit = () => {
    if (editPuzzle) {
      console.log("Saving puzzle:", editPuzzle);
      updatePuzzle(editPuzzle);
      setEditingId(null);
      setEditPuzzle(null);
    }
  };
  
  const handleNewPuzzleChange = (field: string, value: any) => {
    setNewPuzzle((prev) => ({ ...prev, [field]: value }));
  };
  
  const saveNewPuzzle = () => {
    console.log("Creating new puzzle:", newPuzzle);
    createPuzzle(newPuzzle);
    setNewPuzzleDialogOpen(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const url = URL.createObjectURL(e.target.files[0]);
    
    if (editingId) {
      setEditPuzzle((prev: any) => ({ ...prev, imageUrl: url }));
    } else {
      setNewPuzzle((prev) => ({ ...prev, imageUrl: url }));
    }
  };

  const handleToggleStatus = (puzzle: PuzzleType) => {
    const newStatus: 'active' | 'inactive' = puzzle.status === 'active' ? 'inactive' : 'active';
    
    const updatedPuzzle: Partial<PuzzleType> = { 
      ...puzzle, 
      status: newStatus 
    };
    
    updatePuzzle(updatedPuzzle);
    
    toast({
      title: `Puzzle ${newStatus}`,
      description: `${puzzle.name} is now ${newStatus}.`
    });
  };

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
          <div className="relative w-full max-w-sm">
            <Input
              placeholder="Search puzzles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
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
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="active" className="flex items-center">
                <Badge className="h-5 w-5 mr-2 flex items-center justify-center rounded-full text-xs p-0">
                  {activePuzzles.length}
                </Badge>
                Active
              </TabsTrigger>
              <TabsTrigger value="scheduled" className="flex items-center">
                <Badge className="h-5 w-5 mr-2 flex items-center justify-center rounded-full text-xs p-0">
                  {scheduledPuzzles.length}
                </Badge>
                Scheduled
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center">
                <Badge className="h-5 w-5 mr-2 flex items-center justify-center rounded-full text-xs p-0">
                  {completedPuzzles.length}
                </Badge>
                Completed
              </TabsTrigger>
              <TabsTrigger value="drafts" className="flex items-center">
                <Badge className="h-5 w-5 mr-2 flex items-center justify-center rounded-full text-xs p-0">
                  {draftPuzzles.length}
                </Badge>
                Drafts
              </TabsTrigger>
            </TabsList>
            
            {["active", "scheduled", "completed", "drafts"].map(tabValue => (
              <TabsContent key={tabValue} value={tabValue} className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Difficulty</TableHead>
                        <TableHead>Time Limit</TableHead>
                        <TableHead>Prize</TableHead>
                        {tabValue !== "drafts" && tabValue !== "scheduled" && (
                          <>
                            <TableHead>Completions</TableHead>
                            <TableHead>Avg Time</TableHead>
                          </>
                        )}
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPuzzles
                        .filter(puzzle => {
                          if (tabValue === "active") return puzzle.status === "active";
                          if (tabValue === "scheduled") return puzzle.status === "scheduled";
                          if (tabValue === "completed") return puzzle.status === "completed";
                          if (tabValue === "drafts") return puzzle.status === "draft";
                          return false;
                        })
                        .map(puzzle =>
                          editingId === puzzle.id ? (
                            <TableRow key={puzzle.id}>
                              <TableCell colSpan={tabValue !== "drafts" && tabValue !== "scheduled" ? 9 : 7} className="bg-muted pt-8 pb-8 px-2">
                                <PuzzleEditPanel
                                  puzzle={editPuzzle}
                                  categories={categories}
                                  onChange={handleEditChange}
                                  onSave={saveEdit}
                                  onCancel={cancelEdit}
                                  onImageUpload={handleImageUpload}
                                  currentUser={profile?.display_name || profile?.email || ""}
                                />
                              </TableCell>
                            </TableRow>
                          ) : (
                            <TableRow key={puzzle.id}>
                              <TableCell className="font-medium align-top">
                                <span className="flex items-center gap-2">
                                  {puzzle.imageUrl && (
                                    <img src={puzzle.imageUrl} alt="Puzzle" className="w-10 h-10 rounded object-cover border border-puzzle-aqua/20" />
                                  )}
                                  {puzzle.name}
                                </span>
                              </TableCell>
                              <TableCell className="align-top">
                                {puzzle.category}
                              </TableCell>
                              <TableCell>
                                <Badge variant={
                                  puzzle.difficulty === "easy" ? "outline" :
                                  puzzle.difficulty === "medium" ? "secondary" : "destructive"
                                }>
                                  {puzzle.difficulty.charAt(0).toUpperCase() + puzzle.difficulty.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell className="flex flex-col gap-1 align-top">
                                <Clock className="h-3 w-3 mr-1 inline" />
                                {formatTime(puzzle.timeLimit)}
                              </TableCell>
                              <TableCell className="flex flex-col gap-1 align-top">
                                <span className="flex items-center">
                                  <Award className="h-3 w-3 mr-1 text-puzzle-aqua" />
                                  {puzzle.prize || puzzle.name}
                                </span>
                              </TableCell>
                              {tabValue !== "drafts" && tabValue !== "scheduled" && (
                                <>
                                  <TableCell>
                                    {puzzle.completions}
                                  </TableCell>
                                  <TableCell>
                                    {formatTime(puzzle.avgTime || 0)}
                                  </TableCell>
                                </>
                              )}
                              <TableCell className="text-right align-top">
                                <div className="flex justify-end gap-1">
                                  <Button variant="ghost" size="icon" onClick={() => startEdit(puzzle)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => {
                                      if (window.confirm('Are you sure you want to delete this puzzle?')) {
                                        deletePuzzle(puzzle.id);
                                      }
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                  {puzzle.status === "draft" && (
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      onClick={() => handleToggleStatus(puzzle)}
                                    >
                                      <Shuffle className="h-4 w-4 text-green-500" />
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};
