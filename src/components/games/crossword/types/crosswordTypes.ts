
export interface CrosswordCell {
  id: string;
  row: number;
  col: number;
  letter: string;
  correctLetter: string;
  number?: number;
  isBlocked: boolean;
  belongsToWords: string[];
  isHighlighted: boolean;
  isSelected: boolean;
}

export interface CrosswordWord {
  id: string;
  clue: string;
  answer: string;
  startRow: number;
  startCol: number;
  direction: 'across' | 'down';
  number: number;
  isCompleted: boolean;
  cells: string[];
}

export interface CrosswordClue {
  id: string;
  number: number;
  direction: 'across' | 'down';
  clue: string;
  answer: string;
  isCompleted: boolean;
}

export interface CrosswordPuzzle {
  id: string;
  title: string;
  date: string;
  difficulty: 'easy' | 'medium' | 'hard';
  grid: CrosswordCell[][];
  words: CrosswordWord[];
  clues: {
    across: CrosswordClue[];
    down: CrosswordClue[];
  };
  size: number;
}

export interface CrosswordProgress {
  puzzleId: string;
  startTime: number;
  currentTime: number;
  hintsUsed: number;
  isCompleted: boolean;
  grid: string[][];
  completedWords: string[];
}

export interface CrosswordGameState {
  puzzle: CrosswordPuzzle | null;
  progress: CrosswordProgress | null;
  selectedCell: { row: number; col: number } | null;
  selectedWord: string | null;
  selectedDirection: 'across' | 'down';
  showHints: boolean;
  isPaused: boolean;
  gameStatus: 'loading' | 'playing' | 'completed' | 'error';
}
