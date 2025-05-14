
import { DifficultyLevel, GameMode, PieceShape, VisualTheme } from '@/components/puzzles/types/puzzle-types';

/**
 * Core puzzle model representing a puzzle entity
 */
export interface PuzzleModel {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'active' | 'inactive' | 'scheduled' | 'completed' | 'draft';
  categoryId: string;
  categoryName?: string;
  pieces: number;
  costPerPlay: number;
  prizeValue: number;
  completions: number;
  avgTime?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Puzzle creation data transfer object
 */
export interface PuzzleCreateDTO {
  title: string;
  description?: string;
  imageUrl: string;
  difficulty: 'easy' | 'medium' | 'hard';
  categoryId: string;
  pieces: number;
  costPerPlay: number;
  prizeValue: number;
}

/**
 * Puzzle update data transfer object
 */
export interface PuzzleUpdateDTO {
  id: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  status?: 'active' | 'inactive' | 'scheduled' | 'completed' | 'draft';
  categoryId?: string;
  pieces?: number;
  costPerPlay?: number;
  prizeValue?: number;
}

/**
 * Puzzle with extended gameplay configuration
 */
export interface PuzzleWithConfig extends PuzzleModel {
  config: PuzzleConfiguration;
}

/**
 * Configuration options for puzzle gameplay
 */
export interface PuzzleConfiguration {
  gameMode: GameMode;
  pieceShape: PieceShape;
  visualTheme: VisualTheme;
  showGuide: boolean;
  timeLimit?: number;
  rotationEnabled?: boolean;
  difficultyLevel: DifficultyLevel;
}

/**
 * Puzzle statistics and analytics
 */
export interface PuzzleStatistics {
  puzzleId: string;
  totalPlays: number;
  completions: number;
  avgCompletionTime: number;
  completionRate: number;
  popularityRank?: number;
}

/**
 * Type guard to check if an object is a valid PuzzleModel
 */
export function isPuzzleModel(obj: unknown): obj is PuzzleModel {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'title' in obj &&
    'imageUrl' in obj &&
    'difficulty' in obj &&
    'status' in obj &&
    'categoryId' in obj
  );
}
