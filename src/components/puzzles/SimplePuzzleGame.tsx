
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface PuzzlePiece {
  id: string;
  position: number;
  color: string;
  isDragging: boolean;
}

const SimplePuzzleGame: React.FC = () => {
  const [pieces, setPieces] = useState<PuzzlePiece[]>(() => {
    // Create a 3x3 grid of puzzle pieces
    const initialPieces = [];
    for (let i = 0; i < 9; i++) {
      initialPieces.push({
        id: `piece-${i}`,
        position: i,
        color: `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`,
        isDragging: false
      });
    }
    return initialPieces;
  });

  const [draggedPiece, setDraggedPiece] = useState<PuzzlePiece | null>(null);

  // Handle both mouse and touch events for better compatibility
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, piece: PuzzlePiece) => {
    e.preventDefault();
    console.log('Drag start:', piece.id);
    setDraggedPiece(piece);
    
    // Update piece state
    setPieces(pieces.map(p => 
      p.id === piece.id 
        ? { ...p, isDragging: true } 
        : p
    ));
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent, targetIndex: number) => {
    e.preventDefault();
    // Optional: Add hover effects or visual feedback here
  };

  const handleDrop = (e: React.MouseEvent | React.TouchEvent, targetIndex: number) => {
    e.preventDefault();
    
    if (!draggedPiece) {
      console.log('No dragged piece to drop');
      return;
    }
    
    // Find the source piece position
    const sourceIndex = pieces.findIndex(p => p.id === draggedPiece.id);
    
    if (sourceIndex === -1) {
      console.log('Source piece not found');
      return;
    }
    
    console.log(`Swapping piece from position ${sourceIndex} to ${targetIndex}`);
    
    // Create a new array with swapped positions
    const newPieces = [...pieces];
    const temp = newPieces[sourceIndex];
    newPieces[sourceIndex] = newPieces[targetIndex];
    newPieces[targetIndex] = temp;
    
    // Update position property
    newPieces[sourceIndex].position = sourceIndex;
    newPieces[targetIndex].position = targetIndex;
    
    // Reset dragging state
    setPieces(newPieces.map(p => ({ ...p, isDragging: false })));
    setDraggedPiece(null);
  };
  
  const handleDragEnd = () => {
    console.log('Drag end');
    setPieces(pieces.map(p => ({ ...p, isDragging: false })));
    setDraggedPiece(null);
  };

  const handlePieceClick = (piece: PuzzlePiece) => {
    console.log('Piece clicked:', piece.id);
    
    // For touch screens and dev panel - implement click to select and then click to place
    if (draggedPiece && draggedPiece.id !== piece.id) {
      console.log(`Swapping pieces via click: ${draggedPiece.id} with ${piece.id}`);
      
      // Find the source and target indices
      const sourceIndex = pieces.findIndex(p => p.id === draggedPiece.id);
      const targetIndex = pieces.findIndex(p => p.id === piece.id);
      
      if (sourceIndex !== -1 && targetIndex !== -1) {
        // Create a new array with swapped positions
        const newPieces = [...pieces];
        const temp = newPieces[sourceIndex];
        newPieces[sourceIndex] = newPieces[targetIndex];
        newPieces[targetIndex] = temp;
        
        // Update position property
        newPieces[sourceIndex].position = sourceIndex;
        newPieces[targetIndex].position = targetIndex;
        
        // Reset dragging state
        setPieces(newPieces.map(p => ({ ...p, isDragging: false })));
        setDraggedPiece(null);
      }
    } else {
      // Select the piece
      setDraggedPiece(piece);
      setPieces(pieces.map(p => 
        p.id === piece.id 
          ? { ...p, isDragging: true } 
          : p
      ));
    }
  };

  const handleShuffleClick = () => {
    console.log("Shuffling pieces");
    setPieces(prevPieces => {
      const shuffled = [...prevPieces].sort(() => Math.random() - 0.5);
      // Update positions after shuffle
      return shuffled.map((p, index) => ({
        ...p,
        position: index,
        isDragging: false
      }));
    });
    setDraggedPiece(null);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4">
        <Button 
          onClick={handleShuffleClick}
          className="bg-puzzle-gold hover:bg-puzzle-gold/80 text-black"
        >
          Shuffle Pieces
        </Button>
      </div>
      
      <div 
        className="grid grid-cols-3 gap-2 bg-puzzle-black/60 p-4 rounded-lg border-2 border-puzzle-aqua"
        style={{ width: '360px', height: '360px' }}
      >
        {pieces.map((piece, index) => (
          <div 
            key={piece.id}
            onMouseDown={(e) => handleDragStart(e, piece)}
            onTouchStart={(e) => handleDragStart(e, piece)}
            onMouseOver={(e) => handleMove(e, index)}
            onMouseUp={(e) => handleDrop(e, index)}
            onTouchEnd={(e) => handleDrop(e, index)}
            onClick={() => handlePieceClick(piece)}
            className={`flex items-center justify-center rounded-lg cursor-pointer shadow-md transition-all ${
              piece.isDragging ? 'opacity-50 ring-2 ring-white' : 'opacity-100'
            }`}
            style={{ 
              backgroundColor: piece.color,
              transform: piece.isDragging ? 'scale(0.95)' : 'scale(1)',
              width: '100%',
              height: '100%',
            }}
          >
            <span className="text-lg font-bold text-white drop-shadow-md">
              {index + 1}
            </span>
          </div>
        ))}
      </div>
      
      <p className="mt-4 text-sm text-puzzle-aqua">
        Click or drag pieces to rearrange the puzzle
      </p>
    </div>
  );
};

export default SimplePuzzleGame;
