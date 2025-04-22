
import { BasePuzzlePiece } from '../../types/puzzle-types';
import { validateMove } from '../pieceMovementUtils';
import { updatePieceState } from '../pieceStateUtils';
import { movePieceFromStagingToGrid } from '../pieceStateManagement';

export const handlePieceDrop = <T extends BasePuzzlePiece>(
  pieces: T[],
  draggedPieceId: number | string,
  targetPosition: number,
  grid: (number | null)[],
  setPieces: (pieces: T[] | ((prev: T[]) => T[])) => void
): void => {
  const numericId = parseInt(draggedPieceId.toString());
  const draggedPiece = pieces.find(piece => parseInt(piece.id.toString()) === numericId);
  
  if (!draggedPiece || !validateMove(pieces, targetPosition, draggedPiece)) {
    return;
  }
  
  const { updatedPieces, updatedGrid } = movePieceFromStagingToGrid(
    pieces,
    grid,
    draggedPieceId,
    targetPosition
  );
  
  const finalPieces = updatePieceState(updatedPieces, draggedPieceId.toString(), {
    isDragging: false
  } as Partial<T>);
  
  setPieces(finalPieces as T[]);
};
