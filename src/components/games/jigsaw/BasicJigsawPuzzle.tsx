import React, { useEffect, useRef } from 'react';
// @ts-ignore - headbreaker library doesn't have TypeScript definitions
import * as headbreaker from 'headbreaker';

interface BasicJigsawPuzzleProps {
  imageUrl: string;
  pieceCount?: number;
}

export function BasicJigsawPuzzle({ imageUrl, pieceCount = 20 }: BasicJigsawPuzzleProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing content
    containerRef.current.innerHTML = '';

    // Load image and create puzzle
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        console.log('Image loaded, creating puzzle...');
        
        // Calculate grid size based on piece count
        const gridSize = Math.sqrt(pieceCount);
        const cols = Math.ceil(gridSize);
        const rows = Math.ceil(gridSize);
        
        // Create the puzzle canvas
        const canvas = headbreaker.Canvas(containerRef.current, {
          width: 800,
          height: 600,
          imageUrl: imageUrl,
          pieceSize: 100,
          proximity: 20,
          borderFill: 10,
          strokeWidth: 2,
          lineSoftness: 0.18
        });

        // Create puzzle with the specified grid
        const puzzle = headbreaker.Puzzle(canvas, {
          horizontalPiecesCount: cols,
          verticalPiecesCount: rows
        });

        // Generate and shuffle the puzzle
        puzzle.autogenerate();
        puzzle.shuffle(0.8);
        puzzle.draw();

        console.log('Puzzle created successfully!');
        
      } catch (error) {
        console.error('Error creating puzzle:', error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div>Error: ${error}</div>`;
        }
      }
    };

    img.onerror = () => {
      console.error('Failed to load image');
      if (containerRef.current) {
        containerRef.current.innerHTML = '<div>Failed to load image</div>';
      }
    };

    img.src = imageUrl;

  }, [imageUrl, pieceCount]);

  return (
    <div className="w-full h-full min-h-[600px] flex justify-center items-center">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}