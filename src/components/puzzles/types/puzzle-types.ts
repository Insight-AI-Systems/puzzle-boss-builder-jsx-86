
export type DifficultyLevel = '3x3' | '4x4' | '5x5' | '6x6' | '7x7' | '8x8' | '10x10';
export type GameMode = 'classic' | 'timed' | 'challenge';
export type PieceShape = 'standard' | 'irregular';
export type VisualTheme = 'light' | 'dark' | 'colorful';

// Base piece interface
export interface BasePuzzlePiece {
  id: string;
  position: number;
  isDragging: boolean;
  correctlyPlaced?: boolean; // For animations
  showHint?: boolean; // For hint animations
  rotation?: number; // For challenge mode - degrees of rotation
  selected?: boolean; // For selection highlighting
}

// Extended interface for image puzzle pieces
export interface PuzzlePiece extends BasePuzzlePiece {
  originalPosition: number;
}

export interface PuzzleState {
  isComplete: boolean;
  timeSpent: number;
  correctPieces: number;
  difficulty: DifficultyLevel;
  moveCount: number;
  isActive: boolean;
  gameMode?: GameMode;
  timeLimit?: number; // For timed mode
}

export interface DifficultyConfig {
  gridSize: number;
  containerClass: string;
  label?: string;
}

export const difficultyConfig: Record<DifficultyLevel, DifficultyConfig> = {
  '3x3': { gridSize: 3, containerClass: 'grid-cols-3', label: 'Easy (3×3)' },
  '4x4': { gridSize: 4, containerClass: 'grid-cols-4', label: 'Medium (4×4)' },
  '5x5': { gridSize: 5, containerClass: 'grid-cols-5', label: 'Hard (5×5)' },
  '6x6': { gridSize: 6, containerClass: 'grid-cols-6', label: 'Expert (6×6)' },
  '7x7': { gridSize: 7, containerClass: 'grid-cols-7', label: 'Master (7×7)' },
  '8x8': { gridSize: 8, containerClass: 'grid-cols-8', label: 'Grandmaster (8×8)' },
  '10x10': { gridSize: 10, containerClass: 'grid-cols-10', label: 'Legendary (10×10)' },
};

export const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb', // landscape
  'https://images.unsplash.com/photo-1518877593221-1f28583780b4', // whale
  'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7', // code
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5', // matrix
];

export const MODE_DESCRIPTIONS = {
  classic: 'Standard jigsaw puzzle',
  timed: 'Complete the puzzle before time runs out',
  challenge: 'Pieces rotate and need proper orientation',
};

export const THEME_DESCRIPTIONS = {
  light: 'Light background with dark pieces',
  dark: 'Dark background with light pieces',
  colorful: 'Vibrant colors for an exciting experience',
};
