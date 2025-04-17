
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
  const [canvas, setCanvas] = useState<headbreaker.Canvas | null>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear any existing content
    containerRef.current.innerHTML = '';
    
    // Create a new Headbreaker canvas
    const puzzleCanvas = new headbreaker.Canvas('puzzle-container', {
      width,
      height,
      pieceSize: 100,
      proximity: 20,
      borderFill: 10,
      strokeWidth: 2,
      lineSoftness: 0.18,
    });
    
    setCanvas(puzzleCanvas);
    
    // Load image and create puzzle once image is loaded
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageSrc;
    
    img.onload = () => {
      // Create puzzle with the loaded image
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
      } catch (error) {
        console.error('Error creating puzzle:', error);
        
        // Fallback to colored pieces if image loading fails
        const colorPuzzle = puzzleCanvas.createPuzzle(columns, rows);
        
        colorPuzzle.forEach((piece) => {
          const color = `hsl(${Math.random() * 360}, 80%, 60%)`;
          piece.fill = color;
          piece.strokeColor = '#000';
        });
        
        puzzleCanvas.adjustPieces(colorPuzzle);
        puzzleCanvas.shuffle(colorPuzzle, 0.6);
        puzzleCanvas.draw(colorPuzzle);
        
        puzzleCanvas.attachSolvedValidator(colorPuzzle);
        puzzleCanvas.snapDistance = 40;
        puzzleCanvas.attachDragListeners(colorPuzzle);
        
        setIsLoaded(true);
      }
    };
    
    img.onerror = () => {
      console.error('Failed to load image');
      
      // Create a fallback colored puzzle
      const colorPuzzle = puzzleCanvas.createPuzzle(columns, rows);
      
      colorPuzzle.forEach((piece) => {
        const color = `hsl(${Math.random() * 360}, 80%, 60%)`;
        piece.fill = color;
        piece.strokeColor = '#000';
      });
      
      puzzleCanvas.adjustPieces(colorPuzzle);
      puzzleCanvas.shuffle(colorPuzzle, 0.6);
      puzzleCanvas.draw(colorPuzzle);
      
      puzzleCanvas.attachSolvedValidator(colorPuzzle);
      puzzleCanvas.snapDistance = 40;
      puzzleCanvas.attachDragListeners(colorPuzzle);
      
      setIsLoaded(true);
    };
    
    return () => {
      // Cleanup function
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
        <div id="puzzle-container" ref={containerRef} className="w-full h-full" />
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
