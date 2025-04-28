
import React, { useState, useEffect, useCallback } from 'react';
import CustomPuzzleEngine from './engines/CustomPuzzleEngine';
import SVGJigsawPuzzle from './engines/SVGJigsawPuzzle';
import { Button } from '@/components/ui/button';
import { DEFAULT_IMAGES } from '@/components/puzzles/types/puzzle-types';

export interface PuzzleEnginePlaygroundProps {
  isCondensed?: boolean;
  heroMode?: boolean;  // Add this prop to the interface
  selectedImage?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  miniRows?: number;
  miniColumns?: number;
  showNumbersToggle?: boolean;
}

const PuzzleEnginePlayground: React.FC<PuzzleEnginePlaygroundProps> = ({
  isCondensed = false,
  heroMode = false, // Default value for heroMode
  selectedImage = DEFAULT_IMAGES[0],
  difficulty = 'easy',
  miniRows,
  miniColumns,
  showNumbersToggle = false
}) => {
  const [engine, setEngine] = useState<'custom' | 'svg-jigsaw'>('svg-jigsaw');
  const [showNumbers, setShowNumbers] = useState(false);

  const toggleNumbers = useCallback(() => {
    setShowNumbers(prev => !prev);
  }, []);

  const toggleEngine = useCallback(() => {
    setEngine(prev => prev === 'custom' ? 'svg-jigsaw' : 'custom');
  }, []);

  return (
    <div className="puzzle-engine-playground">
      {!isCondensed && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Puzzle Engine Playground</h2>
          <Button onClick={toggleEngine} variant="outline">
            Switch to {engine === 'custom' ? 'SVG Jigsaw' : 'Legacy Jigsaw'}
          </Button>
        </div>
      )}

      {engine === 'custom' ? (
        <CustomPuzzleEngine 
          imageUrl={selectedImage}
          rows={miniRows || (difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5)}
          columns={miniColumns || (difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5)}
          showNumbers={showNumbers}
          onComplete={() => {}}
          onReset={() => {}}
        />
      ) : (
        <SVGJigsawPuzzle 
          imageUrl={selectedImage}
          rows={miniRows || (difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5)}
          columns={miniColumns || (difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5)}
          showNumbers={showNumbers}
          showGhost={true}
        />
      )}

      {showNumbersToggle && (
        <Button onClick={toggleNumbers} variant="outline" size="sm" className="mt-2">
          {showNumbers ? 'Hide Numbers' : 'Show Numbers'}
        </Button>
      )}
    </div>
  );
};

export default PuzzleEnginePlayground;
