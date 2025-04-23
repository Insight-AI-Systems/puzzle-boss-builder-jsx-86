
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
  grid?: (number | null)[];
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
  rotationEnabled,
  grid = []
}: UsePuzzlePieceHandlersProps) {
  // We're now calling createPieceHandlers with the correct number of arguments
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
