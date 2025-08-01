import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Upload, Settings, Grid, Eye, Trash2, Edit, Image as ImageIcon } from 'lucide-react';
import ImageUpload from '../ImageUpload';

interface JigsawPuzzle {
  id: string;
  title: string;
  description?: string | null;
  category_id?: string | null;
  difficulty_level: string;
  piece_count: number;
  estimated_time_minutes?: number | null;
  price: number;
  is_free: boolean;
  status: string;
  tags?: string[] | null;
  created_at: string;
  updated_at: string;
}

interface JigsawPuzzleImage {
  id: string;
  puzzle_id: string;
  original_image_url: string;
  thumbnail_url?: string;
  medium_image_url?: string;
  large_image_url?: string;
  image_width?: number;
  image_height?: number;
  is_primary: boolean;
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';
}

interface Category {
  id: string;
  name: string;
}

export const JigsawPuzzleManager: React.FC = () => {
  const [puzzles, setPuzzles] = useState<JigsawPuzzle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPuzzle, setEditingPuzzle] = useState<JigsawPuzzle | null>(null);
  const [jsUploadEnabled, setJsUploadEnabled] = useState(false);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    difficulty_level: 'medium',
    piece_count: 100,
    estimated_time_minutes: 30,
    price: 0,
    is_free: true,
    status: 'draft',
    tags: [] as string[]
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load puzzles
      const { data: puzzlesData, error: puzzlesError } = await supabase
        .from('jigsaw_puzzles')
        .select('*')
        .order('created_at', { ascending: false });

      if (puzzlesError) throw puzzlesError;
      setPuzzles((puzzlesData || []) as JigsawPuzzle[]);

      // Load categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name')
        .eq('status', 'active');

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load puzzle data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (files: File[]) => {
    // This will be implemented in Phase 3 - Image Processing System
    toast({
      title: "Coming Soon",
      description: "Image upload functionality will be implemented in the next phase",
    });
  };

  const handleCreatePuzzle = async () => {
    try {
      const { data, error } = await supabase
        .from('jigsaw_puzzles')
        .insert([formData])
        .select()
        .single();

      if (error) throw error;

      setPuzzles([data as JigsawPuzzle, ...puzzles]);
      setShowCreateForm(false);
      resetForm();
      
      toast({
        title: "Success",
        description: "Puzzle created successfully",
      });
    } catch (error) {
      console.error('Error creating puzzle:', error);
      toast({
        title: "Error",
        description: "Failed to create puzzle",
        variant: "destructive"
      });
    }
  };

  const handleUpdatePuzzle = async () => {
    if (!editingPuzzle) return;

    try {
      const { data, error } = await supabase
        .from('jigsaw_puzzles')
        .update(formData)
        .eq('id', editingPuzzle.id)
        .select()
        .single();

      if (error) throw error;

      setPuzzles(puzzles.map(p => p.id === editingPuzzle.id ? data as JigsawPuzzle : p));
      setEditingPuzzle(null);
      resetForm();
      
      toast({
        title: "Success",
        description: "Puzzle updated successfully",
      });
    } catch (error) {
      console.error('Error updating puzzle:', error);
      toast({
        title: "Error",
        description: "Failed to update puzzle",
        variant: "destructive"
      });
    }
  };

  const handleDeletePuzzle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this puzzle?')) return;

    try {
      const { error } = await supabase
        .from('jigsaw_puzzles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPuzzles(puzzles.filter(p => p.id !== id));
      
      toast({
        title: "Success",
        description: "Puzzle deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting puzzle:', error);
      toast({
        title: "Error",
        description: "Failed to delete puzzle",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category_id: '',
      difficulty_level: 'medium',
      piece_count: 100,
      estimated_time_minutes: 30,
      price: 0,
      is_free: true,
      status: 'draft',
      tags: []
    });
  };

  const startEdit = (puzzle: JigsawPuzzle) => {
    setEditingPuzzle(puzzle);
    setFormData({
      title: puzzle.title,
      description: puzzle.description || '',
      category_id: puzzle.category_id || '',
      difficulty_level: puzzle.difficulty_level,
      piece_count: puzzle.piece_count,
      estimated_time_minutes: puzzle.estimated_time_minutes || 30,
      price: puzzle.price,
      is_free: puzzle.is_free,
      status: puzzle.status,
      tags: puzzle.tags || []
    });
    setShowCreateForm(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-orange-500';
      case 'expert': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with JS Upload Toggle */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Grid className="h-5 w-5" />
            Jigsaw Puzzle Manager
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="js-upload"
                checked={jsUploadEnabled}
                onCheckedChange={setJsUploadEnabled}
              />
              <Label htmlFor="js-upload">JS Upload Facility</Label>
            </div>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Puzzle
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="puzzles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="puzzles">Puzzles</TabsTrigger>
          <TabsTrigger value="upload">Upload Images</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="puzzles" className="space-y-4">
          {/* Create/Edit Form */}
          {showCreateForm && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingPuzzle ? 'Edit Puzzle' : 'Create New Puzzle'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Puzzle title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category_id} onValueChange={(value) => setFormData({...formData, category_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Puzzle description"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select value={formData.difficulty_level} onValueChange={(value: any) => setFormData({...formData, difficulty_level: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="pieces">Piece Count</Label>
                    <Input
                      id="pieces"
                      type="number"
                      min="6"
                      max="2000"
                      value={formData.piece_count}
                      onChange={(e) => setFormData({...formData, piece_count: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Est. Time (min)</Label>
                    <Input
                      id="time"
                      type="number"
                      value={formData.estimated_time_minutes}
                      onChange={(e) => setFormData({...formData, estimated_time_minutes: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is-free"
                      checked={formData.is_free}
                      onCheckedChange={(checked) => setFormData({...formData, is_free: checked})}
                    />
                    <Label htmlFor="is-free">Free Puzzle</Label>
                  </div>
                  {!formData.is_free && (
                    <div>
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                      />
                    </div>
                  )}
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={editingPuzzle ? handleUpdatePuzzle : handleCreatePuzzle}>
                    {editingPuzzle ? 'Update' : 'Create'} Puzzle
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setShowCreateForm(false);
                    setEditingPuzzle(null);
                    resetForm();
                  }}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Puzzles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {puzzles.map((puzzle) => (
              <Card key={puzzle.id} className="overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold truncate">{puzzle.title}</h3>
                      <Badge
                        variant="outline"
                        className={`${getDifficultyColor(puzzle.difficulty_level)} text-white`}
                      >
                        {puzzle.difficulty_level}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {puzzle.description || 'No description'}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>{puzzle.piece_count} pieces</span>
                      <Badge variant={puzzle.status === 'published' ? 'default' : 'secondary'}>
                        {puzzle.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-2">
                      <Button size="sm" variant="outline" onClick={() => startEdit(puzzle)}>
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDeletePuzzle(puzzle.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {puzzles.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Grid className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No puzzles yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first jigsaw puzzle to get started
                </p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Puzzle
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Image Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload onUpload={handleImageUpload} />
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Image processing and automatic thumbnail generation will be implemented in Phase 3.
                  Currently supports drag & drop upload interface.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Global Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Global puzzle configuration settings will be implemented in Phase 4.
                    This will include default piece counts, difficulty algorithms, and game engine settings.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};