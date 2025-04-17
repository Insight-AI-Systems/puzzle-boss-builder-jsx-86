
export type DifficultyLevel = '3x3' | '4x4' | '5x5';

// Base interface for all puzzle pieces
export interface BasePuzzlePiece {
  id: string;
  position: number;
  isDragging: boolean;
}

// Extended interface for image puzzle pieces
export interface PuzzlePiece extends BasePuzzlePiece {
  originalPosition: number;
}

export const difficultyConfig = {
  '3x3': { gridSize: 3, containerClass: 'grid-cols-3' },
  '4x4': { gridSize: 4, containerClass: 'grid-cols-4' },
  '5x5': { gridSize: 5, containerClass: 'grid-cols-5' },
};

export const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb', // landscape
  'https://images.unsplash.com/photo-1518877593221-1f28583780b4', // whale
  'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7', // code
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5', // matrix
];

