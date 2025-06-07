
export type GameState = 'not_started' | 'playing' | 'completed' | 'submitted';

export interface GameSession {
  sessionId: string;
  userId?: string;
  gameType: string;
  startTime?: number;
  endTime?: number;
  score: number;
  moves: number;
  timeElapsed: number;
  state: GameState;
}

export interface GameResult {
  sessionId: string;
  score: number;
  timeElapsed: number;
  moves: number;
  completed: boolean;
  gameType: string;
}

export interface GameConfig {
  gameType: string;
  requiresPayment?: boolean;
  hasTimer?: boolean;
  hasScore?: boolean;
  hasMoves?: boolean;
  timeLimit?: number;
  maxMoves?: number;
  prizePool?: number;
  entryFee?: number;
}

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  playerName: string;
  score: number;
  timeElapsed: number;
  completedAt: Date;
}

export interface GameHooks {
  onGameStart?: () => void;
  onGamePause?: () => void;
  onGameResume?: () => void;
  onGameReset?: () => void;
  onGameComplete?: (result: GameResult) => void;
  onScoreUpdate?: (score: number) => void;
  onMoveUpdate?: (moves: number) => void;
  onError?: (error: string) => void;
}
