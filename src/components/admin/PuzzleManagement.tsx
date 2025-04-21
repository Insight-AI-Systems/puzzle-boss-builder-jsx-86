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
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Puzzle, 
  Clock, 
  Award, 
  Shuffle, 
  Edit, 
  Trash2 
} from "lucide-react";

const samplePuzzles = [
  {
    id: "p1",
    name: "iPhone 14 Pro",
    category: "Smartphones",
    difficulty: "medium",
    timeLimit: 300, // seconds
    prize: "iPhone 14 Pro",
    status: "active",
    completions: 122,
    avgTime: 189, // seconds
  },
  {
    id: "p2",
    name: "MacBook Air M2",
    category: "Laptops",
    difficulty: "hard",
    timeLimit: 420, // seconds
    prize: "MacBook Air M2",
    status: "scheduled",
    completions: 0,
    avgTime: 0, // seconds
  },
  {
    id: "p3",
    name: "AirPods Pro",
    category: "Headphones",
    difficulty: "easy",
    timeLimit: 180, // seconds
    prize: "AirPods Pro",
    status: "active",
    completions: 348,
    avgTime: 142, // seconds
  },
  {
    id: "p4",
    name: "PlayStation 5",
    category: "Gaming Consoles",
    difficulty: "medium",
    timeLimit: 360, // seconds
    prize: "PlayStation 5",
    status: "completed",
    completions: 521,
    avgTime: 202, // seconds
  },
  {
    id: "p5",
    name: "Samsung Galaxy S23",
    category: "Smartphones",
    difficulty: "medium",
    timeLimit: 300, // seconds
    prize: "Samsung Galaxy S23",
    status: "draft",
    completions: 0,
    avgTime: 0, // seconds
  },
];

export const PuzzleManagement: React.FC = () => {
  const [puzzles, setPuzzles] = useState(samplePuzzles);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
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
  
  const handleNewPuzzle = () => {
    navigate('/admin-dashboard/puzzle-create');
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
          <Button onClick={handleNewPuzzle}>
            <Plus className="h-4 w-4 mr-2" />
            New Puzzle
          </Button>
        </div>
        
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
                      .map(puzzle => (
                        <TableRow key={puzzle.id}>
                          <TableCell className="font-medium">{puzzle.name}</TableCell>
                          <TableCell>{puzzle.category}</TableCell>
                          <TableCell>
                            <Badge variant={
                              puzzle.difficulty === "easy" ? "outline" :
                              puzzle.difficulty === "medium" ? "secondary" : "destructive"
                            }>
                              {puzzle.difficulty.charAt(0).toUpperCase() + puzzle.difficulty.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTime(puzzle.timeLimit)}
                          </TableCell>
                          <TableCell className="flex items-center">
                            <Award className="h-3 w-3 mr-1 text-puzzle-aqua" />
                            {puzzle.prize}
                          </TableCell>
                          {tabValue !== "drafts" && tabValue !== "scheduled" && (
                            <>
                              <TableCell>{puzzle.completions}</TableCell>
                              <TableCell>{formatTime(puzzle.avgTime)}</TableCell>
                            </>
                          )}
                          <TableCell className="text-right">
                            <div className="flex justify-end">
                              <Button variant="ghost" size="icon">
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
