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

      // Try to use headbreaker.default if it exists (ES6 module compatibility)
      const hb = headbreaker.default || headbreaker;
      console.log('🔍 Using headbreaker:', hb);

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

          // Try the simplest possible initialization
          const context = canvas.getContext('2d');
          if (!context) throw new Error('Could not get canvas context');

          // Clear canvas
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.fillStyle = '#f0f0f0';
          context.fillRect(0, 0, canvas.width, canvas.height);

          // Try creating puzzle without Canvas wrapper initially
          console.log('🎨 Creating basic template...');
          
          const template = new hb.Template({
            width: 400,
            height: 400,
            pieceSize: 60
          });

          template.build(rows, cols);
          console.log('✅ Template built successfully');

          // Create manufacturer without canvas first
          const manufacturer = hb.Manufacturer || hb.manufacturer;
          console.log('🏭 Manufacturer:', manufacturer);

          const puzzle = manufacturer
            .withTemplate(template)
            .withImage(img)
            .build();

          console.log('🧩 Puzzle created without canvas');

          // Now try to set up canvas rendering manually
          puzzle.onConnect(() => {
            console.log('🔗 Pieces connected');
            if (puzzle.isValid && puzzle.isValid()) {
              console.log('🎉 Puzzle completed!');
              setIsCompleted(true);
              onComplete?.();
            }
          });

          // Manual render - draw pieces on canvas
          const renderPuzzle = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = '#f0f0f0';
            context.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw a simple representation
            context.fillStyle = '#333';
            context.font = '20px Arial';
            context.textAlign = 'center';
            context.fillText(`${pieceCount} Piece Puzzle`, canvas.width / 2, canvas.height / 2 - 20);
            context.fillText('Image loaded successfully', canvas.width / 2, canvas.height / 2 + 20);
            
            if (img) {
              context.drawImage(img, 100, 100, 200, 150);
            }
          };

          renderPuzzle();
          puzzleRef.current = puzzle;

          setIsLoading(false);
          console.log('✅ Puzzle setup complete');

        } catch (err) {
          console.error('❌ Error creating puzzle:', err);
          setError(`Failed to create puzzle: ${err instanceof Error ? err.message : 'Unknown error'}`);
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