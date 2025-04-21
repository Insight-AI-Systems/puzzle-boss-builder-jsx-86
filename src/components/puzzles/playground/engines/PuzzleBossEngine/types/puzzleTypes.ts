
export interface PuzzlePiece {
  id: number;
  position: number;         // Current position in the grid
  originalPosition: number;  // Original position for checking correctness
  groupId?: string;         // ID of the group this piece belongs to
  edges: Edge[];            // Edges information for connecting pieces
  width: number;            // Width of the piece (percentage of board)
  height: number;           // Height of the piece (percentage of board)
  isCorrect?: boolean;      // Is the piece in the correct position
}

export interface Edge {
  id: string;
  type: 'tab' | 'slot' | 'flat';  // The shape of the edge
  position: 'top' | 'right' | 'bottom' | 'left';  // Which side of the piece
  matchingEdgeId?: string;  // ID of the edge it connects with
}

export interface PieceGroup {
  id: string;
  pieceIds: number[];      // IDs of pieces in this group
  isComplete: boolean;     // Is the group in its final position
}

export interface PuzzleState {
  pieces: PuzzlePiece[];
  groups: PieceGroup[];
  isComplete: boolean;
  isLoading: boolean;
  hasStarted: boolean;
}

export interface PuzzleConfig {
  rows: number;
  columns: number;
  imageUrl: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  timeLimitSeconds?: number;
  showGuide?: boolean;
}

export interface PlayerStats {
  startTime: number | null;
  solveTime: number | null;
  moves: number;
  hintsUsed: number;
}
