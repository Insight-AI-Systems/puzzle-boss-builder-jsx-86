import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  ToggleRight 
} from "lucide-react";
import { useCategories } from "@/hooks/useCategories";

const samplePuzzles = [
  {
    id: "p1",
    name: "iPhone 14 Pro",
    category: "Smartphones",
    category_id: "",
    difficulty: "medium",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=400&fit=crop",
    timeLimit: 300, // seconds
    costPerPlay: 1.99,
    targetRevenue: 2000,
    status: "active",
    prize: "iPhone 14 Pro",
    completions: 122,
    avgTime: 189, // seconds
  },
  {
    id: "p2",
    name: "MacBook Air M2",
    category: "Laptops",
    category_id: "",
    difficulty: "hard",
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop",
    timeLimit: 420, // seconds
    costPerPlay: 3.99,
    targetRevenue: 3200,
    status: "scheduled",
    prize: "MacBook Air M2",
    completions: 0,
    avgTime: 0, // seconds
  },
  {
    id: "p3",
    name: "AirPods Pro",
    category: "Headphones",
    category_id: "",
    difficulty: "easy",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=400&fit=crop",
    timeLimit: 180, // seconds
    costPerPlay: 0.99,
    targetRevenue: 900,
    status: "active",
    prize: "AirPods Pro",
    completions: 348,
    avgTime: 142, // seconds
  },
  {
    id: "p4",
    name: "PlayStation 5",
    category: "Gaming Consoles",
    category_id: "",
    difficulty: "medium",
    imageUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=400&fit=crop",
    timeLimit: 360, // seconds
    costPerPlay: 2.99,
    targetRevenue: 3000,
    status: "completed",
    prize: "PlayStation 5",
    completions: 521,
    avgTime: 202, // seconds
  },
  {
    id: "p5",
    name: "Samsung Galaxy S23",
    category: "Smartphones",
    category_id: "",
    difficulty: "medium",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop",
    timeLimit: 300, // seconds
    costPerPlay: 1.99,
    targetRevenue: 2100,
    status: "draft",
    prize: "Samsung Galaxy S23",
    completions: 0,
    avgTime: 0, // seconds
  },
];

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
  const [puzzles, setPuzzles] = useState(samplePuzzles);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPuzzle, setEditPuzzle] = useState<any>(null);
  const { data: categories = [] } = useCategories();

  const filteredPuzzles = puzzles.filter(puzzle => 
    puzzle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    puzzle.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    puzzle.prize.toLowerCase().includes(searchTerm.toLowerCase())
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
    setPuzzles(prev =>
      prev.map(p =>
        p.id === editingId ? { ...p, ...editPuzzle } : p
      )
    );
    setEditingId(null);
    setEditPuzzle(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const url = URL.createObjectURL(e.target.files[0]);
    setEditPuzzle((prev: any) => ({ ...prev, imageUrl: url }));
  };

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
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Puzzle
          </Button>
        </div>
        
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
                      .map(puzzle => (
                        <TableRow key={puzzle.id}>
                          <TableCell className="font-medium align-top">
                            {editingId === puzzle.id ? (
                              <div className="flex flex-col gap-2">
                                <Input
                                  value={editPuzzle?.name ?? ""}
                                  onChange={e => handleEditChange("name", e.target.value)}
                                  data-testid={`edit-name-${puzzle.id}`}
                                />
                                {editPuzzle?.imageUrl && (
                                  <div className="mt-2 mb-3 flex flex-col items-center gap-1">
                                    <PuzzlePreview imageUrl={editPuzzle.imageUrl} difficulty={editPuzzle.difficulty} />
                                    <div className="flex items-center gap-2 mt-1">
                                      <label htmlFor="edit-upload-img" className="flex items-center gap-1 cursor-pointer bg-puzzle-aqua/10 border border-puzzle-aqua/60 text-puzzle-aqua text-xs px-2 py-1 rounded transition hover:bg-puzzle-aqua/20">
                                        <Image className="h-4 w-4" /> Change image
                                      </label>
                                      <input
                                        id="edit-upload-img"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="flex items-center gap-2">
                                {puzzle.imageUrl && (
                                  <img src={puzzle.imageUrl} alt="Puzzle" className="w-10 h-10 rounded object-cover border border-puzzle-aqua/20" />
                                )}
                                {puzzle.name}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="align-top">
                            {editingId === puzzle.id ? (
                              <select
                                className="min-w-[110px] bg-background border border-border rounded p-1"
                                value={editPuzzle?.category ?? ""}
                                onChange={e => handleEditChange("category", e.target.value)}
                                data-testid={`edit-category-${puzzle.id}`}
                              >
                                {categories.map((cat: any) => (
                                  <option value={cat.name} key={cat.id}>{cat.name}</option>
                                ))}
                              </select>
                            ) : (
                              puzzle.category
                            )}
                          </TableCell>
                          <TableCell>
                            {editingId === puzzle.id ? (
                              <Input
                                value={editPuzzle?.difficulty ?? ""}
                                onChange={e => handleEditChange("difficulty", e.target.value)}
                                data-testid={`edit-difficulty-${puzzle.id}`}
                              />
                            ) : (
                              <Badge variant={
                                puzzle.difficulty === "easy" ? "outline" :
                                puzzle.difficulty === "medium" ? "secondary" : "destructive"
                              }>
                                {puzzle.difficulty.charAt(0).toUpperCase() + puzzle.difficulty.slice(1)}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="flex flex-col gap-1 align-top">
                            {editingId === puzzle.id ? (
                              <>
                                <Input
                                  type="number"
                                  value={editPuzzle?.timeLimit ?? 0}
                                  min={0}
                                  onChange={e => handleEditChange("timeLimit", Number(e.target.value))}
                                  data-testid={`edit-timelimit-${puzzle.id}`}
                                  className="w-24"
                                  placeholder="Seconds"
                                />
                                <Label className="text-xs text-muted-foreground">Timer (seconds)</Label>
                              </>
                            ) : (
                              <>
                                <Clock className="h-3 w-3 mr-1 inline" />
                                {formatTime(puzzle.timeLimit)}
                              </>
                            )}
                          </TableCell>
                          <TableCell className="flex flex-col gap-1 align-top">
                            {editingId === puzzle.id ? (
                              <>
                                <Input
                                  value={editPuzzle?.prize ?? ""}
                                  onChange={e => handleEditChange("prize", e.target.value)}
                                  data-testid={`edit-prize-${puzzle.id}`}
                                  className="mb-1"
                                />
                                <Label className="text-xs text-muted-foreground">Prize</Label>
                              </>
                            ) : (
                              <span className="flex items-center">
                                <Award className="h-3 w-3 mr-1 text-puzzle-aqua" />
                                {puzzle.prize}
                              </span>
                            )}
                          </TableCell>
                          {tabValue !== "drafts" && tabValue !== "scheduled" && (
                            <>
                              <TableCell>
                                {editingId === puzzle.id ? (
                                  <Input
                                    type="number"
                                    value={editPuzzle?.completions ?? 0}
                                    onChange={e => handleEditChange("completions", Number(e.target.value))}
                                    data-testid={`edit-completions-${puzzle.id}`}
                                    className="w-16"
                                  />
                                ) : (
                                  puzzle.completions
                                )}
                              </TableCell>
                              <TableCell>
                                {editingId === puzzle.id ? (
                                  <Input
                                    type="number"
                                    value={editPuzzle?.avgTime ?? 0}
                                    onChange={e => handleEditChange("avgTime", Number(e.target.value))}
                                    data-testid={`edit-avgtime-${puzzle.id}`}
                                    className="w-16"
                                  />
                                ) : (
                                  formatTime(puzzle.avgTime)
                                )}
                              </TableCell>
                            </>
                          )}
                          <TableCell className="text-right align-top">
                            <div className="flex flex-col gap-2 items-end">
                              {editingId === puzzle.id ? (
                                <>
                                  <div className="flex flex-row gap-2">
                                    <div className="flex flex-col items-start">
                                      <Label className="text-xs">Cost/Play</Label>
                                      <Input
                                        type="number"
                                        step={0.01}
                                        min={0}
                                        className="w-20"
                                        value={editPuzzle?.costPerPlay ?? 0}
                                        onChange={e => handleEditChange("costPerPlay", Number(e.target.value))}
                                        data-testid={`edit-costperplay-${puzzle.id}`}
                                      />
                                    </div>
                                    <div className="flex flex-col items-start">
                                      <Label className="text-xs">Target Revenue</Label>
                                      <Input
                                        type="number"
                                        step={1}
                                        min={0}
                                        className="w-24"
                                        value={editPuzzle?.targetRevenue ?? 0}
                                        onChange={e => handleEditChange("targetRevenue", Number(e.target.value))}
                                        data-testid={`edit-targetrev-${puzzle.id}`}
                                      />
                                    </div>
                                    <div className="flex flex-col items-center">
                                      <Label className="text-xs mb-1">Status</Label>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                          handleEditChange(
                                            "status",
                                            editPuzzle.status === "active" ? "inactive" : "active"
                                          )
                                        }
                                        tabIndex={0}
                                        aria-pressed={editPuzzle.status === "active" ? "true" : "false"}
                                        aria-label={editPuzzle.status === "active" ? "Active" : "Inactive"}
                                      >
                                        {editPuzzle.status === "active"
                                          ? <ToggleRight className="h-6 w-6 text-green-500" />
                                          : <ToggleLeft className="h-6 w-6 text-gray-300" />
                                        }
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="flex gap-1 mt-3">
                                    <Button variant="ghost" size="icon" onClick={saveEdit} aria-label="Save" title="Save">
                                      <span className="sr-only">Save</span>
                                      <svg width={20} height={20} stroke="currentColor" fill="none"><path d="M5 11l4 4L19 5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={cancelEdit} aria-label="Cancel" title="Cancel">
                                      <span className="sr-only">Cancel</span>
                                      <svg width={20} height={20} stroke="currentColor" fill="none"><path d="M6 6l12 12M6 18L18 6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                                    </Button>
                                  </div>
                                </>
                              ) : (
                                <div className="flex justify-end gap-1">
                                  <Button variant="ghost" size="icon" onClick={() => startEdit(puzzle)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon">
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                  {puzzle.status === "draft" && (
                                    <Button variant="ghost" size="icon">
                                      <Shuffle className="h-4 w-4 text-green-500" />
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
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
