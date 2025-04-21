
import { BasePuzzlePiece } from './puzzle-types';

export interface SimplePuzzlePiece extends BasePuzzlePiece {
  color: string;
  originalPosition: number; // Make required instead of optional
  position: number;
  id: string;
}

