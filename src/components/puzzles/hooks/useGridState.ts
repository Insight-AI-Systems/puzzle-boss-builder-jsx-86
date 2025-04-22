import { useState, useCallback, useEffect } from 'react';
import { BasePuzzlePiece } from '../types/puzzle-types';
import { 
  ensureGridIntegrity, 
  validatePuzzleState, 
  debugGridState 
} from '../utils/pieceStateManagement';

export function useGridState<T extends BasePuzzlePiece>(
  pieces: T[],
  rows: number,
  columns: number,
  setPieces: (pieces: T[] | ((prev: T[]) => T[])) => void
) {
  // Grid state - each cell contains a piece ID or null
  const [grid, setGrid] = useState<(number | null)[]>(Array(rows * columns).fill(null));
  
  // Initialize or update grid when pieces change
  useEffect(() => {
    const { updatedGrid, updatedPieces } = ensureGridIntegrity(pieces, grid);
    
    // Only update if something changed
    if (JSON.stringify(updatedGrid) !== JSON.stringify(grid)) {
      setGrid(updatedGrid);
    }
    
    // Only update pieces if they changed
    if (JSON.stringify(updatedPieces) !== JSON.stringify(pieces)) {
      setPieces(updatedPieces);
    }
  }, [pieces]);
  
  // Handle piece drop onto grid
  const handlePieceDrop = useCallback((pieceId: string | number, targetPosition: number) => {
    const numericId = typeof pieceId === 'string' 
      ? parseInt(pieceId.toString().split('-')[1]) 
      : pieceId;
    
    // Check if target position is within grid bounds
    if (targetPosition < 0 || targetPosition >= grid.length) {
      return;
    }
    
    // Create a new grid state
    const newGrid = [...grid];
    
    // Check if there's already a piece at the target position
    const existingPieceId = newGrid[targetPosition];
    
    // Update pieces based on move
    setPieces(prevPieces => {
      const updated = [...prevPieces];
      
      // Find the dragged piece
      const draggedPieceIndex = updated.findIndex(p => {
        const pId = typeof p.id === 'string' 
          ? parseInt(p.id.toString().split('-')[1]) 
          : p.id;
        return pId === numericId;
      });
      
      if (draggedPieceIndex === -1) return prevPieces;
      
      // Update the dragged piece's position
      updated[draggedPieceIndex] = {
        ...updated[draggedPieceIndex],
        position: targetPosition,
        isDragging: false
      } as T;
      
      // If there was an existing piece, move it to staging
      if (existingPieceId !== null && existingPieceId !== numericId) {
        const existingPieceIndex = updated.findIndex(p => {
          const pId = typeof p.id === 'string' 
            ? parseInt(p.id.toString().split('-')[1]) 
            : p.id;
          return pId === existingPieceId;
        });
        
        if (existingPieceIndex !== -1) {
          updated[existingPieceIndex] = {
            ...updated[existingPieceIndex],
            position: -1, // Move to staging
            isDragging: false
          } as T;
        }
      }
      
      return updated;
    });
    
    // Update the grid
    newGrid[targetPosition] = numericId;
    setGrid(newGrid);
  }, [grid, setPieces]);
  
  // Reset the grid to empty state
  const resetGrid = useCallback(() => {
    setGrid(Array(rows * columns).fill(null));
  }, [rows, columns]);
  
  // Debug function
  const debugGrid = useCallback(() => {
    debugGridState(pieces, grid, rows, columns);
  }, [pieces, grid, rows, columns]);
  
  return {
    grid,
    setGrid,
    handlePieceDrop,
    resetGrid,
    debugGrid
  };
}
