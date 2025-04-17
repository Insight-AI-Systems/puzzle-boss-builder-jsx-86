
import { PuzzlePiece, DifficultyLevel } from './puzzle-types';

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
}

export interface SaveManagerState {
  saves: SavedPuzzleState[];
  lastAutoSave?: string;
}
