import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
// @ts-ignore - headbreaker library doesn't have TypeScript definitions
import * as headbreaker from 'headbreaker';

interface MinimalJigsawGameProps {
  imageUrl?: string;
  pieceCount?: 20 | 100 | 500;
  onComplete?: () => void;
}

export function MinimalJigsawGame({ 
  imageUrl = '/placeholder.svg', 
  pieceCount = 100,
  onComplete 
}: MinimalJigsawGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const puzzleRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      initializePuzzle();
    }
    
    return () => {
      if (puzzleRef.current) {
        puzzleRef.current.destroy?.();
      }
    };
  }, [imageUrl, pieceCount]);

  const initializePuzzle = async () => {
    setIsLoading(true);
    setError(null);
    setIsCompleted(false);

    try {
      const canvas = canvasRef.current;
      if (!canvas) throw new Error('Canvas not found');

      // Clear any existing puzzle
      if (puzzleRef.current) {
        puzzleRef.current.destroy?.();
      }

      // Set canvas size
      canvas.width = 800;
      canvas.height = 600;

      // Create headbreaker canvas - let the library handle everything
      const puzzleCanvas = new headbreaker.Canvas(canvas, {
        width: 800,
        height: 600,
        strokeWidth: 2,
        strokeColor: '#000000',
        borderFill: '#ffffff',
        preventOffstageDrag: true,
        fixed: false
      });

      // Load the image
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        try {
          // Calculate grid based on piece count - let headbreaker determine optimal layout
          const gridSize = Math.sqrt(pieceCount);
          const cols = Math.ceil(gridSize);
          const rows = Math.ceil(gridSize);

          // Create template with minimal configuration - use headbreaker defaults
          const template = new headbreaker.Template({
            width: 400,
            height: 400,
            pieceSize: 400 / Math.max(cols, rows), // Let headbreaker calculate optimal size
            proximity: 20 // Default snap distance
          });

          // Build the template grid
          template.build(rows, cols);

          // Use headbreaker manufacturer as intended - minimal configuration
          const puzzle = headbreaker.manufacturer
            .withTemplate(template)
            .withImage(img)
            .withCanvas(puzzleCanvas)
            .withPiecesCount({ x: cols, y: rows })
            .build();

          puzzleRef.current = puzzle;

          // Let headbreaker handle the shuffling with default parameters
          puzzle.shuffle();

          // Add completion listener - the only custom logic we need
          puzzle.onConnect(() => {
            if (puzzle.isValid()) {
              setIsCompleted(true);
              onComplete?.();
            }
          });

          setIsLoading(false);
          console.log('✅ Minimal puzzle created successfully');

        } catch (err) {
          console.error('❌ Error creating puzzle:', err);
          setError('Failed to create puzzle');
          setIsLoading(false);
        }
      };

      img.onerror = () => {
        setError('Failed to load image');
        setIsLoading(false);
      };

      img.src = imageUrl;

    } catch (err) {
      console.error('❌ Error initializing puzzle:', err);
      setError(`Failed to initialize: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    initializePuzzle();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div>Loading puzzle...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] space-y-4">
        <div className="text-red-600">Error: {error}</div>
        <Button onClick={initializePuzzle}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <Button onClick={handleReset} variant="outline">
          Reset Puzzle
        </Button>
        {isCompleted && (
          <div className="text-green-600 font-semibold">
            🎉 Puzzle Completed!
          </div>
        )}
      </div>
      
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          className="border border-gray-300 rounded"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>
    </div>
  );
}