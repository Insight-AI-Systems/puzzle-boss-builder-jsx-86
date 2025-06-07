
export type SudokuDifficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type SudokuSize = 4 | 6 | 9;

export interface SudokuCell {
  value: number;
  isInitial: boolean;
  isConflict: boolean;
  isHint: boolean;
}

export interface SudokuGrid extends Array<Array<number>> {}

export interface SudokuMove {
  row: number;
  col: number;
  oldValue: number;
  newValue: number;
  timestamp: number;
}

export interface SudokuGameState {
  grid: SudokuGrid;
  moves: SudokuMove[];
  hintsUsed: number;
  startTime: number;
  difficulty: SudokuDifficulty;
  size: SudokuSize;
}

export interface SudokuDifficultyConfig {
  maxHints: number;
  fillPercentage: number;
}

export interface SudokuSizeConfig {
  4: SudokuDifficultyConfig;
  6: SudokuDifficultyConfig;
  9: SudokuDifficultyConfig;
}

export interface SudokuConfig {
  easy: SudokuSizeConfig;
  medium: SudokuSizeConfig;
  hard: SudokuSizeConfig;
  expert: SudokuSizeConfig;
}
