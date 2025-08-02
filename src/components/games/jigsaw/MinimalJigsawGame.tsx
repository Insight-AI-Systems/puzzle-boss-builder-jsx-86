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

      console.log('🔍 Headbreaker object:', headbreaker);
      console.log('🔍 Available methods:', Object.keys(headbreaker));

      // Check if headbreaker is properly loaded
      if (!headbreaker || !headbreaker.Canvas) {
        throw new Error('Headbreaker library not properly loaded');
      }

      // Load the image first
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        try {
          console.log('📸 Image loaded successfully');

          // Calculate grid based on piece count
          const gridSize = Math.sqrt(pieceCount);
          const cols = Math.ceil(gridSize);
          const rows = Math.ceil(gridSize);

          console.log(`🧩 Creating ${rows}x${cols} puzzle (${pieceCount} pieces)`);

          // Create puzzle canvas with proper configuration
          const puzzleCanvas = new headbreaker.Canvas(canvas, {
            width: 800,
            height: 600,
            strokeWidth: 2,
            strokeColor: '#000000',
            borderFill: '#ffffff'
          });

          // Create template with basic configuration
          const template = new headbreaker.Template({
            width: 400,
            height: 400,
            pieceSize: 40
          });

          // Build the template
          template.build(rows, cols);

          // Create the puzzle using the manufacturer pattern
          const puzzle = headbreaker.manufacturer
            .withTemplate(template)
            .withImage(img)
            .withCanvas(puzzleCanvas)
            .build();

          puzzleRef.current = puzzle;

          // Shuffle the pieces
          puzzle.shuffle();

          console.log('✅ Puzzle created and shuffled');

          // Add completion listener
          puzzle.onConnect(() => {
            console.log('🔗 Pieces connected');
            if (puzzle.isValid()) {
              console.log('🎉 Puzzle completed!');
              setIsCompleted(true);
              onComplete?.();
            }
          });

          setIsLoading(false);

        } catch (err) {
          console.error('❌ Error creating puzzle:', err);
          setError('Failed to create puzzle');
          setIsLoading(false);
        }
      };

      img.onerror = () => {
        console.error('❌ Failed to load image:', imageUrl);
        setError('Failed to load image');
        setIsLoading(false);
      };

      console.log('📥 Loading image:', imageUrl);
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