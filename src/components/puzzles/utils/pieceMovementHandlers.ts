
import { BasePuzzlePiece } from '../types/puzzle-types';
import { validateMove, handleCellSwap } from './pieceMovementUtils';
import { updatePieceState } from './pieceStateUtils';

export const handlePieceDrop = <T extends BasePuzzlePiece>(
  pieces: T[],
  draggedPieceId: number | string,
  targetPosition: number,
  grid: (number | null)[],
  setPieces: (pieces: T[] | ((prev: T[]) => T[])) => void
): void => {
  // Convert string ID to number if needed
  const numericId = typeof draggedPieceId === 'string' ? parseInt(draggedPieceId) : draggedPieceId;
  const draggedPiece = pieces.find(piece => piece.id === numericId);
  
  if (!draggedPiece || !validateMove(pieces, targetPosition, draggedPiece)) {
    // Invalid move - do nothing
    return;
  }
  
  // Use the cell swap logic to ensure one piece per cell
  const updatedPieces = handleCellSwap(pieces, draggedPiece, targetPosition, grid);
  
  // Update the dragging state for the moved piece
  const finalPieces = updatePieceState(updatedPieces, draggedPiece.id, {
    isDragging: false
  } as Partial<T>);
  
  setPieces(finalPieces as T[]);
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
  return updatePieceState(updatedPieces, draggedPiece.id, {
    isDragging: false
  } as Partial<T>);
};

export const handleDirectionalMove = (direction: 'up' | 'down' | 'left' | 'right') => {
  console.log(`Move piece to ${direction}`);
};
