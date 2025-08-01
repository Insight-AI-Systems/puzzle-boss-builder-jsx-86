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
import { Plus, Upload, Settings, Grid, Eye, Trash2, Edit, Pause, Play, Image as ImageIcon } from 'lucide-react';
import ImageUpload from '../ImageUpload';
import { useImageLibrary } from '../image-library/hooks/useImageLibrary';
import { useImageUpload } from '../image-library/hooks/useImageUpload';
import { useImageManagement } from '../image-library/hooks/useImageManagement';
import { useClerkAuth } from '@/hooks/useClerkAuth';
import { ImageLibrarySelector } from './ImageLibrarySelector';
import { fixStuckImages } from '@/utils/fixStuckImages';

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
  images?: JigsawPuzzleImage[];
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
  const { user } = useClerkAuth();
  const [puzzles, setPuzzles] = useState<JigsawPuzzle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPuzzle, setEditingPuzzle] = useState<JigsawPuzzle | null>(null);
  const [jsUploadEnabled, setJsUploadEnabled] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<string>('');
  const { toast } = useToast();
  
  // Image library integration
  const { images, loadImages } = useImageLibrary();
  const { handleUpload: uploadImage, isUploading } = useImageUpload(user, loadImages);
  const { deleteImage, updateImageStatus } = useImageManagement();

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
    tags: [] as string[],
    image_url: '',
    image_name: '',
    selected_image_data: null as any
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load puzzles with their images
      const { data: puzzlesData, error: puzzlesError } = await supabase
        .from('jigsaw_puzzles')
        .select(`
          *,
          images:jigsaw_puzzle_images(*)
        `)
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
    console.log('handleImageUpload called with files:', files.length);
    console.log('User:', user);
    console.log('Is uploading:', isUploading);
    
    try {
      console.log('About to call uploadImage...');
      await uploadImage(files);
      console.log('Upload completed successfully');
      toast({
        title: "Success",
        description: `${files.length} image(s) uploaded successfully`,
      });
    } catch (error) {
      console.error('Upload error in handleImageUpload:', error);
      toast({
        title: "Upload Failed",
        description: `Failed to upload images: ${error.message || 'Unknown error'}`,
        variant: "destructive"
      });
    }
  };

  const handleProcessStuckImages = async () => {
    try {
      toast({
        title: "Processing Images",
        description: "Starting image processing for stuck images...",
      });
      
      await fixStuckImages();
      
      // Reload images after processing
      await loadImages();
      
      toast({
        title: "Processing Complete",
        description: "All stuck images have been processed successfully",
      });
    } catch (error) {
      console.error('Error processing stuck images:', error);
      toast({
        title: "Processing Failed",
        description: "Failed to process stuck images. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleImageSelect = (image: any) => {
    console.log('Selected image data:', image);
    setSelectedImageId(image.id);
    setFormData({
      ...formData, 
      image_url: image.url, 
      image_name: image.name,
      selected_image_data: image
    });
    toast({
      title: "Image Selected",
      description: `Selected: ${image.name}. You can now complete the form and create your puzzle.`,
    });
  };

  const handleCreatePuzzle = async () => {
    try {
      // Validate required fields
      if (!formData.title.trim()) {
        toast({
          title: "Validation Error",
          description: "Title is required",
          variant: "destructive"
        });
        return;
      }

      if (!selectedImageId) {
        toast({
          title: "Validation Error",
          description: "Please select an image from the library",
          variant: "destructive"
        });
        return;
      }

      // Get current user's profile to get the UUID that matches the profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', user.emailAddresses?.[0]?.emailAddress)
        .maybeSingle();

      if (profileError) {
        console.error('Profile query error:', profileError);
        toast({
          title: "Error",
          description: "Could not query user profile. Please ensure you're logged in properly.",
          variant: "destructive"
        });
        return;
      }

      if (!profileData) {
        console.error('No profile found for email:', user.emailAddresses?.[0]?.emailAddress);
        toast({
          title: "Error", 
          description: "Could not find user profile. Please contact admin.",
          variant: "destructive"
        });
        return;
      }

      console.log('Profile data:', profileData);

      // Auto-determine difficulty based on piece count
      const getDifficultyFromPieceCount = (pieces: number): string => {
        if (pieces <= 50) return 'easy';
        if (pieces <= 200) return 'medium';
        if (pieces <= 500) return 'hard';
        return 'expert';
      };

      // Prepare the data with required fields
      const puzzleData = {
        title: formData.title.trim(),
        description: formData.description?.trim() || null,
        category_id: formData.category_id || null,
        difficulty_level: getDifficultyFromPieceCount(formData.piece_count),
        piece_count: formData.piece_count,
        estimated_time_minutes: formData.estimated_time_minutes,
        price: formData.price || 0,
        is_free: formData.is_free,
        status: formData.status,
        tags: formData.tags || [],
        created_by: profileData.id, // Use profile UUID
      };

      console.log('Creating puzzle with data:', puzzleData);
      console.log('Current user:', user);

      const { data, error } = await supabase
        .from('jigsaw_puzzles')
        .insert([puzzleData])
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('Puzzle created successfully:', data);

      // Create puzzle image record to link the selected image
      if (formData.selected_image_data) {
        const imageData = {
          puzzle_id: data.id,
          original_image_url: formData.selected_image_data.image_files?.[0]?.original_path || '',
          thumbnail_url: formData.selected_image_data.image_files?.[0]?.thumbnail_path || null,
          medium_image_url: formData.selected_image_data.image_files?.[0]?.processed_path || null,
          image_width: formData.selected_image_data.image_files?.[0]?.original_width || null,
          image_height: formData.selected_image_data.image_files?.[0]?.original_height || null,
          is_primary: true,
          processing_status: 'completed'
        };

        const { error: imageError } = await supabase
          .from('jigsaw_puzzle_images')
          .insert([imageData]);

        if (imageError) {
          console.error('Error creating puzzle image:', imageError);
        }
      }

      // Just add the new puzzle to the existing list instead of reloading everything
      setPuzzles([data as JigsawPuzzle, ...puzzles]);
      setShowCreateForm(false);
      setSelectedImageId('');
      resetForm();
      
      toast({
        title: "Success",
        description: "Puzzle created successfully",
      });
    } catch (error) {
      console.error('Error creating puzzle:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: "Error",
        description: `Failed to create puzzle: ${errorMessage}`,
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
      tags: [],
      image_url: '',
      image_name: '',
      selected_image_data: null
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
      tags: puzzle.tags || [],
      image_url: '',
      image_name: '',
      selected_image_data: null
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
                <form onSubmit={(e) => {
                  e.preventDefault();
                  editingPuzzle ? handleUpdatePuzzle() : handleCreatePuzzle();
                }} className="space-y-4">
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pieces">Piece Count</Label>
                    <Input
                      id="pieces"
                      type="number"
                      min="4"
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

                  {/* Image Selection */}
                  <div>
                    <Label>Puzzle Image *</Label>
                    <div className="flex gap-2 mt-2">
                      <ImageLibrarySelector
                        onImageSelect={handleImageSelect}
                        selectedImageId={selectedImageId}
                      >
                        <Button variant="outline" type="button">
                          <ImageIcon className="h-4 w-4 mr-2" />
                          {selectedImageId ? 'Change Image' : 'Select from Library'}
                        </Button>
                      </ImageLibrarySelector>
                      {selectedImageId && (
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setSelectedImageId('');
                            setFormData({...formData, image_url: '', image_name: '', selected_image_data: null});
                          }}
                          type="button"
                        >
                          Clear Selection
                        </Button>
                      )}
                    </div>
                    
                    {/* Image Preview */}
                    {selectedImageId && formData.selected_image_data ? (
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <img 
                              src={formData.selected_image_data.image_files?.[0]?.thumbnail_path 
                                ? `https://vcacfysfjgoahledqdwa.supabase.co/storage/v1/object/public/Image Thumbnails/${formData.selected_image_data.image_files[0].thumbnail_path}`
                                : formData.selected_image_data.image_files?.[0]?.original_path
                                ? `https://vcacfysfjgoahledqdwa.supabase.co/storage/v1/object/public/Original Product Images/${formData.selected_image_data.image_files[0].original_path}`
                                : formData.selected_image_data.url || ''
                              }
                              alt={formData.image_name}
                              className="w-32 h-32 object-cover rounded border shadow-sm"
                              onError={(e) => {
                                console.log('Image failed to load:', formData.selected_image_data);
                                // Try fallback to original image if thumbnail fails
                                if (formData.selected_image_data.image_files?.[0]?.original_path) {
                                  e.currentTarget.src = `https://vcacfysfjgoahledqdwa.supabase.co/storage/v1/object/public/Original Product Images/${formData.selected_image_data.image_files[0].original_path}`;
                                } else {
                                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCA1Nkg4OFY3Mkg2NEw1NiA2NEg0MFY1NloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                                }
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-green-800 font-medium">
                              ✓ Image selected: {formData.image_name}
                            </div>
                            <div className="text-xs text-green-600 mt-1">
                              Ready to create puzzle
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              {formData.selected_image_data.image_files?.[0]?.original_width && formData.selected_image_data.image_files?.[0]?.original_height 
                                ? `${formData.selected_image_data.image_files[0].original_width} × ${formData.selected_image_data.image_files[0].original_height}` 
                                : formData.selected_image_data.dimensions
                                ? `${formData.selected_image_data.dimensions.width} × ${formData.selected_image_data.dimensions.height}`
                                : 'Processing dimensions...'
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : selectedImageId ? (
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                        <div className="text-sm text-green-800 font-medium">
                          ✓ Image selected: {formData.image_name}
                        </div>
                        <div className="text-xs text-green-600">
                          Ready to create puzzle
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded">
                        <div className="text-sm text-orange-800">
                          Please select an image from the library to continue
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">
                      {editingPuzzle ? 'Update' : 'Create'} Puzzle
                    </Button>
                   <Button type="button" variant="outline" onClick={() => {
                    setShowCreateForm(false);
                    setEditingPuzzle(null);
                    resetForm();
                  }}>
                    Cancel
                  </Button>
                 </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Puzzles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {puzzles.map((puzzle) => (
              <Card key={puzzle.id} className="overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  {puzzle.images && puzzle.images.length > 0 && puzzle.images[0].original_image_url ? (
                    <img
                      src={`https://vcacfysfjgoahledqdwa.supabase.co/storage/v1/object/public/Original Product Images/${puzzle.images[0].original_image_url}`}
                      alt={puzzle.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjE0NCIgdmlld0JveD0iMCAwIDI1NiAxNDQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMTQ0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDQgNjRIMTUyVjgwSDEzNkwxMjggNzJIMTA0VjY0WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                      }}
                    />
                  ) : (
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  )}
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

          {puzzles.length === 0 && !showCreateForm && (
            <Card>
              <CardContent className="text-center py-12">
                <Grid className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
                <h3 className="text-xl font-semibold mb-2">No puzzles yet</h3>
                <p className="text-muted-foreground mb-6">
                  Use the "Create Puzzle" button above to create your first jigsaw puzzle
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Image Management
                </span>
                <Badge variant="outline">
                  {images.length} images in library
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Upload New Images</h3>
                  <Button 
                    variant="outline"
                    onClick={handleProcessStuckImages}
                    className="text-sm"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Process Stuck Images
                  </Button>
                </div>
                <ImageUpload onUpload={handleImageUpload} disabled={isUploading} />
                {isUploading && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    Uploading images...
                  </div>
                )}
              </div>

              {/* Image Library Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Image Library</h3>
                {images.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No images uploaded yet</p>
                    <p className="text-sm">Upload images above to get started</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.slice(0, 12).map((image) => (
                      <Card key={image.id} className="overflow-hidden">
                        <div className="aspect-video bg-muted flex items-center justify-center">
                          {image.imageUrl ? (
                            <img
                              src={image.imageUrl}
                              alt={image.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                        <CardContent className="p-3">
                          <p className="text-sm font-medium truncate">{image.name}</p>
                          <div className="flex items-center justify-between mt-2">
                            <Badge variant="outline" className="text-xs">
                              {image.status}
                            </Badge>
                          </div>
                          
                          {/* Management Actions */}
                          <div className="flex gap-1 mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(image.imageUrl, '_blank')}
                              className="flex-1 text-xs"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={async () => {
                                const newStatus = image.status === 'active' ? 'held' : 'active';
                                const success = await updateImageStatus(image.id, newStatus);
                                if (success) loadImages();
                              }}
                              className="flex-1 text-xs"
                            >
                              {image.status === 'active' ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={async () => {
                                if (confirm(`Delete ${image.name}?`)) {
                                  const success = await deleteImage(image.id);
                                  if (success) loadImages();
                                }
                              }}
                              className="flex-1 text-xs"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                {images.length > 12 && (
                  <div className="text-center mt-4">
                    <p className="text-sm text-muted-foreground">
                      Showing 12 of {images.length} images
                    </p>
                  </div>
                )}
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