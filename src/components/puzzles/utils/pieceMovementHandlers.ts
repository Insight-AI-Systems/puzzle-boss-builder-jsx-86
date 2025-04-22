import { BasePuzzlePiece } from '../types/puzzle-types';
import { updatePieceState } from './pieceStateUtils';
import { checkTrappedPieces } from './pieceSortingUtils';
import { handlePieceSwap, validateMove } from './pieceMovementUtils';

export const handlePieceMove = <T extends BasePuzzlePiece>(
  pieces: T[],
  draggedPiece: T,
  targetIndex: number
): T[] => {
  // Validate move first
  if (!validateMove(pieces, targetIndex, draggedPiece)) {
    return pieces;
  }

  // Use handlePieceSwap for the actual move
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
