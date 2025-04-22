
import { BasePuzzlePiece } from '../types/puzzle-types';
import { validateMove, handleCellSwap } from './pieceMovementUtils';
import { updatePieceState } from './pieceStateUtils';

export const handlePieceDrop = <T extends BasePuzzlePiece>(
  pieces: T[],
  draggedPieceId: number,
  targetPosition: number,
  grid: (number | null)[],
  setPieces: (pieces: T[] | ((prev: T[]) => T[])) => void
): void => {
  const draggedPiece = pieces.find(piece => piece.id === draggedPieceId);
  
  if (!draggedPiece || !validateMove(pieces, targetPosition, draggedPiece)) {
    // Invalid move - do nothing
    return;
  }
  
  // Use the cell swap logic to ensure one piece per cell
  const updatedPieces = handleCellSwap(pieces, draggedPiece, targetPosition, grid);
  
  // Update the dragging state for the moved piece
  const finalPieces = updatePieceState(updatedPieces, draggedPiece.id, {
    isDragging: false
  }) as T[];
  
  setPieces(finalPieces);
};

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

export const handleDirectionalMove = (direction: 'up' | 'down' | 'left' | 'right') => {
  console.log(`Move piece to ${direction}`);
};
