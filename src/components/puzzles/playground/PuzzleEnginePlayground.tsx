import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { RefreshCcw } from 'lucide-react';
import { useTheme } from 'next-themes';
import PuzzleGame from "@/components/puzzles/PuzzleGame";
import './engines/styles/jigsaw-puzzle.css';

const SAMPLE_IMAGES = [
  {
    id: 'iphone',
    url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop',
    alt: 'iPhone'
  },
  {
    id: 'laptop',
    url: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=500&h=500&fit=crop',
    alt: 'Laptop'
  },
  {
    id: 'headphones',
    url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&h=500&fit=crop',
    alt: 'Headphones'
  }
];

const PUZZLE_ENGINES = [
  { id: 'react-jigsaw-puzzle', name: 'Puzzle Boss Jigsaw Puzzle' }
];

const DIFFICULTY_PRESETS = [
  { value: 'easy', label: 'Easy', rows: 3, columns: 3 },
  { value: 'medium', label: 'Medium', rows: 4, columns: 4 },
  { value: 'hard', label: 'Hard', rows: 5, columns: 5 },
  { value: 'expert', label: 'Expert', rows: 6, columns: 6 }
];

interface PuzzleEnginePlaygroundProps {
  heroMode?: boolean;
  isCondensed?: boolean;
  selectedImage?: string;
  difficulty?: string;
  miniRows?: number;
  miniColumns?: number;
}

const PuzzleEnginePlayground: React.FC<PuzzleEnginePlaygroundProps> = ({
  heroMode = false,
  isCondensed = false,
  selectedImage: propSelectedImage,
  difficulty: propDifficulty,
  miniRows,
  miniColumns
}) => {
  
  const [selectedImage, setSelectedImage] = useState(propSelectedImage || SAMPLE_IMAGES[0].id);
  const [difficulty, setDifficulty] = useState(propDifficulty || DIFFICULTY_PRESETS[1].value);
  const [resetKey, setResetKey] = useState(0);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const { theme } = useTheme();

  const currentImage = SAMPLE_IMAGES.find(img => img.id === selectedImage)?.url || SAMPLE_IMAGES[0].url;
  const currentDifficultyPreset = (
    DIFFICULTY_PRESETS.find(d => d.value === difficulty) || DIFFICULTY_PRESETS[1]
  );
  const rows = heroMode && miniRows ? miniRows : currentDifficultyPreset.rows;
  const columns = heroMode && miniColumns ? miniColumns : currentDifficultyPreset.columns;

  const handleResetPuzzle = useCallback(() => {
    setResetKey(prev => prev + 1);
  }, []);
  
  const handleNotesChange = useCallback((value: string) => {
    setNotes(prev => ({
      ...prev,
      puzzle: value
    }));
  }, []);
  
  const getEngineKey = useCallback((engineId: string) => {
    return `${engineId}-${resetKey}-${selectedImage}-${difficulty}`;
  }, [resetKey, selectedImage, difficulty]);
  
  if (heroMode) {
    return (
      <div className="w-full" style={{ minHeight: 220 }}>
        <div className="relative border rounded-lg p-2 bg-background">
          <PuzzleGame
            key={getEngineKey('library')}
            imageUrl={currentImage}
            rows={rows}
            columns={columns}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/20 rounded-lg border">
        <div>
          <Label htmlFor="image-selector" className="mb-2 block">Test Image</Label>
          <Select value={selectedImage} onValueChange={setSelectedImage}>
            <SelectTrigger id="image-selector" className="w-full">
              <SelectValue placeholder="Select image..." />
            </SelectTrigger>
            <SelectContent>
              {SAMPLE_IMAGES.map(image => (
                <SelectItem key={image.id} value={image.id}>
                  {image.alt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="difficulty-selector" className="mb-2 block">Difficulty</Label>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger id="difficulty-selector" className="w-full">
              <SelectValue placeholder="Select difficulty..." />
            </SelectTrigger>
            <SelectContent>
              {DIFFICULTY_PRESETS.map(preset => (
                <SelectItem key={preset.value} value={preset.value}>
                  {preset.label} ({preset.rows}x{preset.columns})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button variant="outline" onClick={handleResetPuzzle} className="flex items-center gap-2">
          <RefreshCcw className="h-4 w-4" />
          Reset Puzzle
        </Button>
      </div>
      
      <div className="min-h-[500px] relative border rounded-lg p-4 bg-background">
        <div className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs border">
          Puzzle Boss Jigsaw Puzzle
        </div>
        
        <PuzzleGame
          key={getEngineKey('library')}
          imageUrl={currentImage}
          rows={rows}
          columns={columns}
        />
      </div>
      
      <div>
        <Label htmlFor="evaluation-notes" className="mb-2 block">Evaluation Notes</Label>
        <Textarea
          id="evaluation-notes"
          placeholder="Add your notes, observations, and feedback about this puzzle engine here..."
          className="min-h-[120px]"
          value={notes['puzzle'] || ''}
          onChange={(e) => handleNotesChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default React.memo(PuzzleEnginePlayground);
