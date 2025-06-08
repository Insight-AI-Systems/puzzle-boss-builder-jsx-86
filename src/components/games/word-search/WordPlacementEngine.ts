
import { PlacedWord, Cell } from '@/business/engines/word-search/types';

export class WordPlacementEngine {
  static placeWords(words: string[], grid: string[][]): PlacedWord[] {
    const placedWords: PlacedWord[] = [];
    const gridSize = grid.length;
    
    for (const word of words) {
      const placement = this.findPlacement(word, grid, gridSize);
      if (placement) {
        placedWords.push(placement);
        this.placeWordInGrid(placement, grid);
      }
    }
    
    return placedWords;
  }
  
  private static findPlacement(word: string, grid: string[][], gridSize: number): PlacedWord | null {
    const directions = ['horizontal', 'vertical', 'diagonal'] as const;
    
    for (let attempts = 0; attempts < 100; attempts++) {
      const direction = directions[Math.floor(Math.random() * directions.length)];
      const startRow = Math.floor(Math.random() * gridSize);
      const startCol = Math.floor(Math.random() * gridSize);
      
      if (this.canPlaceWord(word, startRow, startCol, direction, grid, gridSize)) {
        const cells = this.getWordCells(startRow, startCol, word.length, direction);
        return {
          word,
          startRow,
          startCol,
          direction,
          cells
        };
      }
    }
    
    return null;
  }
  
  private static canPlaceWord(
    word: string, 
    startRow: number, 
    startCol: number, 
    direction: string, 
    grid: string[][], 
    gridSize: number
  ): boolean {
    const { rowDir, colDir } = this.getDirection(direction);
    
    for (let i = 0; i < word.length; i++) {
      const row = startRow + i * rowDir;
      const col = startCol + i * colDir;
      
      if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) {
        return false;
      }
      
      if (grid[row][col] !== '' && grid[row][col] !== word[i]) {
        return false;
      }
    }
    
    return true;
  }
  
  private static getDirection(direction: string): { rowDir: number; colDir: number } {
    switch (direction) {
      case 'horizontal': return { rowDir: 0, colDir: 1 };
      case 'vertical': return { rowDir: 1, colDir: 0 };
      case 'diagonal': return { rowDir: 1, colDir: 1 };
      default: return { rowDir: 0, colDir: 1 };
    }
  }
  
  private static getWordCells(startRow: number, startCol: number, length: number, direction: string): Cell[] {
    const { rowDir, colDir } = this.getDirection(direction);
    const cells: Cell[] = [];
    
    for (let i = 0; i < length; i++) {
      const row = startRow + i * rowDir;
      const col = startCol + i * colDir;
      cells.push({ row, col });
    }
    
    return cells;
  }
  
  private static placeWordInGrid(placement: PlacedWord, grid: string[][]): void {
    const { word, startRow, startCol, direction } = placement;
    const { rowDir, colDir } = this.getDirection(direction);
    
    for (let i = 0; i < word.length; i++) {
      const row = startRow + i * rowDir;
      const col = startCol + i * colDir;
      grid[row][col] = word[i];
    }
  }
}
