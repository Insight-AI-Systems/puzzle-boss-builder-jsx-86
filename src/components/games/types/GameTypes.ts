
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
