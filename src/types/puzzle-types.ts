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
  timeSpent?: number;
};

export type PuzzleAction =
  | { type: 'INITIALIZE_PIECES'; payload: { totalPieces: number } }
  | { type: 'START_DRAG'; payload: { id: string } }
  | { type: 'MOVE_PIECE'; payload: { id: string; position: number } }
  | { type: 'END_DRAG'; payload: { id: string } }
  | { type: 'CHECK_COMPLETION' }
  | { type: 'RESET_PUZZLE' }
  | { type: 'LOAD_SAVED_STATE'; payload: PuzzleState };

export interface PuzzleSettings {
  showGuide: boolean;
  soundEnabled: boolean;
  volume: number;
  difficulty: string;
  theme: string;
}

export interface PuzzleSettingsDB {
  id?: string;
  user_id: string;
  settings_type: string;
  settings: PuzzleSettings;
  created_at?: string;
  updated_at?: string;
}

export interface PuzzleProgress {
  id?: string;
  userId?: string;
  puzzleId: string;
  completionPercentage: number;
  timeSpent: number;
  lastPlayed: string;
  isComplete: boolean;
  moves: number;
  correctPieces: number;
  totalPieces: number;
}

export interface PuzzleProgressDB {
  id?: string;
  user_id?: string;
  puzzle_id: string;
  completion_percentage: number;
  time_spent: number;
  last_played: string;
  is_complete: boolean;
  moves: number;
  correct_pieces: number;
  total_pieces: number;
  created_at?: string;
  updated_at?: string;
}

export function mapDbToFrontendProgress(dbProgress: PuzzleProgressDB): PuzzleProgress {
  return {
    id: dbProgress.id,
    userId: dbProgress.user_id,
    puzzleId: dbProgress.puzzle_id,
    completionPercentage: dbProgress.completion_percentage,
    timeSpent: dbProgress.time_spent,
    lastPlayed: dbProgress.last_played,
    isComplete: dbProgress.is_complete,
    moves: dbProgress.moves,
    correctPieces: dbProgress.correct_pieces,
    totalPieces: dbProgress.total_pieces
  };
}

export function mapFrontendToDbProgress(progress: Partial<PuzzleProgress>, userId?: string): Partial<PuzzleProgressDB> {
  return {
    user_id: userId,
    puzzle_id: progress.puzzleId,
    completion_percentage: progress.completionPercentage,
    time_spent: progress.timeSpent,
    last_played: progress.lastPlayed,
    is_complete: progress.isComplete,
    moves: progress.moves,
    correct_pieces: progress.correctPieces,
    total_pieces: progress.totalPieces
  };
}
