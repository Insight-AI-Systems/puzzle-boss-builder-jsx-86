
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export interface PhaserPuzzleEngineProps {
  imageUrl: string;
  pieceCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  onError?: () => void;
}

const PhaserPuzzleEngine: React.FC<PhaserPuzzleEngineProps> = ({
  imageUrl,
  pieceCount,
  difficulty,
  onError
}) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeGame = async () => {
      try {
        setIsLoading(true);
        
        // Calculate grid size based on piece count
        const gridSize = Math.sqrt(pieceCount);
        
        console.log('Initializing Phaser puzzle engine with:', {
          imageUrl,
          pieceCount,
          gridSize,
          difficulty
        });
        
        // Simulate game initialization
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast.success(`Phaser puzzle loaded: ${gridSize}x${gridSize} (${difficulty})`);
        setIsLoading(false);
        
      } catch (error) {
        console.error('Failed to initialize Phaser puzzle:', error);
        toast.error('Failed to load puzzle engine');
        onError?.();
      }
    };

    if (gameRef.current) {
      initializeGame();
    }

    return () => {
      // Cleanup game instance
    };
  }, [imageUrl, pieceCount, difficulty, onError]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div 
        ref={gameRef}
        className="relative bg-gray-100 rounded-lg border-2 border-dashed border-gray-300"
        style={{ minHeight: '600px' }}
      >
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-puzzle-aqua mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading Phaser Puzzle Engine...</p>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-8">
              <h3 className="text-xl font-semibold mb-2">Phaser Puzzle Engine</h3>
              <p className="text-muted-foreground mb-4">
                {Math.sqrt(pieceCount)}×{Math.sqrt(pieceCount)} puzzle ({difficulty})
              </p>
              <img 
                src={imageUrl} 
                alt="Puzzle preview"
                className="max-w-sm max-h-64 object-contain mx-auto rounded-lg shadow-md"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhaserPuzzleEngine;
