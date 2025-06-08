
export type BlockType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export interface Position {
  x: number;
  y: number;
}

export interface Block {
  type: BlockType;
  shape: number[][];
  color: string;
  position: Position;
  rotation: number;
}

export interface Cell {
  filled: boolean;
  color: string;
  type: BlockType | null;
  isGhost?: boolean; // Added optional isGhost property
}

export interface GameStats {
  score: number;
  lines: number;
  level: number;
  tetrises: number;
}

export interface TetrisGameState {
  grid: Cell[][];
  currentBlock: Block | null;
  nextBlock: Block | null;
  holdBlock: Block | null;
  canHold: boolean;
  stats: GameStats;
  gameOver: boolean;
  paused: boolean;
  dropTime: number;
  lastDrop: number;
}

export interface HighScore {
  id: string;
  user_id: string;
  username: string;
  score: number;
  lines: number;
  level: number;
  duration: number;
  created_at: string;
}

export interface TetrisControls {
  moveLeft: () => void;
  moveRight: () => void;
  moveDown: () => void;
  rotate: () => void;
  hardDrop: () => void;
  hold: () => void;
  pause: () => void;
}
