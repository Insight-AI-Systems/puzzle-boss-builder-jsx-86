
import { useState, useEffect } from 'react';
import { SimplePuzzlePiece } from '../types/simple-puzzle-types';

export const useSimplePuzzlePieces = (rows: number, columns: number) => {
  const [pieces, setPieces] = useState<SimplePuzzlePiece[]>([]);
  const [isSolved, setIsSolved] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [draggedPieceId, setDraggedPieceId] = useState<string | null>(null);

  // Initialize pieces
  useEffect(() => {
    const totalPieces = rows * columns;
    const initialPieces: SimplePuzzlePiece[] = [];
    
    for (let i = 0; i < totalPieces; i++) {
      initialPieces.push({
        id: `piece-${i}`,
        position: -1,
        originalPosition: i,
        color: `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`,
        isDragging: false
      });
    }
    
    setPieces(initialPieces);
  }, [rows, columns]);

  // Check for puzzle completion
  useEffect(() => {
    if (pieces.length === 0) return;
    
    const allCorrect = pieces.every(piece => {
      const pieceNumber = parseInt(piece.id.split('-')[1]);
      return piece.position === pieceNumber;
    });
    
    if (allCorrect && moveCount > 0) {
      setIsSolved(true);
      console.log('Puzzle solved!');
    }
  }, [pieces, moveCount]);

  return {
    pieces,
    setPieces,
    isSolved,
    setIsSolved,
    moveCount,
    setMoveCount,
    draggedPieceId,
    setDraggedPieceId,
  };
};
