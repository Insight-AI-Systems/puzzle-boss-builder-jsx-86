
// Base game state interface that all puzzle games will extend
export interface BaseGameState {
  id: string;
  status: 'idle' | 'loading' | 'playing' | 'paused' | 'completed' | 'error';
  startTime: number | null;
  endTime: number | null;
  score: number;
  moves: number;
  isComplete: boolean;
  error?: string;
}

// Player performance tracking
export interface PlayerStats {
  startTime: number | null;
  solveTime: number | null;
  moves: number;
  hintsUsed: number;
  accuracy?: number;
  efficiency?: number;
}

// Game configuration interface - aligned with existing GameConfig
export interface GameConfig {
  gameType: string;
  hasTimer: boolean;
  hasScore: boolean;
  hasMoves: boolean;
  timeLimit?: number;
  requiresPayment: boolean;
  entryFee: number;
  difficulty: string;
  hintsEnabled?: boolean;
  soundEnabled?: boolean;
  showGuide?: boolean;
}

// Move validation result
export interface MoveValidationResult {
  isValid: boolean;
  error?: string;
  newState?: any;
  scoreChange?: number;
}

// Win condition check result
export interface WinConditionResult {
  isWin: boolean;
  completionPercentage: number;
  finalScore: number;
  bonusPoints?: number;
}

// Game event types for consistent event handling
export type GameEvent = 
  | { type: 'GAME_STARTED'; timestamp: number }
  | { type: 'MOVE_MADE'; move: any; timestamp: number }
  | { type: 'HINT_USED'; timestamp: number }
  | { type: 'GAME_PAUSED'; timestamp: number }
  | { type: 'GAME_RESUMED'; timestamp: number }
  | { type: 'GAME_COMPLETED'; finalScore: number; timestamp: number }
  | { type: 'GAME_ERROR'; error: string; timestamp: number };
