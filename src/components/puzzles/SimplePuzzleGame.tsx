
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';

interface PuzzlePiece {
  id: string;
  position: number;
  color: string;
  isDragging: boolean;
}

const SimplePuzzleGame: React.FC = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
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
  const [moveCount, setMoveCount] = useState(0);
  const [isSolved, setIsSolved] = useState(false);

  // Check if puzzle is solved (each piece is in its correct position)
  useEffect(() => {
    const solved = pieces.every((piece, index) => {
      const pieceNumber = parseInt(piece.id.split('-')[1]);
      return pieceNumber === index;
    });
    
    if (solved && !isSolved && moveCount > 0) {
      setIsSolved(true);
      toast({
        title: "Puzzle Solved!",
        description: `You completed the puzzle in ${moveCount} moves.`,
        variant: "default",
      });
    }
  }, [pieces, isSolved, moveCount, toast]);

  // Handle both mouse and touch events for better compatibility
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, piece: PuzzlePiece) => {
    if (isSolved) return; // Prevent interactions if puzzle is solved
    
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
    // Provide visual feedback on hover
    if (draggedPiece && !isMobile) {
      // Optional: Add more hover effects or visual feedback here
    }
  };

  const handleDrop = (e: React.MouseEvent | React.TouchEvent, targetIndex: number) => {
    e.preventDefault();
    
    if (!draggedPiece || isSolved) {
      return;
    }
    
    // Find the source piece position
    const sourceIndex = pieces.findIndex(p => p.id === draggedPiece.id);
    
    if (sourceIndex === -1) {
      console.log('Source piece not found');
      return;
    }
    
    if (sourceIndex !== targetIndex) {
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
      
      // Increment move count
      setMoveCount(prev => prev + 1);
    } else {
      // Reset dragging state without counting as a move
      setPieces(pieces.map(p => ({ ...p, isDragging: false })));
      setDraggedPiece(null);
    }
  };
  
  const handleDragEnd = () => {
    if (isSolved) return;
    
    console.log('Drag end');
    setPieces(pieces.map(p => ({ ...p, isDragging: false })));
    setDraggedPiece(null);
  };

  const handlePieceClick = (piece: PuzzlePiece) => {
    if (isSolved) return;
    
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
        
        // Increment move count
        setMoveCount(prev => prev + 1);
      }
    } else {
      // Select or deselect the piece
      if (draggedPiece?.id === piece.id) {
        // Deselect if clicking the same piece
        setPieces(pieces.map(p => ({ ...p, isDragging: false })));
        setDraggedPiece(null);
      } else {
        // Select a new piece
        setDraggedPiece(piece);
        setPieces(pieces.map(p => 
          p.id === piece.id 
            ? { ...p, isDragging: true } 
            : { ...p, isDragging: false }
        ));
      }
    }
  };

  const handleShuffleClick = () => {
    if (isSolved) {
      setIsSolved(false);
    }
    
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
    setMoveCount(0);
  };

  // Mobile-friendly navigation using directional buttons
  const handleDirectionalMove = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!draggedPiece || isSolved) return;
    
    const sourceIndex = pieces.findIndex(p => p.id === draggedPiece.id);
    if (sourceIndex === -1) return;
    
    const gridSize = 3; // 3x3 grid
    const row = Math.floor(sourceIndex / gridSize);
    const col = sourceIndex % gridSize;
    
    let targetRow = row;
    let targetCol = col;
    
    switch (direction) {
      case 'up':
        targetRow = Math.max(0, row - 1);
        break;
      case 'down':
        targetRow = Math.min(gridSize - 1, row + 1);
        break;
      case 'left':
        targetCol = Math.max(0, col - 1);
        break;
      case 'right':
        targetCol = Math.min(gridSize - 1, col + 1);
        break;
    }
    
    const targetIndex = targetRow * gridSize + targetCol;
    
    // Only process if we're actually moving to a different position
    if (targetIndex !== sourceIndex) {
      handleDrop({ preventDefault: () => {} } as React.MouseEvent, targetIndex);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex justify-between w-full max-w-[360px]">
        <div className="text-sm text-puzzle-aqua">
          Moves: {moveCount}
        </div>
        <Button 
          onClick={handleShuffleClick}
          className="bg-puzzle-gold hover:bg-puzzle-gold/80 text-black"
        >
          <Shuffle className="w-4 h-4 mr-2" />
          Shuffle
        </Button>
      </div>
      
      <div 
        className={`grid grid-cols-3 gap-2 bg-puzzle-black/60 p-4 rounded-lg border-2 
          ${isSolved ? 'border-puzzle-gold animate-pulse' : 'border-puzzle-aqua'}
          ${isMobile ? 'w-[300px] h-[300px]' : 'w-[360px] h-[360px]'}`}
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
            className={`flex items-center justify-center rounded-lg cursor-pointer shadow-md transition-all
              ${piece.isDragging ? 'ring-2 ring-white scale-95' : 'scale-100'}
              ${isSolved ? 'ring-1 ring-puzzle-gold/50' : ''}`}
            style={{ 
              backgroundColor: piece.color,
              opacity: piece.isDragging ? '0.8' : '1',
              width: '100%',
              height: '100%',
              transform: `${piece.isDragging ? 'scale(0.95)' : 'scale(1)'}`,
            }}
          >
            <span className={`text-lg font-bold text-white drop-shadow-md ${piece.isDragging ? 'scale-110' : ''}`}>
              {parseInt(piece.id.split('-')[1]) + 1}
            </span>
          </div>
        ))}
      </div>
      
      {/* Mobile-friendly directional controls */}
      {(isMobile || draggedPiece) && !isSolved && (
        <div className="mt-4 grid grid-cols-3 gap-2 w-[200px]">
          <div></div>
          <Button 
            size="icon" 
            variant="outline" 
            onClick={() => handleDirectionalMove('up')}
            className="aspect-square"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <div></div>
          <Button 
            size="icon" 
            variant="outline" 
            onClick={() => handleDirectionalMove('left')}
            className="aspect-square"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center justify-center text-xs text-puzzle-aqua">
            {draggedPiece ? `Move ${parseInt(draggedPiece.id.split('-')[1]) + 1}` : 'Select a piece'}
          </div>
          <Button 
            size="icon" 
            variant="outline" 
            onClick={() => handleDirectionalMove('right')}
            className="aspect-square"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div></div>
          <Button 
            size="icon" 
            variant="outline" 
            onClick={() => handleDirectionalMove('down')}
            className="aspect-square"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <div></div>
        </div>
      )}
      
      <p className="mt-4 text-sm text-puzzle-aqua">
        {isSolved 
          ? "Puzzle solved! Shuffle to play again."
          : isMobile 
            ? "Tap a piece to select, then tap another to swap"
            : "Click or drag pieces to rearrange the puzzle"
        }
      </p>
      
      {isSolved && (
        <div className="mt-2 text-puzzle-gold font-bold animate-pulse">
          🏆 Puzzle Solved in {moveCount} moves! 🏆
        </div>
      )}
    </div>
  );
};

export default SimplePuzzleGame;
