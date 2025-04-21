
import { BasePuzzlePiece } from './puzzle-types';

export interface SimplePuzzlePiece extends BasePuzzlePiece {
  color: string;
  originalPosition?: number; // Make compatible with PuzzlePiece interface
}
