
// Game domain models and types
export interface Game {
  id: string;
  title: string;
  type: GameType;
  category_id?: string;
  image_url?: string;
  description?: string;
  difficulty: GameDifficulty;
  status: GameStatus;
  prize_value?: number;
  entry_fee?: number;
  time_limit?: number;
  max_players?: number;
  config: GameConfig;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export type GameType = 
  | 'jigsaw' 
  | 'word-search' 
  | 'crossword' 
  | 'memory' 
  | 'sudoku' 
  | 'tetris';

export type GameDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type GameStatus = 'draft' | 'active' | 'paused' | 'completed' | 'archived';

export interface GameConfig {
  [key: string]: any;
}

export interface GameSession {
  id: string;
  game_id: string;
  user_id: string;
  status: GameSessionStatus;
  start_time: string;
  end_time?: string;
  score?: number;
  moves?: number;
  time_elapsed?: number;
  game_state: any;
  created_at: string;
  updated_at: string;
}

export type GameSessionStatus = 'active' | 'paused' | 'completed' | 'abandoned';

export interface GameProgress {
  id: string;
  game_id: string;
  user_id: string;
  session_id: string;
  progress_data: any;
  percentage_complete: number;
  last_checkpoint?: string;
  created_at: string;
  updated_at: string;
}

export interface GameScore {
  id: string;
  game_id: string;
  user_id: string;
  session_id: string;
  score: number;
  time_taken: number;
  moves_count?: number;
  difficulty: GameDifficulty;
  is_personal_best: boolean;
  rank?: number;
  created_at: string;
}

export interface GameCompletion {
  id: string;
  game_id: string;
  user_id: string;
  session_id: string;
  completion_time: number;
  final_score: number;
  moves_count?: number;
  hints_used?: number;
  is_winner: boolean;
  prize_awarded?: number;
  completion_data: any;
  created_at: string;
}

export interface GameLeaderboard {
  id: string;
  game_id: string;
  user_id: string;
  username: string;
  score: number;
  time_taken: number;
  rank: number;
  created_at: string;
}

export interface GameStats {
  total_plays: number;
  total_completions: number;
  average_score: number;
  best_score: number;
  average_time: number;
  best_time: number;
  completion_rate: number;
}

export interface GameAnalytics {
  game_id: string;
  date: string;
  plays_count: number;
  completions_count: number;
  average_score: number;
  average_time: number;
  unique_players: number;
  revenue: number;
}

// Game creation and update data types
export interface GameCreateData {
  title: string;
  type: GameType;
  category_id?: string;
  image_url?: string;
  description?: string;
  difficulty: GameDifficulty;
  prize_value?: number;
  entry_fee?: number;
  time_limit?: number;
  max_players?: number;
  config: GameConfig;
}

export interface GameUpdateData {
  title?: string;
  description?: string;
  difficulty?: GameDifficulty;
  status?: GameStatus;
  prize_value?: number;
  entry_fee?: number;
  time_limit?: number;
  max_players?: number;
  config?: GameConfig;
}

// Game-specific errors
export class GameNotFoundError extends Error {
  constructor(gameId: string) {
    super(`Game with id ${gameId} not found`);
    this.name = 'GameNotFoundError';
  }
}

export class GameValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'GameValidationError';
  }
}

export class GameStateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GameStateError';
  }
}

export class InsufficientCreditsError extends Error {
  constructor(required: number, available: number) {
    super(`Insufficient credits. Required: ${required}, Available: ${available}`);
    this.name = 'InsufficientCreditsError';
  }
}
