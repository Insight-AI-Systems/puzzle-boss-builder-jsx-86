
import React, { useState, useCallback } from "react";
import PuzzleEnginePlayground from "./PuzzleEnginePlayground";

// Borrow config and images directly from PuzzleEnginePlayground for consistency
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

const DIFFICULTY_PRESETS = [
  { value: 'easy', label: 'Easy', rows: 3, columns: 3 },
  { value: 'medium', label: 'Medium', rows: 4, columns: 4 },
  { value: 'hard', label: 'Hard', rows: 5, columns: 5 }
];

const HeroPuzzleMini: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState(SAMPLE_IMAGES[0].id);
  const [difficulty, setDifficulty] = useState(DIFFICULTY_PRESETS[0].value); // Default to easy for hero
  const [resetKey, setResetKey] = useState(0);

  const currentImage = SAMPLE_IMAGES.find(img => img.id === selectedImage)?.url || SAMPLE_IMAGES[0].url;
  const currentDifficultyPreset = DIFFICULTY_PRESETS.find(d => d.value === difficulty) || DIFFICULTY_PRESETS[0];

  const handleResetPuzzle = useCallback(() => {
    setResetKey(prev => prev + 1);
  }, []);

  // Only render the core puzzle itself, drop advanced controls/notes for hero
  return (
    <div style={{
      width: 300, 
      maxWidth: '90vw', 
      margin: '0 auto'
    }}>
      <div className="mb-2 text-xs text-center text-muted-foreground font-semibold">
        Try Me! Mini Puzzle Demo
      </div>
      <div style={{ minHeight: 270, position: 'relative' }}>
        <PuzzleEnginePlayground
          heroMode
          isCondensed
          key={resetKey + selectedImage + difficulty}
          selectedImage={currentImage}
          difficulty={difficulty}
          miniRows={currentDifficultyPreset.rows}
          miniColumns={currentDifficultyPreset.columns}
        />
      </div>
      <div className="flex justify-between mt-2">
        <select 
          value={selectedImage}
          onChange={e => setSelectedImage(e.target.value)}
          className="text-xs rounded px-1 py-0.5 border bg-muted/40"
        >
          {SAMPLE_IMAGES.map(img => (
            <option value={img.id} key={img.id}>{img.alt}</option>
          ))}
        </select>
        <select 
          value={difficulty}
          onChange={e => setDifficulty(e.target.value)}
          className="text-xs rounded px-1 py-0.5 border bg-muted/40"
        >
          {DIFFICULTY_PRESETS.map(preset => (
            <option value={preset.value} key={preset.value}>
              {preset.label} ({preset.rows}x{preset.columns})
            </option>
          ))}
        </select>
        <button
          className="ml-1 text-xs border px-2 rounded bg-background hover:bg-accent transition"
          onClick={handleResetPuzzle}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default HeroPuzzleMini;
