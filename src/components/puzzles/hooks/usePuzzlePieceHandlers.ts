
import { BasePuzzlePiece, GameMode } from '../types/puzzle-types';
import { createPieceHandlers } from '../utils/pieceInteractionHandlers';

interface UsePuzzlePieceHandlersProps<T extends BasePuzzlePiece> {
  pieces: T[];
  setPieces: (pieces: T[] | ((prev: T[]) => T[])) => void;
  draggedPiece: T | null;
  setDraggedPiece: (piece: T | null) => void;
  incrementMoves: () => void;
  isSolved: boolean;
  playSound: (sound: string) => void;
  gameMode: GameMode;
  rotationEnabled: boolean;
}

export function usePuzzlePieceHandlers<T extends BasePuzzlePiece>({
  pieces,
  setPieces,
  draggedPiece,
  setDraggedPiece,
  incrementMoves,
  isSolved,
  playSound,
  gameMode,
  rotationEnabled
}: UsePuzzlePieceHandlersProps<T>) {
  return createPieceHandlers(
    pieces,
    setPieces,
    draggedPiece,
    setDraggedPiece,
    incrementMoves,
    isSolved,
    playSound
  );
}
