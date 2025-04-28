
export interface PuzzlePiece {
  id: string;
  position: number;
  originalPosition: number;
  isDragging: boolean;
  isCorrect?: boolean;
}

export type PuzzleState = {
  pieces: PuzzlePiece[];
  isComplete: boolean;
  moves: number;
  startTime: number | null;
  endTime: number | null;
};

export type PuzzleAction =
  | { type: 'INITIALIZE_PIECES'; payload: { totalPieces: number } }
  | { type: 'START_DRAG'; payload: { id: string } }
  | { type: 'MOVE_PIECE'; payload: { id: string; position: number } }
  | { type: 'END_DRAG'; payload: { id: string } }
  | { type: 'CHECK_COMPLETION' }
  | { type: 'RESET_PUZZLE' };
