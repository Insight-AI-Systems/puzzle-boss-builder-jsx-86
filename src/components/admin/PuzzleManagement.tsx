import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  Loader2,
  AlertCircle
} from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { usePuzzles, Puzzle as PuzzleType } from "@/hooks/usePuzzles";
import { checkAndSetupPuzzleTable } from "@/utils/admin/setupPuzzleTable";
import PuzzleEditPanel from "./PuzzleEditPanel";
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

export const PuzzleManagement: React.FC = () => {
  const { puzzles, isLoading, error, createPuzzle, updatePuzzle, deletePuzzle, profile } = usePuzzles();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPuzzle, setEditPuzzle] = useState<any>(null);
  const [tableStatus, setTableStatus] = useState<{exists: boolean, error?: string}>({exists: true});
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { toast } = useToast();

  useEffect(() => {
    const checkTable = async () => {
      const status = await checkAndSetupPuzzleTable();
      setTableStatus(status);
      if (!status.exists) {
        toast({
          title: "Database table missing",
          description: status.error,
          variant: "destructive",
        });
      }
    };
    
    checkTable();
  }, [toast]);

  useEffect(() => {
    console.log('Puzzles data:', puzzles);
    console.log('Categories data:', categories);
    console.log('Loading state:', isLoading);
    console.log('Error state:', error);
  }, [puzzles, categories, isLoading, error]);

  const filteredPuzzles = puzzles.filter(puzzle => 
    puzzle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const startEdit = (puzzle: PuzzleType) => {
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
    if (!editPuzzle) return;
    
    try {
      updatePuzzle.mutate(editPuzzle as PuzzleType);
      setEditingId(null);
      setEditPuzzle(null);
    } catch (error) {
      console.error("Error updating puzzle:", error);
      toast({
        title: "Error",
        description: "Failed to save puzzle changes.",
        variant: "destructive",
      });
    }
  };

  const handleNewPuzzle = () => {
    const newPuzzle = {
      name: "New Puzzle",
      category: "",
      category_id: "", 
      difficulty: "medium" as const,
      imageUrl: "/placeholder.svg",
      timeLimit: 0,
      costPerPlay: 1,
      targetRevenue: 0,
      status: "draft",
      prize: "TBD",
      prizeValue: 0,
      description: "",
      puzzleOwner: profile?.display_name || profile?.email || "Admin User",
      supplier: "",
    };
    
    setEditingId("new");
    setEditPuzzle(newPuzzle);
  };

  const handleDeletePuzzle = (id: string) => {
    if (confirm("Are you sure you want to delete this puzzle?")) {
      deletePuzzle.mutate(id);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const url = URL.createObjectURL(e.target.files[0]);
    setEditPuzzle((prev: any) => ({ ...prev, imageUrl: url }));
  };

  if (!tableStatus.exists) {
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
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {tableStatus.error}
              <div className="mt-2">
                <p className="text-xs">Please run the SQL migration to create the puzzles table in your Supabase database.</p>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (isLoading || categoriesLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-puzzle-aqua" />
        <span className="ml-3 text-lg">Loading puzzles...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-red-500 mb-2">Failed to load puzzles</p>
        <p className="text-sm text-muted-foreground">{(error as Error).message}</p>
      </div>
    );
  }

  if (puzzles.length === 0) {
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
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No puzzles found. Create your first puzzle to get started!</p>
            <Button onClick={handleNewPuzzle}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Puzzle
            </Button>
          </div>
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
          <Button onClick={handleNewPuzzle}>
            <Plus className="h-4 w-4 mr-2" />
            New Puzzle
          </Button>
        </div>
        
        {editingId === "new" && (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Create New Puzzle</h3>
            <PuzzleEditPanel
              puzzle={editPuzzle}
              categories={categories}
              onChange={handleEditChange}
              onSave={() => {
                if (editPuzzle) {
                  createPuzzle.mutate(editPuzzle);
                  setEditingId(null);
                  setEditPuzzle(null);
                }
              }}
              onCancel={cancelEdit}
              onImageUpload={handleImageUpload}
              currentUser={profile}
            />
          </div>
        )}
        
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="active" className="flex items-center">
              <Badge className="h-5 w-5 mr-2 flex items-center justify-center rounded-full text-xs p-0">
                {filteredPuzzles.filter(p => p.status === "active").length}
              </Badge>
              Active
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="flex items-center">
              <Badge className="h-5 w-5 mr-2 flex items-center justify-center rounded-full text-xs p-0">
                {filteredPuzzles.filter(p => p.status === "scheduled").length}
              </Badge>
              Scheduled
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center">
              <Badge className="h-5 w-5 mr-2 flex items-center justify-center rounded-full text-xs p-0">
                {filteredPuzzles.filter(p => p.status === "completed").length}
              </Badge>
              Completed
            </TabsTrigger>
            <TabsTrigger value="drafts" className="flex items-center">
              <Badge className="h-5 w-5 mr-2 flex items-center justify-center rounded-full text-xs p-0">
                {filteredPuzzles.filter(p => p.status === "draft").length}
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
                                currentUser={profile}
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
                                {puzzle.prize}
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
                                <Button variant="ghost" size="icon" onClick={() => handleDeletePuzzle(puzzle.id)}>
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                                {puzzle.status === "draft" && (
                                  <Button variant="ghost" size="icon">
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
      </CardContent>
    </Card>
  );
};
