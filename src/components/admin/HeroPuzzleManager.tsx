
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useHeroPuzzle, HeroPuzzleConfig } from '@/hooks/useHeroPuzzle';
import { Loader2 } from 'lucide-react';
import { ImageSelector } from './image-library/components/ImageSelector';
import { HeroImageSection } from './hero-puzzle/HeroImageSection';
import { HeroPuzzleForm } from './hero-puzzle/HeroPuzzleForm';
import { HeroPuzzleFooter } from './hero-puzzle/HeroPuzzleFooter';

const HeroPuzzleManager: React.FC = () => {
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

  const handleDelete = async () => {
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
            <HeroPuzzleForm
              formData={formData}
              handleChange={handleChange}
              onImageSelectorOpen={() => setIsImageSelectorOpen(true)}
            />
            <HeroImageSection imageUrl={formData.image_url || ''} />
          </div>
          
          <HeroPuzzleFooter
            formData={formData}
            isSubmitting={isSubmitting}
            onDelete={handleDelete}
          />
        </CardContent>
      </form>
      
      <ImageSelector 
        isOpen={isImageSelectorOpen}
        onClose={() => setIsImageSelectorOpen(false)}
        onSelectImage={handleImageSelected}
      />
    </Card>
  );
};

export default HeroPuzzleManager;
