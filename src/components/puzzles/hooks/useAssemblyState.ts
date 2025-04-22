
import { useState, useCallback } from 'react';
import { PuzzlePiece } from '../types/puzzle-types';

export interface AssemblyState {
  grid: (number | null)[];
  stagedPieces: number[];
}

export function useAssemblyState(totalPieces: number) {
  const [assemblyState, setAssemblyState] = useState<AssemblyState>({
    grid: Array(totalPieces).fill(null),
    stagedPieces: Array.from({ length: totalPieces }, (_, i) => i)
  });

  const handlePieceDrop = useCallback((pieceId: number, targetCellIdx: number) => {
    setAssemblyState(prev => {
      const previousPieceId = prev.grid[targetCellIdx];
      const newGrid = [...prev.grid];
      let newStaged = [...prev.stagedPieces];

      if (previousPieceId === null) {
        // Place piece in empty cell
        newGrid[targetCellIdx] = pieceId;
        newStaged = newStaged.filter(id => id !== pieceId);
      } else if (previousPieceId !== pieceId) {
        // Swap: place new piece and return old to staging
        newGrid[targetCellIdx] = pieceId;
        newStaged = [
          ...newStaged.filter(id => id !== pieceId),
          previousPieceId
        ];
      }

      return {
        grid: newGrid,
        stagedPieces: newStaged
      };
    });
  }, []);

  const handlePieceSwap = useCallback((fromIdx: number, toIdx: number) => {
    setAssemblyState(prev => {
      const newGrid = [...prev.grid];
      const temp = newGrid[fromIdx];
      newGrid[fromIdx] = newGrid[toIdx];
      newGrid[toIdx] = temp;
      return { ...prev, grid: newGrid };
    });
  }, []);

  return {
    assemblyState,
    handlePieceDrop,
    handlePieceSwap
  };
}
