
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
import ReactJigsawPuzzleEngine from './engines/ReactJigsawPuzzleEngine';
import ReactJigsawPuzzleEngine2 from './engines/ReactJigsawPuzzleEngine2';
import CustomPuzzleEngine from './engines/CustomPuzzleEngine';
import PuzzleBossEngine from './engines/PuzzleBossEngine';
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
  { id: 'react-jigsaw-puzzle', name: 'React Jigsaw Puzzle (Custom)' },
  { id: 'react-jigsaw-puzzle-2', name: 'React Jigsaw Puzzle (External)' },
  { id: 'custom-puzzle-engine', name: 'Custom Lovable Puzzle' },
  { id: 'puzzle-boss-engine', name: 'Puzzle Boss Master' },
  { id: 'custom-engine', name: 'Custom Engine (Placeholder)' }
];

const DIFFICULTY_PRESETS = [
  { value: 'easy', label: 'Easy', rows: 3, columns: 3 },
  { value: 'medium', label: 'Medium', rows: 4, columns: 4 },
  { value: 'hard', label: 'Hard', rows: 5, columns: 5 },
  { value: 'expert', label: 'Expert', rows: 6, columns: 6 }
];

const PuzzleEnginePlayground: React.FC = () => {
  const [selectedEngine, setSelectedEngine] = useState(PUZZLE_ENGINES[0].id);
  const [selectedImage, setSelectedImage] = useState(SAMPLE_IMAGES[0].id);
  const [difficulty, setDifficulty] = useState(DIFFICULTY_PRESETS[1].value); // Default to medium
  const [resetKey, setResetKey] = useState(0);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const { theme } = useTheme();

  const currentImage = SAMPLE_IMAGES.find(img => img.id === selectedImage)?.url || SAMPLE_IMAGES[0].url;
  
  const currentDifficultyPreset = DIFFICULTY_PRESETS.find(d => d.value === difficulty) || DIFFICULTY_PRESETS[1];
  
  useEffect(() => {
    console.log('Selected image URL:', currentImage);
  }, [currentImage]);
  
  const handleResetPuzzle = useCallback(() => {
    setResetKey(prev => prev + 1);
  }, []);
  
  const handleNotesChange = useCallback((engineId: string, value: string) => {
    setNotes(prev => ({
      ...prev,
      [engineId]: value
    }));
  }, []);
  
  const getEngineKey = useCallback((engineId: string) => {
    return `${engineId}-${resetKey}-${selectedImage}-${difficulty}`;
  }, [resetKey, selectedImage, difficulty]);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/20 rounded-lg border">
        <div>
          <Label htmlFor="engine-selector" className="mb-2 block">Choose Puzzle Engine</Label>
          <Select value={selectedEngine} onValueChange={setSelectedEngine}>
            <SelectTrigger id="engine-selector" className="w-full">
              <SelectValue placeholder="Select engine..." />
            </SelectTrigger>
            <SelectContent>
              {PUZZLE_ENGINES.map(engine => (
                <SelectItem key={engine.id} value={engine.id}>
                  {engine.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
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
          {PUZZLE_ENGINES.find(e => e.id === selectedEngine)?.name || 'Unknown Engine'}
        </div>
        
        {selectedEngine === 'react-jigsaw-puzzle' && (
          <ReactJigsawPuzzleEngine 
            key={getEngineKey('jigsaw')}
            imageUrl={currentImage}
            rows={currentDifficultyPreset.rows}
            columns={currentDifficultyPreset.columns}
          />
        )}
        
        {selectedEngine === 'react-jigsaw-puzzle-2' && (
          <ReactJigsawPuzzleEngine2 
            key={getEngineKey('jigsaw2')}
            imageUrl={currentImage}
            rows={currentDifficultyPreset.rows}
            columns={currentDifficultyPreset.columns}
          />
        )}
        
        {selectedEngine === 'custom-puzzle-engine' && (
          <CustomPuzzleEngine 
            key={getEngineKey('custom')}
            imageUrl={currentImage}
            rows={currentDifficultyPreset.rows}
            columns={currentDifficultyPreset.columns}
          />
        )}
        
        {selectedEngine === 'puzzle-boss-engine' && (
          <PuzzleBossEngine
            key={getEngineKey('boss')}
            imageUrl={currentImage}
            rows={currentDifficultyPreset.rows}
            columns={currentDifficultyPreset.columns}
          />
        )}
        
        {selectedEngine === 'custom-engine' && (
          <div className="flex flex-col items-center justify-center h-96 bg-muted/20 rounded-lg border border-dashed">
            <p className="text-muted-foreground">Custom Engine Placeholder</p>
            <p className="text-xs text-muted-foreground mt-2">
              Add your custom engine implementation in the engines folder
            </p>
          </div>
        )}
      </div>
      
      <div>
        <Label htmlFor="evaluation-notes" className="mb-2 block">Evaluation Notes</Label>
        <Textarea
          id="evaluation-notes"
          placeholder="Add your notes, observations, and feedback about this puzzle engine here..."
          className="min-h-[120px]"
          value={notes[selectedEngine] || ''}
          onChange={(e) => handleNotesChange(selectedEngine, e.target.value)}
        />
      </div>
    </div>
  );
};

export default React.memo(PuzzleEnginePlayground);
