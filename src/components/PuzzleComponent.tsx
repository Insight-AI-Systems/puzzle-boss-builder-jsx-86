
import React, { useEffect, useRef } from 'react';
import * as headbreaker from 'headbreaker';

const PuzzleComponent: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear any existing content
    containerRef.current.innerHTML = '';
    
    // Create a new Headbreaker canvas with a 4x4 puzzle
    const canvas = new headbreaker.Canvas('puzzle-container', {
      width: 400,
      height: 400,
      pieceSize: 100,
      proximity: 20,
      borderFill: 10,
      strokeWidth: 1.5,
      lineSoftness: 0.18,
      outlineSoftness: 0,
    });
    
    // Create a 4x4 puzzle with 100x100px pieces
    const imagePuzzle = canvas.createImagePuzzle(4, 4);
    
    // Use a solid color for each piece as a placeholder
    // In a real implementation, you would use an actual image
    imagePuzzle.forEach((piece) => {
      const color = `hsl(${Math.random() * 360}, 80%, 60%)`;
      piece.fill = color;
      piece.strokeColor = '#000';
    });
    
    // Adjust piece positions and draw the puzzle
    canvas.adjustPieces(imagePuzzle);
    canvas.shuffle(imagePuzzle, 0.6);
    canvas.draw(imagePuzzle);
    
    // Make the pieces draggable
    canvas.attachSolvedValidator(imagePuzzle);
    canvas.snapDistance = 40;
    canvas.attachDragListeners(imagePuzzle);
    
    return () => {
      // Cleanup function if needed
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);
  
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">Jigsaw Puzzle Demo</h2>
      <div 
        className="border border-puzzle-aqua/40 bg-puzzle-black/50 rounded-lg p-4"
        style={{ width: '450px', height: '450px' }}
      >
        <div id="puzzle-container" ref={containerRef} />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Drag the pieces to solve the puzzle. Pieces will snap together when close enough.
      </p>
    </div>
  );
};

export default PuzzleComponent;
