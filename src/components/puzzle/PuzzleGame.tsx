
import React, { useEffect, useRef, useState } from 'react';
import * as headbreaker from 'headbreaker';

interface PuzzleGameProps {
  width?: number;
  height?: number;
  rows?: number;
  columns?: number;
  imageSrc?: string;
}

const PuzzleGame: React.FC<PuzzleGameProps> = ({
  width = 800,
  height = 600,
  rows = 4,
  columns = 4,
  imageSrc = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear any existing content
    containerRef.current.innerHTML = '';

    // Generate a unique ID for this puzzle instance
    const puzzleId = `puzzle-container-${Math.random().toString(36).substring(2, 11)}`;
    containerRef.current.id = puzzleId;
    
    // Wait for DOM to be fully ready
    const timer = setTimeout(() => {
      try {
        // Create a new Headbreaker canvas
        const puzzleCanvas = new headbreaker.Canvas(puzzleId, {
          width,
          height,
          pieceSize: 100,
          proximity: 20,
          borderFill: 10,
          strokeWidth: 2,
          lineSoftness: 0.18,
        });
        
        // Load image and create puzzle
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = imageSrc;
        
        img.onload = () => {
          try {
            const imagePuzzle = puzzleCanvas.createImagePuzzle(columns, rows, img);
            
            // Adjust piece positions and draw the puzzle
            puzzleCanvas.adjustPieces(imagePuzzle);
            puzzleCanvas.shuffle(imagePuzzle, 0.6);
            puzzleCanvas.draw(imagePuzzle);
            
            // Make the pieces draggable
            puzzleCanvas.attachSolvedValidator(imagePuzzle);
            puzzleCanvas.snapDistance = 40;
            puzzleCanvas.attachDragListeners(imagePuzzle);
            
            setIsLoaded(true);
            console.log('Puzzle successfully loaded');
          } catch (error) {
            console.error('Error creating image puzzle:', error);
            createFallbackPuzzle(puzzleCanvas);
          }
        };
        
        img.onerror = () => {
          console.error('Failed to load image');
          createFallbackPuzzle(puzzleCanvas);
        };
      } catch (error) {
        console.error('Error initializing canvas:', error);
      }
    }, 200); // Slightly longer delay to ensure DOM is ready
    
    // Helper function to create a fallback colored puzzle
    const createFallbackPuzzle = (canvas: headbreaker.Canvas) => {
      try {
        const colorPuzzle = canvas.createPuzzle(columns, rows);
        
        colorPuzzle.forEach((piece) => {
          const color = `hsl(${Math.random() * 360}, 80%, 60%)`;
          piece.fill = color;
          piece.strokeColor = '#000';
        });
        
        canvas.adjustPieces(colorPuzzle);
        canvas.shuffle(colorPuzzle, 0.6);
        canvas.draw(colorPuzzle);
        
        canvas.attachSolvedValidator(colorPuzzle);
        canvas.snapDistance = 40;
        canvas.attachDragListeners(colorPuzzle);
        
        setIsLoaded(true);
        console.log('Fallback puzzle loaded');
      } catch (error) {
        console.error('Error creating fallback puzzle:', error);
      }
    };
    
    return () => {
      clearTimeout(timer);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [width, height, rows, columns, imageSrc]);
  
  return (
    <div className="flex flex-col items-center">
      <div 
        className="border-2 border-puzzle-aqua rounded-lg bg-puzzle-black/50 shadow-lg p-4 my-4 overflow-hidden"
        style={{ width: `${width + 20}px`, height: `${height + 20}px` }}
      >
        {!isLoaded && (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-puzzle-aqua">Loading puzzle...</div>
          </div>
        )}
        <div ref={containerRef} className="w-full h-full" />
      </div>
      <div className="mt-4 text-center max-w-2xl">
        <h3 className="text-lg font-bold text-puzzle-aqua">How to Play</h3>
        <p className="text-sm text-muted-foreground">
          Drag the pieces to solve the puzzle. Pieces will snap together when close enough.
          Complete the puzzle to win!
        </p>
      </div>
    </div>
  );
};

export default PuzzleGame;
