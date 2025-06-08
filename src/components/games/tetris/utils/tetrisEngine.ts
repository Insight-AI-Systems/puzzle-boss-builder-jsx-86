
import { TetrisGameState, Block, Cell, Position } from '../types/tetrisTypes';
import { createBlock, getRandomBlockType } from './tetrisShapes';

export const GRID_WIDTH = 10;
export const GRID_HEIGHT = 20;
export const INITIAL_DROP_TIME = 1000;

export function createEmptyGrid(): Cell[][] {
  return Array(GRID_HEIGHT).fill(null).map(() =>
    Array(GRID_WIDTH).fill(null).map(() => ({
      filled: false,
      color: '',
      type: null
    }))
  );
}

export function createInitialGameState(): TetrisGameState {
  const firstBlockType = getRandomBlockType();
  const secondBlockType = getRandomBlockType();
  
  return {
    grid: createEmptyGrid(),
    currentBlock: createBlock(firstBlockType),
    nextBlock: createBlock(secondBlockType),
    holdBlock: null,
    canHold: true,
    stats: {
      score: 0,
      lines: 0,
      level: 1,
      tetrises: 0
    },
    gameOver: false,
    paused: false,
    dropTime: INITIAL_DROP_TIME,
    lastDrop: Date.now()
  };
}

export function isValidPosition(grid: Cell[][], block: Block, position: Position): boolean {
  for (let y = 0; y < block.shape.length; y++) {
    for (let x = 0; x < block.shape[y].length; x++) {
      if (block.shape[y][x]) {
        const newX = position.x + x;
        const newY = position.y + y;
        
        // Check boundaries
        if (newX < 0 || newX >= GRID_WIDTH || newY >= GRID_HEIGHT) {
          return false;
        }
        
        // Check collision with existing blocks
        if (newY >= 0 && grid[newY][newX].filled) {
          return false;
        }
      }
    }
  }
  return true;
}

export function placeBlock(grid: Cell[][], block: Block): Cell[][] {
  const newGrid = grid.map(row => [...row]);
  
  for (let y = 0; y < block.shape.length; y++) {
    for (let x = 0; x < block.shape[y].length; x++) {
      if (block.shape[y][x] && block.position.y + y >= 0) {
        const gridY = block.position.y + y;
        const gridX = block.position.x + x;
        
        if (gridY < GRID_HEIGHT && gridX < GRID_WIDTH) {
          newGrid[gridY][gridX] = {
            filled: true,
            color: block.color,
            type: block.type
          };
        }
      }
    }
  }
  
  return newGrid;
}

export function clearLines(grid: Cell[][]): { newGrid: Cell[][], linesCleared: number } {
  const fullLines: number[] = [];
  
  // Find full lines
  for (let y = 0; y < GRID_HEIGHT; y++) {
    if (grid[y].every(cell => cell.filled)) {
      fullLines.push(y);
    }
  }
  
  if (fullLines.length === 0) {
    return { newGrid: grid, linesCleared: 0 };
  }
  
  // Remove full lines and add empty lines at top
  let newGrid = grid.filter((_, index) => !fullLines.includes(index));
  
  // Add empty lines at the top
  for (let i = 0; i < fullLines.length; i++) {
    newGrid.unshift(Array(GRID_WIDTH).fill(null).map(() => ({
      filled: false,
      color: '',
      type: null
    })));
  }
  
  return { newGrid, linesCleared: fullLines.length };
}

export function calculateScore(linesCleared: number, level: number): number {
  const baseScores = [0, 40, 100, 300, 1200]; // 0, single, double, triple, tetris
  return baseScores[linesCleared] * level;
}

export function calculateLevel(totalLines: number): number {
  return Math.floor(totalLines / 10) + 1;
}

export function calculateDropTime(level: number): number {
  return Math.max(50, INITIAL_DROP_TIME - (level - 1) * 50);
}

export function findGhostPosition(grid: Cell[][], block: Block): Position {
  let ghostY = block.position.y;
  
  while (isValidPosition(grid, block, { x: block.position.x, y: ghostY + 1 })) {
    ghostY++;
  }
  
  return { x: block.position.x, y: ghostY };
}
