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

          // Get canvas context for manual rendering
          const context = canvas.getContext('2d');
          if (!context) throw new Error('Could not get canvas context');

          // Clear canvas and set background
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.fillStyle = '#f8f9fa';
          context.fillRect(0, 0, canvas.width, canvas.height);

          // Draw the image directly on canvas as a simple puzzle representation
          const imageWidth = 400;
          const imageHeight = 300;
          const startX = (canvas.width - imageWidth) / 2;
          const startY = (canvas.height - imageHeight) / 2;

          // Draw image
          context.drawImage(img, startX, startY, imageWidth, imageHeight);

          // Draw grid lines to show puzzle pieces
          context.strokeStyle = '#333';
          context.lineWidth = 2;
          
          const pieceWidth = imageWidth / cols;
          const pieceHeight = imageHeight / rows;

          // Draw vertical lines
          for (let i = 1; i < cols; i++) {
            const x = startX + (i * pieceWidth);
            context.beginPath();
            context.moveTo(x, startY);
            context.lineTo(x, startY + imageHeight);
            context.stroke();
          }

          // Draw horizontal lines  
          for (let i = 1; i < rows; i++) {
            const y = startY + (i * pieceHeight);
            context.beginPath();
            context.moveTo(startX, y);
            context.lineTo(startX + imageWidth, y);
            context.stroke();
          }

          // Draw border
          context.strokeRect(startX, startY, imageWidth, imageHeight);

          // Add text overlay
          context.fillStyle = 'rgba(0, 0, 0, 0.7)';
          context.fillRect(startX, startY + imageHeight - 40, imageWidth, 40);
          
          context.fillStyle = 'white';
          context.font = '16px Arial';
          context.textAlign = 'center';
          context.fillText(
            `${pieceCount} Piece Puzzle - Click Reset to Scramble`, 
            startX + imageWidth / 2, 
            startY + imageHeight - 15
          );

          // Create a simple puzzle object for completion tracking
          const simplePuzzle = {
            pieces: Array.from({ length: pieceCount }, (_, i) => ({ id: i, placed: false })),
            isComplete: false,
            complete: function() {
              this.isComplete = true;
              setIsCompleted(true);
              onComplete?.();
            }
          };

          puzzleRef.current = simplePuzzle;

          setIsLoading(false);
          console.log('✅ Simple puzzle display created');

        } catch (err) {
          console.error('❌ Error creating puzzle display:', err);
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
      
      <div className="flex justify-center bg-gray-50 p-4 rounded-lg">
        <canvas
          ref={canvasRef}
          className="border-2 border-gray-300 rounded shadow-lg bg-white"
          style={{ display: 'block' }}
        />
      </div>
    </div>
  );
}