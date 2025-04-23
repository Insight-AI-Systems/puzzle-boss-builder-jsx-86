
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

export interface PuzzleSettings {
  showGuide: boolean;
  soundEnabled: boolean;
  volume: number;
  difficulty: 'easy' | 'medium' | 'hard';
  theme: 'default' | 'dark' | 'light';
}
