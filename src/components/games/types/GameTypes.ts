
export type GameState = 'not_started' | 'playing' | 'paused' | 'completed' | 'submitted';

export interface GameSession {
  sessionId: string;
  userId?: string;
  gameType: string;
  score: number;
  moves: number;
  timeElapsed: number;
  state: GameState;
  startTime?: number;
  endTime?: number;
}

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  playerName: string;
  score: number;
  timeElapsed: number;
  completedAt: Date;
}

export interface GameConfig {
  gameType: string;
  hasTimer: boolean;
  hasScore: boolean;
  hasMoves: boolean;
  timeLimit?: number;
  requiresPayment?: boolean;
  entryFee?: number;
  difficulty?: string;
}

export interface GameHooks {
  onGameStart?: () => void;
  onGameComplete?: (result: GameResult) => void;
  onGameReset?: () => void;
  onScoreUpdate?: (score: number) => void;
  onMoveUpdate?: (moves: number) => void;
  onError?: (error: string) => void;
}

export interface GameResult {
  sessionId: string;
  score: number;
  timeElapsed: number;
  moves: number;
  completed: boolean;
  gameType: string;
  wordsFound?: number;
  totalWords?: number;
  incorrectSelections?: number;
}
