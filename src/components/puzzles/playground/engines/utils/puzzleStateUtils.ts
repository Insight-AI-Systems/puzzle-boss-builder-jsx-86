
import { useState } from 'react';

export type AssemblyPiece = {
  id: number;
  isLocked: boolean;
};

export function usePuzzleState(rows: number, columns: number) {
  const total = rows * columns;
  
  // Staging area pieces: only those NOT placed
  const [stagedPieces, setStagedPieces] = useState<number[]>([]);
  // Assembly area: each slot is {id: pieceId, isLocked} or null for empty
  const [placedPieces, setPlacedPieces] = useState<(AssemblyPiece | null)[]>([]);
  
  // Reset puzzle state
  const resetPuzzleState = () => {
    setStagedPieces(Array.from({ length: total }, (_, i) => i));
    setPlacedPieces(Array.from({ length: total }, () => null));
  };
  
  // Check if puzzle is complete
  const checkPuzzleCompletion = () => {
    return placedPieces.every((entry, idx) => entry && entry.isLocked && entry.id === idx);
  };
  
  return {
    stagedPieces,
    setStagedPieces,
    placedPieces,
    setPlacedPieces,
    resetPuzzleState,
    checkPuzzleCompletion
  };
}
