
/**
 * Maps between UI grid sizes and backend difficulty levels
 */

export type GridSize = '3x3' | '4x4' | '5x5' | '6x6' | '7x7' | '8x8' | '9x9' | '10x10';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export const GRID_SIZES = [
  { value: '3x3', label: '3×3 (9 pieces)', pieces: 9, difficulty: 'easy' },
  { value: '4x4', label: '4×4 (16 pieces)', pieces: 16, difficulty: 'easy' },
  { value: '5x5', label: '5×5 (25 pieces)', pieces: 25, difficulty: 'medium' },
  { value: '6x6', label: '6×6 (36 pieces)', pieces: 36, difficulty: 'medium' },
  { value: '7x7', label: '7×7 (49 pieces)', pieces: 49, difficulty: 'hard' },
  { value: '8x8', label: '8×8 (64 pieces)', pieces: 64, difficulty: 'hard' },
  { value: '9x9', label: '9×9 (81 pieces)', pieces: 81, difficulty: 'hard' },
  { value: '10x10', label: '10×10 (100 pieces)', pieces: 100, difficulty: 'hard' },
];

/**
 * Maps a grid size to its corresponding difficulty level
 */
export function mapGridSizeToDifficulty(gridSize: string): DifficultyLevel {
  const gridSizeConfig = GRID_SIZES.find(size => size.value === gridSize);
  return gridSizeConfig?.difficulty || 'medium';
}

/**
 * Gets grid size configuration based on pieces count
 */
export function getGridSizeByPieces(pieces: number) {
  return GRID_SIZES.find(size => size.pieces === pieces) || GRID_SIZES[1]; // Default to 4x4
}

/**
 * Gets grid size configuration based on difficulty
 */
export function getGridSizeByDifficulty(difficulty: DifficultyLevel) {
  // Return the smallest grid size for the given difficulty
  const match = GRID_SIZES.find(size => size.difficulty === difficulty);
  return match || GRID_SIZES[1]; // Default to 4x4
}
