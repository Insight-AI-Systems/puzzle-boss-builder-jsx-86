
import { BasePuzzlePiece, GameMode, PuzzlePiece } from '../types/puzzle-types';
import { createPieceHandlers } from '../utils/pieceInteractionHandlers';

interface UsePuzzlePieceHandlersProps {
  pieces: PuzzlePiece[];
  setPieces: (pieces: PuzzlePiece[]) => void;
  draggedPiece: PuzzlePiece | null;
  setDraggedPiece: (piece: PuzzlePiece | null) => void;
  incrementMoves: () => void;
  isSolved: boolean;
  playSound: (sound: string) => void;
  gameMode: GameMode;
  rotationEnabled: boolean;
}

export function usePuzzlePieceHandlers({
  pieces,
  setPieces,
  draggedPiece,
  setDraggedPiece,
  incrementMoves,
  isSolved,
  playSound,
  gameMode,
  rotationEnabled
}: UsePuzzlePieceHandlersProps) {
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
