export interface BasePuzzlePiece {
  id: string;
  position: number;
  originalPosition?: number;
  isDragging: boolean;
  trapped?: boolean;
  selected?: boolean;
  showHint?: boolean;
  zIndex?: number;
  rotation?: number; // Add rotation property for piece orientation
}

export type DifficultyLevel = '3x3' | '4x4' | '5x5' | '6x6';

export type GameMode = 'classic' | 'timed' | 'challenge';
export type PieceShape = 'standard' | 'curved' | 'puzzle';
export type VisualTheme = 'light' | 'dark' | 'colorful';

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
  },
  '6x6': {
    label: 'Expert (6×6)',
    gridSize: 6,
    containerClass: 'grid-cols-6'
  }
};

export interface PuzzlePiece extends BasePuzzlePiece {
  id: string;
  position: number;
  originalPosition: number;
  isDragging: boolean;
  rotation?: number; // Add rotation property to this interface too for consistency
  color?: string;    // Add color property for piece styling
}

// Default sample images for puzzle games
export const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
  'https://images.unsplash.com/photo-1518770660439-4636190af475'
];

// Puzzle state interface for tracking game progress
export interface PuzzleState {
  isComplete: boolean;
  timeSpent: number;
  correctPieces: number;
  difficulty: DifficultyLevel;
  moveCount: number;
  isActive: boolean;
  gameMode: GameMode;
  timeLimit: number;
}
