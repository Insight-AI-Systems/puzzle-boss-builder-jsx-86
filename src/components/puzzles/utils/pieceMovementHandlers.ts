
import { BasePuzzlePiece, PuzzlePiece } from '../types/puzzle-types';
import { validateMove, handleCellSwap } from './pieceMovementUtils';
import { updatePieceState } from './pieceStateUtils';

export const handlePieceMove = <T extends BasePuzzlePiece>(
  pieces: T[],
  draggedPiece: T,
  targetIndex: number,
  grid: (number | null)[] = []
): T[] => {
  if (!validateMove(pieces, targetIndex, draggedPiece)) {
    return pieces;
  }

  // Use the cell swapping logic to ensure one piece per cell
  const updatedPieces = handleCellSwap(pieces, draggedPiece, targetIndex, grid);
  
  // Clear dragging state after move
  return updatedPieces.map(piece => {
    if (piece.id === draggedPiece.id) {
      return { ...piece, isDragging: false } as T;
    }
    return piece;
  });
};

export const handlePieceDrop = <T extends BasePuzzlePiece>(
  pieces: T[],
  draggedPiece: T
): T[] => {
  return updatePieceState(pieces, draggedPiece.id, { isDragging: false } as Partial<T>);
};

export const handleDirectionalMove = (direction: 'up' | 'down' | 'left' | 'right') => {
  console.log(`Move piece to ${direction}`);
};
