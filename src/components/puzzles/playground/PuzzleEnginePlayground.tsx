
import React, { useState, useEffect, useCallback } from 'react';
import CustomPuzzleEngine from './engines/CustomPuzzleEngine';
import SVGJigsawPuzzle from './engines/SVGJigsawPuzzle';
import { Button } from '@/components/ui/button';
import { DEFAULT_IMAGES } from '@/components/puzzles/types/puzzle-types';
import EnhancedJigsawPuzzle from '@/components/puzzles/engines/EnhancedJigsawPuzzle';

export interface PuzzleEnginePlaygroundProps {
  isCondensed?: boolean;
  heroMode?: boolean;
  selectedImage?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  miniRows?: number;
  miniColumns?: number;
  showNumbersToggle?: boolean;
}

const PuzzleEnginePlayground: React.FC<PuzzleEnginePlaygroundProps> = ({
  isCondensed = false,
  heroMode = false,
  selectedImage = DEFAULT_IMAGES[0],
  difficulty = 'easy',
  miniRows,
  miniColumns,
  showNumbersToggle = false
}) => {
  const [engine, setEngine] = useState<'enhanced' | 'custom' | 'svg-jigsaw' | 'phaser'>('enhanced');
  const [showNumbers, setShowNumbers] = useState(false);

  const toggleNumbers = useCallback(() => {
    setShowNumbers(prev => !prev);
  }, []);

  const toggleEngine = useCallback(() => {
    setEngine(prev => {
      if (prev === 'enhanced') return 'phaser';
      if (prev === 'phaser') return 'svg-jigsaw';
      if (prev === 'svg-jigsaw') return 'custom';
      return 'enhanced';
    });
  }, []);

  // Calculate rows and columns based on difficulty
  const rows = miniRows || (difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5);
  const columns = miniColumns || (difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5);

  return (
    <div className="puzzle-engine-playground">
      {!isCondensed && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Puzzle Engine Playground</h2>
          <Button onClick={toggleEngine} variant="outline">
            Switch to {
              engine === 'enhanced' ? 'Phaser Jigsaw' : 
              engine === 'phaser' ? 'SVG Jigsaw' : 
              engine === 'svg-jigsaw' ? 'Legacy Jigsaw' : 
              'Enhanced Jigsaw'
            }
          </Button>
        </div>
      )}

      <div className="mt-4">
        {engine === 'enhanced' && (
          <EnhancedJigsawPuzzle
            imageUrl={selectedImage}
            rows={rows} 
            columns={columns}
            showNumbers={showNumbers}
            showGuide={true}
          />
        )}
        
        {engine === 'phaser' && (
          <div className="bg-muted/30 p-8 rounded-lg border border-dashed border-muted-foreground">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Phaser Puzzle Engine</h3>
              <p className="text-muted-foreground mb-4">
                The Phaser-based puzzle engine is currently being implemented and will be available soon.
              </p>
              <Button 
                variant="outline" 
                onClick={toggleEngine}
                className="mx-auto"
              >
                Try another engine
              </Button>
            </div>
          </div>
        )}
        
        {engine === 'custom' && (
          <CustomPuzzleEngine 
            imageUrl={selectedImage}
            rows={rows}
            columns={columns}
            showNumbers={showNumbers}
            onComplete={() => {}}
            onReset={() => {}}
          />
        )}
        
        {engine === 'svg-jigsaw' && (
          <SVGJigsawPuzzle 
            imageUrl={selectedImage}
            rows={rows}
            columns={columns}
            showNumbers={showNumbers}
            showGhost={true}
          />
        )}
      </div>

      {showNumbersToggle && (
        <Button onClick={toggleNumbers} variant="outline" size="sm" className="mt-4">
          {showNumbers ? 'Hide Numbers' : 'Show Numbers'}
        </Button>
      )}
    </div>
  );
};

export default PuzzleEnginePlayground;
