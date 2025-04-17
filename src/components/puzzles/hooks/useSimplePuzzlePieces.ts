
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SimplePuzzlePiece } from '../types/simple-puzzle-types';

export const useSimplePuzzlePieces = () => {
  const { toast } = useToast();
  const [pieces, setPieces] = useState<SimplePuzzlePiece[]>(() => {
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

  const [draggedPiece, setDraggedPiece] = useState<SimplePuzzlePiece | null>(null);
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

  // Shuffle pieces
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
  
  return {
    pieces,
    setPieces,
    draggedPiece,
    setDraggedPiece,
    moveCount,
    setMoveCount,
    isSolved,
    setIsSolved,
    handleShuffleClick,
  };
};
