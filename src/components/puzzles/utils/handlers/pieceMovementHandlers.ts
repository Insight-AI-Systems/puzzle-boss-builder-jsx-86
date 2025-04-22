
import { BasePuzzlePiece } from '../../types/puzzle-types';
import { validateMove } from '../pieceMovementUtils';
import { updatePieceState } from '../pieceStateUtils';
import { movePieceFromStagingToGrid } from '../pieceStateManagement';

export const handlePieceMove = <T extends BasePuzzlePiece>(
  pieces: T[],
  draggedPiece: T,
  targetIndex: number,
  grid: (number | null)[] = []
): T[] => {
  if (!validateMove(pieces, targetIndex, draggedPiece)) {
    return pieces;
  }

  const { updatedPieces } = movePieceFromStagingToGrid(
    pieces,
    grid,
    draggedPiece.id,
    targetIndex
  );
  
  return updatePieceState(updatedPieces, draggedPiece.id, {
    isDragging: false
  } as Partial<T>);
};

export const handleDirectionalMove = (direction: 'up' | 'down' | 'left' | 'right') => {
  console.log(`Move piece to ${direction}`);
};
