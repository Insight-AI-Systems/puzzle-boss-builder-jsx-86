
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
    const maxAttempts = 200; // Increased attempts for more complex placement
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const direction = this.getRandomDirection();
      const startRow = Math.floor(Math.random() * this.gridSize);
      const startCol = Math.floor(Math.random() * this.gridSize);
      
      if (this.canPlaceWord(word, startRow, startCol, direction)) {
        const { endRow, endCol, cells } = this.calculateWordPlacement(word, startRow, startCol, direction);
        
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

  private canPlaceWord(word: string, row: number, col: number, direction: 'horizontal' | 'vertical' | 'diagonal-dr' | 'diagonal-dl'): boolean {
    const { deltaRow, deltaCol } = this.getDirectionDeltas(direction);
    
    // Check if word fits within grid bounds
    const endRow = row + (deltaRow * (word.length - 1));
    const endCol = col + (deltaCol * (word.length - 1));
    
    if (endRow < 0 || endRow >= this.gridSize || endCol < 0 || endCol >= this.gridSize) {
      return false;
    }
    
    // Check if each position is available or matches the letter
    for (let i = 0; i < word.length; i++) {
      const currentRow = row + (deltaRow * i);
      const currentCol = col + (deltaCol * i);
      const currentCell = this.grid[currentRow][currentCol];
      
      if (currentCell !== '' && currentCell !== word[i]) {
        return false;
      }
    }
    
    return true;
  }

  private calculateWordPlacement(word: string, startRow: number, startCol: number, direction: 'horizontal' | 'vertical' | 'diagonal-dr' | 'diagonal-dl') {
    const { deltaRow, deltaCol } = this.getDirectionDeltas(direction);
    
    const endRow = startRow + (deltaRow * (word.length - 1));
    const endCol = startCol + (deltaCol * (word.length - 1));
    
    const cells: Cell[] = [];
    for (let i = 0; i < word.length; i++) {
      const row = startRow + (deltaRow * i);
      const col = startCol + (deltaCol * i);
      cells.push({ row, col });
    }
    
    return { endRow, endCol, cells };
  }

  private getDirectionDeltas(direction: 'horizontal' | 'vertical' | 'diagonal-dr' | 'diagonal-dl') {
    switch (direction) {
      case 'horizontal':
        return { deltaRow: 0, deltaCol: 1 }; // Left to right
      case 'vertical':
        return { deltaRow: 1, deltaCol: 0 }; // Top to bottom
      case 'diagonal-dr':
        return { deltaRow: 1, deltaCol: 1 }; // Top-left to bottom-right
      case 'diagonal-dl':
        return { deltaRow: 1, deltaCol: -1 }; // Top-right to bottom-left
      default:
        return { deltaRow: 0, deltaCol: 1 };
    }
  }

  private placeWord(placement: PlacedWord): void {
    const { word, startRow, startCol, direction } = placement;
    const { deltaRow, deltaCol } = this.getDirectionDeltas(direction);
    
    for (let i = 0; i < word.length; i++) {
      const row = startRow + (deltaRow * i);
      const col = startCol + (deltaCol * i);
      this.grid[row][col] = word[i];
    }
  }

  private getRandomDirection(): 'horizontal' | 'vertical' | 'diagonal-dr' | 'diagonal-dl' {
    const directions: ('horizontal' | 'vertical' | 'diagonal-dr' | 'diagonal-dl')[] = [
      'horizontal', 
      'vertical', 
      'diagonal-dr', 
      'diagonal-dl'
    ];
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
