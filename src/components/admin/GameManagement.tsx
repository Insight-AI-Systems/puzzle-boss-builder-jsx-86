
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Edit, Trash2, EyeOff, Eye, Search, Filter, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";

export type GameDifficulty = 'easy' | 'medium' | 'hard';
export type GameStatus = 'active' | 'scheduled' | 'completed' | 'draft';

export type PuzzleGame = {
  id: string;
  title: string;
  category: string;
  prize_value: number;
  status: GameStatus;
  difficulty: GameDifficulty;
  created_at: string;
  verified?: boolean;
  rules?: string;
  image_url?: string;
};

export type GameFormValues = {
  title: string;
  category: string;
  prize_value: number;
  difficulty: GameDifficulty;
  status: GameStatus;
  rules?: string;
  image_url?: string;
  verified?: boolean;
};

export function GameManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [currentGame, setCurrentGame] = useState<PuzzleGame | null>(null);
  
  const { data: games, isLoading } = useQuery({
    queryKey: ['puzzle-games'],
    queryFn: async () => {
      const mockGames: PuzzleGame[] = [
        {
          id: '1',
          title: 'iPhone 15 Puzzle Challenge',
          category: 'Smartphones',
          prize_value: 999,
          status: 'active',
          difficulty: 'medium',
          created_at: new Date().toISOString(),
          verified: true,
          rules: 'Complete the puzzle within 5 minutes to qualify. Fastest time wins.',
          image_url: 'https://placehold.co/600x400?text=iPhone+15'
        },
        {
          id: '2',
          title: 'MacBook Pro Ultimate Puzzle',
          category: 'Laptops',
          prize_value: 1999,
          status: 'scheduled',
          difficulty: 'hard',
          created_at: new Date().toISOString(),
          verified: false,
          rules: 'Complete the puzzle with 100% accuracy. Top 3 fastest times qualify for prize drawing.',
          image_url: 'https://placehold.co/600x400?text=MacBook+Pro'
        },
        {
          id: '3',
          title: 'AirPods Pro Jigsaw',
          category: 'Headphones',
          prize_value: 249,
          status: 'completed',
          difficulty: 'easy',
          created_at: new Date().toISOString(),
          verified: true,
          rules: 'Complete the puzzle to enter the drawing. Winner randomly selected from all completed entries.',
          image_url: 'https://placehold.co/600x400?text=AirPods+Pro'
        },
      ];
      
      return mockGames;
    },
  });

  const createGame = useMutation({
    mutationFn: async (newGame: Omit<PuzzleGame, 'id' | 'created_at'>) => {
      return {
        ...newGame,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['puzzle-games'] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Game created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create game: " + error.message,
        variant: "destructive",
      });
    },
  });

  const updateGame = useMutation({
    mutationFn: async (updatedGame: PuzzleGame) => {
      return updatedGame;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['puzzle-games'] });
      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: "Game updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update game: " + error.message,
        variant: "destructive",
      });
    },
  });

  const deleteGame = useMutation({
    mutationFn: async (id: string) => {
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['puzzle-games'] });
      toast({
        title: "Success",
        description: "Game deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete game: " + error.message,
        variant: "destructive",
      });
    },
  });

  const toggleGameStatus = useMutation({
    mutationFn: async ({ id, newStatus }: { id: string, newStatus: GameStatus }) => {
      return { id, status: newStatus };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['puzzle-games'] });
      toast({
        title: "Success",
        description: "Game status updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update game status: " + error.message,
        variant: "destructive",
      });
    },
  });

  const verifyGame = useMutation({
    mutationFn: async ({ id, verified }: { id: string, verified: boolean }) => {
      return { id, verified };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['puzzle-games'] });
      toast({
        title: "Success",
        description: `Game ${data.verified ? 'verified' : 'unverified'} successfully`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update verification status: " + error.message,
        variant: "destructive",
      });
    },
  });

  const filteredGames = games?.filter(game => {
    const matchesSearch = 
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || game.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || game.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  }) || [];

  const categories = games ? Array.from(new Set(games.map(game => game.category))) : [];

  // Define default values properly to match the type
  const defaultCreateValues: GameFormValues = {
    title: '',
    category: '',
    prize_value: 0,
    difficulty: 'medium' as GameDifficulty,
    status: 'draft' as GameStatus,
    rules: '',
    image_url: '',
    verified: false
  };

  const createForm = useForm<GameFormValues>({
    defaultValues: defaultCreateValues
  });

  const editForm = useForm<GameFormValues>({
    defaultValues: defaultCreateValues
  });

  const handleCreateSubmit = createForm.handleSubmit(data => {
    createGame.mutate(data as Omit<PuzzleGame, 'id' | 'created_at'>);
  });

  const handleEditSubmit = editForm.handleSubmit(data => {
    if (currentGame) {
      updateGame.mutate({
        ...currentGame,
        ...data,
      });
    }
  });

  const handleEdit = (game: PuzzleGame) => {
    setCurrentGame(game);
    editForm.reset({
      title: game.title,
      category: game.category,
      prize_value: game.prize_value,
      difficulty: game.difficulty,
      status: game.status,
      rules: game.rules || '',
      image_url: game.image_url || '',
      verified: game.verified || false
    });
    setIsEditDialogOpen(true);
  };

  const handlePreview = (game: PuzzleGame) => {
    setCurrentGame(game);
    setIsPreviewDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this game? This action cannot be undone.')) {
      deleteGame.mutate(id);
    }
  };

  const handleToggleStatus = (id: string, currentStatus: GameStatus) => {
    const newStatus = currentStatus === 'active' ? 'draft' : 'active';
    toggleGameStatus.mutate({ id, newStatus });
  };

  const handleToggleVerification = (id: string, currentVerified: boolean = false) => {
    verifyGame.mutate({ id, verified: !currentVerified });
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Puzzle Management</CardTitle>
          <CardDescription>Loading games...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-puzzle-aqua" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Puzzle Game Management
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" className="bg-puzzle-aqua hover:bg-puzzle-aqua/80">
                <Plus className="mr-2 h-4 w-4" /> Add New Puzzle
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Puzzle Game</DialogTitle>
                <DialogDescription>
                  Add details for the new puzzle game. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <Form {...createForm}>
                <form onSubmit={handleCreateSubmit} className="space-y-6">
                  <FormField
                    control={createForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter puzzle title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter category" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="prize_value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prize Value ($)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={createForm.control}
                      name="difficulty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Difficulty</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select difficulty" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="easy">Easy</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="hard">Hard</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="scheduled">Scheduled</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={createForm.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter image URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="rules"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Game Rules</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter game rules" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="verified"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Verified for publication
                          </FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Check this box to verify this puzzle is ready for public view
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit" className="bg-puzzle-aqua hover:bg-puzzle-aqua/80" disabled={createGame.isPending}>
                      {createGame.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Puzzle
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription>Create and manage puzzle games and prizes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search puzzles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex flex-row gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Puzzle Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Prize Value</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGames.length > 0 ? (
                  filteredGames.map((game) => (
                    <TableRow key={game.id}>
                      <TableCell className="font-medium">{game.title}</TableCell>
                      <TableCell>{game.category}</TableCell>
                      <TableCell>${game.prize_value.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          game.difficulty === 'easy' ? 'bg-green-100 text-green-800 border-green-200' :
                          game.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                          'bg-red-100 text-red-800 border-red-200'
                        }>
                          {game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          game.status === 'active' ? 'bg-green-600' :
                          game.status === 'draft' ? 'bg-gray-600' :
                          game.status === 'scheduled' ? 'bg-blue-600' :
                          'bg-purple-600'
                        }>
                          {game.status.charAt(0).toUpperCase() + game.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleToggleVerification(game.id, game.verified)}
                          className={game.verified ? "text-green-500" : "text-gray-400"}
                        >
                          <CheckCircle2 className="h-5 w-5" />
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" onClick={() => handlePreview(game)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleToggleStatus(game.id, game.status)}>
                            {game.status === 'active' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleEdit(game)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="text-red-500" onClick={() => handleDelete(game.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No games found. Try adjusting your filters or create a new game.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Puzzle Game</DialogTitle>
              <DialogDescription>
                Update the details for this puzzle game. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <Form {...editForm}>
              <form onSubmit={handleEditSubmit} className="space-y-6">
                <FormField
                  control={editForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter puzzle title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter category" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="prize_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prize Value ($)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={editForm.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter image URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="rules"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Game Rules</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter game rules" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="verified"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Verified for publication
                        </FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Check this box to verify this puzzle is ready for public view
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" className="bg-puzzle-aqua hover:bg-puzzle-aqua/80" disabled={updateGame.isPending}>
                    {updateGame.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Puzzle
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Puzzle Preview: {currentGame?.title}</DialogTitle>
              <DialogDescription>
                Preview how this puzzle will appear to users.
              </DialogDescription>
            </DialogHeader>
            {currentGame && (
              <div className="space-y-6">
                <div className="rounded-lg overflow-hidden border h-64 bg-gray-100 flex items-center justify-center">
                  {currentGame.image_url ? (
                    <img src={currentGame.image_url} alt={currentGame.title} className="max-h-full object-contain" />
                  ) : (
                    <div className="text-gray-400">No image available</div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Category</h3>
                    <p>{currentGame.category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Prize Value</h3>
                    <p>${currentGame.prize_value.toLocaleString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Difficulty</h3>
                    <p>{currentGame.difficulty.charAt(0).toUpperCase() + currentGame.difficulty.slice(1)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <p>{currentGame.status.charAt(0).toUpperCase() + currentGame.status.slice(1)}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Rules</h3>
                  <p className="text-gray-700">{currentGame.rules || "No rules specified."}</p>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className={`mr-2 h-5 w-5 ${currentGame.verified ? "text-green-500" : "text-gray-400"}`} />
                  <span>{currentGame.verified ? "Verified for publication" : "Not verified"}</span>
                </div>
                <DialogFooter>
                  <Button 
                    onClick={() => handleToggleVerification(currentGame.id, currentGame.verified)}
                    className={currentGame.verified ? "bg-gray-500" : "bg-puzzle-aqua"}
                  >
                    {currentGame.verified ? "Unverify Puzzle" : "Verify Puzzle"}
                  </Button>
                  <Button onClick={() => handleEdit(currentGame)} variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
