
export interface PuzzleConfig {
  imageUrl: string;
  rows: number;
  columns: number;
  showNumbers: boolean;
  puzzleId: string;
  gameMode?: string;
  cacheBuster?: number;
}

export interface PuzzlePiece {
  id: number;
  row: number;
  col: number;
  correctX: number;
  correctY: number;
  width: number;
  height: number;
  isCorrect: boolean;
  sprite?: Phaser.GameObjects.Sprite;
  numberText?: Phaser.GameObjects.Text;
}

export interface GameStats {
  moves: number;
  time: number;
  completionPercentage?: number;
}
