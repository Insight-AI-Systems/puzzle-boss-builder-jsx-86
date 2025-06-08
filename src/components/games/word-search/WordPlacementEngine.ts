
import type { PlacedWord, Cell } from '@/business/engines/word-search/types';

export class WordPlacementEngine {
  private gridSize: number;
  private grid: string[][];
  
  constructor(gridSize: number = 15) {
    this.gridSize = gridSize;
    this.grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
  }

  placeWords(words: string[]): { grid: string[][], placedWords: PlacedWord[] } {
    const placedWords: PlacedWord[] = [];
    
    for (const word of words.slice(0, 8)) {
      const placement = this.findPlacement(word);
      if (placement) {
        this.placeWord(placement);
        placedWords.push(placement);
      }
    }
    
    this.fillEmptyCells();
    
    return { grid: this.grid, placedWords };
  }

  private findPlacement(word: string): PlacedWord | null {
    const maxAttempts = 100;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const direction = this.getRandomDirection();
      const startRow = Math.floor(Math.random() * this.gridSize);
      const startCol = Math.floor(Math.random() * this.gridSize);
      
      if (this.canPlaceWord(word, startRow, startCol, direction)) {
        const endRow = direction === 'vertical' ? startRow + word.length - 1 : startRow;
        const endCol = direction === 'horizontal' ? startCol + word.length - 1 : startCol;
        
        const cells: Cell[] = [];
        for (let i = 0; i < word.length; i++) {
          const row = direction === 'vertical' ? startRow + i : startRow;
          const col = direction === 'horizontal' ? startCol + i : startCol;
          cells.push({ row, col });
        }
        
        return {
          word,
          startRow,
          startCol,
          endRow,
          endCol,
          direction,
          cells
        };
      }
    }
    
    return null;
  }

  private canPlaceWord(word: string, row: number, col: number, direction: 'horizontal' | 'vertical' | 'diagonal'): boolean {
    if (direction === 'horizontal') {
      if (col + word.length > this.gridSize) return false;
      for (let i = 0; i < word.length; i++) {
        if (this.grid[row][col + i] !== '' && this.grid[row][col + i] !== word[i]) {
          return false;
        }
      }
    } else if (direction === 'vertical') {
      if (row + word.length > this.gridSize) return false;
      for (let i = 0; i < word.length; i++) {
        if (this.grid[row + i][col] !== '' && this.grid[row + i][col] !== word[i]) {
          return false;
        }
      }
    }
    
    return true;
  }

  private placeWord(placement: PlacedWord): void {
    const { word, startRow, startCol, direction } = placement;
    
    for (let i = 0; i < word.length; i++) {
      if (direction === 'horizontal') {
        this.grid[startRow][startCol + i] = word[i];
      } else if (direction === 'vertical') {
        this.grid[startRow + i][startCol] = word[i];
      }
    }
  }

  private getRandomDirection(): 'horizontal' | 'vertical' | 'diagonal' {
    const directions: ('horizontal' | 'vertical' | 'diagonal')[] = ['horizontal', 'vertical'];
    return directions[Math.floor(Math.random() * directions.length)];
  }

  private fillEmptyCells(): void {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        if (this.grid[row][col] === '') {
          this.grid[row][col] = letters[Math.floor(Math.random() * letters.length)];
        }
      }
    }
  }
}
