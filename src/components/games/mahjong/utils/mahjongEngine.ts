import { MahjongTile, MahjongLayout, TILE_TYPES } from '../types/mahjongTypes';

// Classic turtle layout for different difficulties
export const MAHJONG_LAYOUTS: MahjongLayout[] = [
  {
    name: 'Simple',
    difficulty: 'rookie',
    positions: [
      // Layer 0 - Base layer (simplified)
      ...Array.from({ length: 8 }, (_, row) => 
        Array.from({ length: 14 }, (_, col) => ({ row, col, layer: 0 }))
      ).flat().filter((_, index) => index % 2 === 0), // Simplified pattern
    ]
  },
  {
    name: 'Classic',
    difficulty: 'pro',
    positions: [
      // Full turtle layout - this is a simplified version
      // Layer 0
      { row: 1, col: 2, layer: 0 }, { row: 1, col: 3, layer: 0 }, { row: 1, col: 4, layer: 0 },
      { row: 1, col: 8, layer: 0 }, { row: 1, col: 9, layer: 0 }, { row: 1, col: 10, layer: 0 },
      { row: 2, col: 0, layer: 0 }, { row: 2, col: 1, layer: 0 }, { row: 2, col: 2, layer: 0 },
      { row: 2, col: 3, layer: 0 }, { row: 2, col: 4, layer: 0 }, { row: 2, col: 5, layer: 0 },
      { row: 2, col: 6, layer: 0 }, { row: 2, col: 7, layer: 0 }, { row: 2, col: 8, layer: 0 },
      { row: 2, col: 9, layer: 0 }, { row: 2, col: 10, layer: 0 }, { row: 2, col: 11, layer: 0 },
      { row: 2, col: 12, layer: 0 }, { row: 3, col: 1, layer: 0 }, { row: 3, col: 2, layer: 0 },
      { row: 3, col: 3, layer: 0 }, { row: 3, col: 4, layer: 0 }, { row: 3, col: 5, layer: 0 },
      { row: 3, col: 6, layer: 0 }, { row: 3, col: 7, layer: 0 }, { row: 3, col: 8, layer: 0 },
      { row: 3, col: 9, layer: 0 }, { row: 3, col: 10, layer: 0 }, { row: 3, col: 11, layer: 0 },
      // Layer 1
      { row: 2, col: 2, layer: 1 }, { row: 2, col: 3, layer: 1 }, { row: 2, col: 4, layer: 1 },
      { row: 2, col: 8, layer: 1 }, { row: 2, col: 9, layer: 1 }, { row: 2, col: 10, layer: 1 },
    ]
  },
  {
    name: 'Master',
    difficulty: 'master',
    positions: [
      // Complex multi-layer layout
      ...Array.from({ length: 144 }, (_, index) => {
        const layer = Math.floor(index / 48);
        const remaining = index % 48;
        const row = Math.floor(remaining / 12);
        const col = remaining % 12;
        return { row, col, layer };
      })
    ]
  }
];

export function generateTileSet(): Omit<MahjongTile, 'row' | 'col' | 'layer' | 'x' | 'y' | 'isSelected' | 'isMatched' | 'isBlocked'>[] {
  const tiles: Omit<MahjongTile, 'row' | 'col' | 'layer' | 'x' | 'y' | 'isSelected' | 'isMatched' | 'isBlocked'>[] = [];
  
  // Generate 4 of each numbered tile
  ['bamboo', 'circle', 'character'].forEach(type => {
    TILE_TYPES[type as keyof typeof TILE_TYPES].forEach(value => {
      for (let i = 0; i < 4; i++) {
        tiles.push({
          id: `${type}-${value}-${i}`,
          type: type as any,
          value
        });
      }
    });
  });
  
  // Generate 4 of each wind tile
  TILE_TYPES.wind.forEach(value => {
    for (let i = 0; i < 4; i++) {
      tiles.push({
        id: `wind-${value}-${i}`,
        type: 'wind',
        value
      });
    }
  });
  
  // Generate 4 of each dragon tile
  TILE_TYPES.dragon.forEach(value => {
    for (let i = 0; i < 4; i++) {
      tiles.push({
        id: `dragon-${value}-${i}`,
        type: 'dragon',
        value
      });
    }
  });
  
  return tiles;
}

export function createMahjongBoard(layout: MahjongLayout): MahjongTile[] {
  const tileSet = generateTileSet();
  const shuffledTiles = [...tileSet].sort(() => Math.random() - 0.5);
  
  return layout.positions.map((pos, index) => ({
    ...shuffledTiles[index % shuffledTiles.length],
    id: `tile-${index}`,
    row: pos.row,
    col: pos.col,
    layer: pos.layer,
    x: pos.col * 30 + pos.layer * 2,
    y: pos.row * 40 + pos.layer * 2,
    isSelected: false,
    isMatched: false,
    isBlocked: false
  }));
}

export function updateBlockedStatus(tiles: MahjongTile[]): MahjongTile[] {
  return tiles.map(tile => {
    if (tile.isMatched) {
      return { ...tile, isBlocked: false };
    }
    
    // Check if tile is blocked by tiles above
    const hasAbove = tiles.some(t => 
      !t.isMatched && 
      t.layer > tile.layer &&
      Math.abs(t.row - tile.row) <= 1 &&
      Math.abs(t.col - tile.col) <= 1
    );
    
    if (hasAbove) {
      return { ...tile, isBlocked: true };
    }
    
    // Check if tile is blocked on left and right
    const leftBlocked = tiles.some(t => 
      !t.isMatched && 
      t.layer === tile.layer &&
      t.row === tile.row &&
      t.col === tile.col - 1
    );
    
    const rightBlocked = tiles.some(t => 
      !t.isMatched && 
      t.layer === tile.layer &&
      t.row === tile.row &&
      t.col === tile.col + 1
    );
    
    return { ...tile, isBlocked: leftBlocked && rightBlocked };
  });
}

export function canMatch(tile1: MahjongTile, tile2: MahjongTile): boolean {
  if (tile1.id === tile2.id) return false;
  if (tile1.isMatched || tile2.isMatched) return false;
  if (tile1.isBlocked || tile2.isBlocked) return false;
  
  // Flowers and seasons can match with any in their category
  if (tile1.type === 'flower' && tile2.type === 'flower') return true;
  if (tile1.type === 'season' && tile2.type === 'season') return true;
  
  // Other tiles must match exactly
  return tile1.type === tile2.type && tile1.value === tile2.value;
}

export function findAvailableMatches(tiles: MahjongTile[]): MahjongTile[][] {
  const availableTiles = tiles.filter(t => !t.isMatched && !t.isBlocked);
  const matches: MahjongTile[][] = [];
  
  for (let i = 0; i < availableTiles.length; i++) {
    for (let j = i + 1; j < availableTiles.length; j++) {
      if (canMatch(availableTiles[i], availableTiles[j])) {
        matches.push([availableTiles[i], availableTiles[j]]);
      }
    }
  }
  
  return matches;
}

export function calculateScore(moves: number, timeElapsed: number, hintsUsed: number): number {
  const baseScore = 1000;
  const timeBonus = Math.max(0, 600 - timeElapsed); // Bonus for completing quickly
  const movesPenalty = moves * 2; // Penalty for more moves
  const hintsPenalty = hintsUsed * 10; // Penalty for using hints
  
  return Math.max(0, baseScore + timeBonus - movesPenalty - hintsPenalty);
}
