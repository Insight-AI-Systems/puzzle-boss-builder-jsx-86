import { BasePuzzlePiece } from '../types/puzzle-types';
import { handlePieceSwap, validateMove, isPositionOccupied } from './pieceMovementUtils';
import { checkTrappedPieces } from './pieceSortingUtils';

export const handlePieceMove = <T extends BasePuzzlePiece>(
  pieces: T[],
  draggedPiece: T,
  targetIndex: number
): T[] => {
  // Validate move first
  if (!validateMove(pieces, targetIndex, draggedPiece)) {
    return pieces;
  }

  // Perform the swap - this will handle both placement and swapping
  const updatedPieces = handlePieceSwap(pieces, draggedPiece, targetIndex);
  
  // Check for trapped pieces after the move
  return checkTrappedPieces(updatedPieces);
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
