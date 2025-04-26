import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useHeroPuzzle, HeroPuzzleConfig } from '@/hooks/useHeroPuzzle';
import { Loader2, Save, Trash2, Image as ImageIcon } from 'lucide-react';
import PuzzlePreview from '@/components/puzzles/components/PuzzlePreview';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ImageSelector } from './image-library/components/ImageSelector';

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
  'https://images.unsplash.com/photo-1500673922987-e212871fec22'
];

export const HeroPuzzleManager: React.FC = () => {
  const { puzzleConfig, isLoading, updateHeroPuzzle, createHeroPuzzle } = useHeroPuzzle();
  const [formData, setFormData] = useState<Partial<HeroPuzzleConfig>>({
    image_url: '',
    difficulty: 'medium',
    title: 'Welcome Puzzle',
    description: 'Complete this puzzle to get started!'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (puzzleConfig) {
      setFormData({
        id: puzzleConfig.id,
        image_url: puzzleConfig.image_url,
        difficulty: puzzleConfig.difficulty,
        title: puzzleConfig.title,
        description: puzzleConfig.description || '',
      });
    }
  }, [puzzleConfig]);

  const handleChange = (key: keyof HeroPuzzleConfig, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (formData.id) {
        await updateHeroPuzzle(formData);
        toast({
          title: "Success",
          description: "The hero puzzle has been updated.",
        });
      } else {
        await createHeroPuzzle(formData as HeroPuzzleConfig);
        toast({
          title: "Success",
          description: "A new hero puzzle has been created.",
        });
      }
    } catch (error: any) {
      console.error('Error saving hero puzzle:', error);
      toast({
        title: "Error saving puzzle",
        description: error.message || "Failed to save puzzle configuration",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageSelected = (imageUrl: string) => {
    handleChange('image_url', imageUrl);
    setIsImageSelectorOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-puzzle-aqua" />
      </div>
    );
  }

  return (
    <Card className="border-puzzle-aqua/20 bg-black/40">
      <CardHeader>
        <CardTitle className="text-puzzle-aqua">Hero Puzzle Configuration</CardTitle>
        <CardDescription>
          Configure the interactive puzzle displayed on the homepage hero section
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Puzzle Title</Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) => handleChange('difficulty', value as 'easy' | 'medium' | 'hard')}
                >
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy (3x3)</SelectItem>
                    <SelectItem value="medium">Medium (4x4)</SelectItem>
                    <SelectItem value="hard">Hard (5x5)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <div className="flex space-x-2">
                  <Input
                    id="image_url"
                    value={formData.image_url || ''}
                    onChange={(e) => handleChange('image_url', e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    title="Select random sample image"
                    onClick={() => {
                      const randomImage = SAMPLE_IMAGES[Math.floor(Math.random() * SAMPLE_IMAGES.length)];
                      handleChange('image_url', randomImage);
                    }}
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    title="Browse image library"
                    onClick={() => setIsImageSelectorOpen(true)}
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-sm font-medium mb-2">Preview</h3>
              {formData.image_url ? (
                <div className="border rounded-lg overflow-hidden bg-black/20 w-[256px] h-[256px]">
                  <AspectRatio ratio={1/1} className="h-full">
                    <img 
                      src={formData.image_url} 
                      alt="Puzzle preview" 
                      className="object-contain w-full h-full"
                    />
                  </AspectRatio>
                </div>
              ) : (
                <div className="border rounded-lg flex items-center justify-center aspect-square w-[256px] h-[256px] bg-black/20">
                  <p className="text-muted-foreground text-sm">No image URL provided</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="justify-between border-t border-puzzle-aqua/20 pt-4">
          <Button 
            type="button" 
            variant="destructive"
            disabled={isSubmitting || !formData.id}
            onClick={async () => {
              if (!formData.id || !window.confirm('Are you sure you want to delete this puzzle?')) return;
              
              try {
                const { error } = await supabase
                  .from('hero_puzzle_config')
                  .delete()
                  .eq('id', formData.id);
                
                if (error) throw error;
                
                setFormData({
                  image_url: '',
                  difficulty: 'medium',
                  title: 'Welcome Puzzle',
                  description: 'Complete this puzzle to get started!'
                });
                
                toast({
                  title: "Puzzle deleted",
                  description: "The hero puzzle has been deleted.",
                });
                
                window.location.reload();
              } catch (error: any) {
                toast({
                  title: "Error deleting puzzle",
                  description: error.message,
                  variant: "destructive",
                });
              }
            }}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default HeroPuzzleManager;
