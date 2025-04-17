
import { PuzzlePiece, DifficultyLevel, GameMode, PieceShape, VisualTheme } from './puzzle-types';

export interface SavedPuzzleState {
  id: string;
  name: string;
  timestamp: number;
  difficulty: DifficultyLevel;
  pieces: PuzzlePiece[];
  moveCount: number;
  timeSpent: number;
  selectedImage: string;
  version: string; // For compatibility checks
  gameMode?: GameMode;
  pieceShape?: PieceShape;
  visualTheme?: VisualTheme;
  rotationEnabled?: boolean;
  timeLimit?: number;
}

export interface SaveManagerState {
  saves: SavedPuzzleState[];
  lastAutoSave?: string | number;
}
