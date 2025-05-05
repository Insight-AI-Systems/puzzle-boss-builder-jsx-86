
import React, { useState, useCallback, useMemo } from 'react';
import CustomPuzzleEngine from './engines/CustomPuzzleEngine';
import SVGJigsawPuzzle from './engines/SVGJigsawPuzzle';
import { Button } from '@/components/ui/button';
import { DEFAULT_IMAGES } from '@/components/puzzles/types/puzzle-types';
import EnhancedJigsawPuzzle from '@/components/puzzles/engines/EnhancedJigsawPuzzle';
import PhaserPuzzleEngine from './engines/PhaserPuzzleEngine';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

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
      if (prev === 'enhanced') {
        // Skip phaser for now since it's coming soon
        return 'svg-jigsaw';
      }
      if (prev === 'svg-jigsaw') return 'custom';
      if (prev === 'custom') return 'enhanced';
      return 'enhanced';
    });
  }, []);

  const handlePhaserClick = useCallback(() => {
    toast.info("Phaser Engine Coming Soon", {
      description: "We're working on implementing this exciting new puzzle engine. Please check back later!"
    });
  }, []);

  // Calculate rows and columns based on difficulty
  const rows = miniRows || (difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5);
  const columns = miniColumns || (difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5);

  // Generate a unique puzzle ID for the Phaser engine
  const phaserPuzzleId = useMemo(() => {
    // Create a unique ID that changes when the puzzle parameters change
    return `phaser-${rows}x${columns}-${difficulty}-${selectedImage.split('/').pop()}-${Date.now()}`;
  }, [rows, columns, difficulty, selectedImage]);

  return (
    <div className="puzzle-engine-playground">
      {!isCondensed && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Puzzle Engine Playground</h2>
          <div className="flex gap-2">
            <Button onClick={toggleEngine} variant="outline">
              Switch to {
                engine === 'enhanced' ? 'SVG Jigsaw' : 
                engine === 'svg-jigsaw' ? 'Legacy Jigsaw' : 
                'Enhanced Jigsaw'
              }
            </Button>
            <Button 
              onClick={handlePhaserClick} 
              variant="outline"
              className="flex items-center gap-2 border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
            >
              <AlertCircle size={16} />
              <span>Phaser Engine (Coming Soon)</span>
            </Button>
          </div>
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
          <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-amber-300 bg-amber-50 rounded-lg text-center">
            <AlertCircle className="text-amber-600 mb-3" size={48} />
            <h3 className="text-xl font-semibold text-amber-800">Phaser Engine Coming Soon</h3>
            <p className="text-amber-700 max-w-md mt-2">
              We're working on implementing this exciting new puzzle engine with advanced features and improved performance.
              Please check back later!
            </p>
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
