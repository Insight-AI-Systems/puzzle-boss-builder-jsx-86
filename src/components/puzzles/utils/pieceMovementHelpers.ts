
import { BasePuzzlePiece } from '../types/puzzle-types';

/**
 * Moves a piece from staging to the grid at the specified position.
 */
export const movePieceFromStagingToGrid = <T extends BasePuzzlePiece>(
  pieces: T[],
  grid: (number | null)[],
  pieceId: string | number,
  targetPosition: number
): { 
  updatedPieces: T[],
  updatedGrid: (number | null)[] 
} => {
  const numericId = typeof pieceId === 'string' 
    ? parseInt(pieceId.toString().split('-')[1]) 
    : pieceId;
  
  const pieceIndex = pieces.findIndex(p => {
    const pId = typeof p.id === 'string' 
      ? parseInt(p.id.toString().split('-')[1]) 
      : p.id;
    return pId === numericId;
  });
  
  if (pieceIndex === -1) {
    return { updatedPieces: pieces, updatedGrid: grid };
  }
  
  const updatedPieces = [...pieces];
  const updatedGrid = [...grid];
  
  if (updatedGrid[targetPosition] !== null) {
    const existingPieceId = updatedGrid[targetPosition];
    const existingPieceIndex = updatedPieces.findIndex(p => {
      const pId = typeof p.id === 'string' 
        ? parseInt(p.id.toString().split('-')[1]) 
        : p.id;
      return pId === existingPieceId;
    });
    
    if (existingPieceIndex !== -1) {
      updatedPieces[existingPieceIndex] = {
        ...updatedPieces[existingPieceIndex],
        position: -1,
        isDragging: false
      } as T;
    }
  }
  
  updatedGrid[targetPosition] = numericId;
  updatedPieces[pieceIndex] = {
    ...updatedPieces[pieceIndex],
    position: targetPosition,
    isDragging: false
  } as T;
  
  return { updatedPieces, updatedGrid };
};
