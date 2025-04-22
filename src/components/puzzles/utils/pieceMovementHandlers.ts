
import { BasePuzzlePiece } from '../types/puzzle-types';
import { validateMove } from './pieceMovementUtils';
import { updatePieceState } from './pieceStateUtils';
import { ensureGridIntegrity, movePieceFromStagingToGrid } from './pieceStateManagement';

export const handlePieceDrop = <T extends BasePuzzlePiece>(
  pieces: T[],
  draggedPieceId: number | string,
  targetPosition: number,
  grid: (number | null)[],
  setPieces: (pieces: T[] | ((prev: T[]) => T[])) => void
): void => {
  // Convert string ID to number if needed
  const numericId = parseInt(draggedPieceId.toString());
  const draggedPiece = pieces.find(piece => parseInt(piece.id.toString()) === numericId);
  
  if (!draggedPiece || !validateMove(pieces, targetPosition, draggedPiece)) {
    // Invalid move - do nothing
    return;
  }
  
  // Use the one-piece-per-cell enforcement logic
  const { updatedPieces, updatedGrid } = movePieceFromStagingToGrid(
    pieces,
    grid,
    draggedPieceId,
    targetPosition
  );
  
  // Update the dragging state for the moved piece
  const finalPieces = updatePieceState(updatedPieces, draggedPieceId, {
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

  // Use the one-piece-per-cell enforcement logic
  const { updatedPieces } = movePieceFromStagingToGrid(
    pieces,
    grid,
    draggedPiece.id,
    targetIndex
  );
  
  // Clear dragging state after move
  return updatePieceState(updatedPieces, draggedPiece.id, {
    isDragging: false
  } as Partial<T>);
};

export const handleDirectionalMove = (direction: 'up' | 'down' | 'left' | 'right') => {
  console.log(`Move piece to ${direction}`);
};
