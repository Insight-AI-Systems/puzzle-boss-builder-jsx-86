
export interface BasePuzzlePiece {
  id: string;
  position: number;
  originalPosition?: number;
  isDragging: boolean;
  trapped?: boolean;
  selected?: boolean;
  showHint?: boolean;
  zIndex?: number;
}

export type DifficultyLevel = '3x3' | '4x4' | '5x5';

export interface DifficultyConfig {
  label: string;
  gridSize: number;
  containerClass: string;
}

export const difficultyConfig: Record<DifficultyLevel, DifficultyConfig> = {
  '3x3': {
    label: 'Easy (3×3)',
    gridSize: 3,
    containerClass: 'grid-cols-3'
  },
  '4x4': {
    label: 'Medium (4×4)',
    gridSize: 4,
    containerClass: 'grid-cols-4'
  },
  '5x5': {
    label: 'Hard (5×5)',
    gridSize: 5,
    containerClass: 'grid-cols-5'
  }
};

export interface PuzzlePiece extends BasePuzzlePiece {
  id: string;
  position: number;
  originalPosition: number;
  isDragging: boolean;
}
