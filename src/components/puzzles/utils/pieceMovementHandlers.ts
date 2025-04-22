
import { BasePuzzlePiece } from '../types/puzzle-types';
import { updatePieceState } from './pieceStateUtils';
import { checkTrappedPieces } from './pieceSortingUtils';

export const handlePieceMove = <T extends BasePuzzlePiece>(
  pieces: T[],
  draggedPiece: T,
  targetIndex: number
): T[] => {
  const newPieces = [...pieces];
  const draggedIndex = newPieces.findIndex(p => p.id === draggedPiece.id);
  
  [newPieces[draggedIndex].position, newPieces[targetIndex].position] = 
  [newPieces[targetIndex].position, newPieces[draggedIndex].position];
  
  return checkTrappedPieces(newPieces);
};

export const handlePieceDrop = <T extends BasePuzzlePiece>(
  pieces: T[],
  draggedPiece: T
): T[] => {
  return updatePieceState(pieces, draggedPiece.id, { isDragging: false } as Partial<T>);
};

export const handleDirectionalMove = (direction: 'up' | 'down' | 'left' | 'right') => {
  // Implementation depends on grid layout
  console.log(`Move piece to ${direction}`);
};
