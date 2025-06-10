
export interface MahjongTile {
  id: string;
  type: 'bamboo' | 'circle' | 'character' | 'wind' | 'dragon' | 'flower' | 'season';
  value: number | string;
  row: number;
  col: number;
  layer: number;
  isSelected: boolean;
  isMatched: boolean;
  isBlocked: boolean;
  x: number;
  y: number;
}

export interface MahjongGameState {
  tiles: MahjongTile[];
  selectedTiles: MahjongTile[];
  score: number;
  moves: number;
  hintsUsed: number;
  timeElapsed: number;
  isComplete: boolean;
  isGameOver: boolean;
  difficulty: 'rookie' | 'pro' | 'master';
  layout: string;
}

export interface MahjongLayout {
  name: string;
  difficulty: 'rookie' | 'pro' | 'master';
  positions: Array<{ row: number; col: number; layer: number }>;
}

export const TILE_TYPES = {
  bamboo: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  circle: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  character: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  wind: ['east', 'south', 'west', 'north'],
  dragon: ['red', 'green', 'white'],
  flower: [1, 2, 3, 4],
  season: [1, 2, 3, 4]
};
