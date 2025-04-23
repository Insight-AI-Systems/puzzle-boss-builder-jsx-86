
// Define database types that match the actual table structure
export interface PuzzleProgressDB {
  id: string;
  user_id: string;
  puzzle_id: string;
  progress: {
    completed: boolean;
    pieces_placed: string[];
    move_count: number;
  };
  start_time: string;
  last_updated: string;
  is_completed: boolean;
  completion_time: number | null;
}

// Define frontend model types (using camelCase)
export interface PuzzleProgress {
  id: string;
  puzzleId: string;
  progress: {
    completed: boolean;
    piecesPlaced: string[];
    moveCount: number;
  };
  startTime: Date;
  lastUpdated: Date;
  isCompleted: boolean;
  completionTime: number | null;
}

export interface PuzzleSettingsDB {
  id: string;
  user_id?: string;
  settings_type: string;
  settings: any; // This will be the JSON blob
  created_at?: string;
  updated_at?: string;
}

export interface PuzzleSettings {
  showGuide: boolean;
  soundEnabled: boolean;
  volume: number;
  difficulty: 'easy' | 'medium' | 'hard';
  theme: 'default' | 'dark' | 'light';
}

// Functions to map between DB and frontend models
export function mapDbToFrontendProgress(dbProgress: PuzzleProgressDB): PuzzleProgress {
  return {
    id: dbProgress.id,
    puzzleId: dbProgress.puzzle_id,
    progress: {
      completed: dbProgress.progress.completed,
      piecesPlaced: dbProgress.progress.pieces_placed || [],
      moveCount: dbProgress.progress.move_count || 0
    },
    startTime: new Date(dbProgress.start_time),
    lastUpdated: new Date(dbProgress.last_updated),
    isCompleted: dbProgress.is_completed,
    completionTime: dbProgress.completion_time
  };
}

export function mapFrontendToDbProgress(frontendProgress: Partial<PuzzleProgress>, userId: string): Partial<PuzzleProgressDB> {
  const result: Partial<PuzzleProgressDB> = {
    user_id: userId
  };

  if (frontendProgress.id) result.id = frontendProgress.id;
  if (frontendProgress.puzzleId) result.puzzle_id = frontendProgress.puzzleId;
  
  if (frontendProgress.progress) {
    result.progress = {
      completed: frontendProgress.progress.completed,
      pieces_placed: frontendProgress.progress.piecesPlaced || [],
      move_count: frontendProgress.progress.moveCount || 0
    };
  }
  
  if (frontendProgress.startTime) result.start_time = frontendProgress.startTime.toISOString();
  if (frontendProgress.lastUpdated) result.last_updated = frontendProgress.lastUpdated.toISOString();
  if (frontendProgress.isCompleted !== undefined) result.is_completed = frontendProgress.isCompleted;
  if (frontendProgress.completionTime !== undefined) result.completion_time = frontendProgress.completionTime;
  
  return result;
}
