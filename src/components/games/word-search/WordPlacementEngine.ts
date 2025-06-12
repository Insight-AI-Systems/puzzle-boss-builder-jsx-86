
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
    
    // Try to place up to 20 words
    for (const word of words.slice(0, 20)) {
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
    const maxAttempts = 500; // Increased attempts for better placement
    const directions = this.getAllDirections();
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      // Randomly select direction to ensure good distribution
      const direction = directions[Math.floor(Math.random() * directions.length)];
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

  private getAllDirections(): ('horizontal' | 'vertical' | 'diagonal-dr' | 'diagonal-dl' | 'horizontal-reverse' | 'vertical-reverse' | 'diagonal-ur' | 'diagonal-ul')[] {
    return [
      'horizontal',           // Left to right
      'horizontal-reverse',   // Right to left
      'vertical',            // Top to bottom
      'vertical-reverse',    // Bottom to top
      'diagonal-dr',         // Top-left to bottom-right
      'diagonal-dl',         // Top-right to bottom-left
      'diagonal-ur',         // Bottom-left to top-right
      'diagonal-ul'          // Bottom-right to top-left
    ];
  }

  private canPlaceWord(word: string, row: number, col: number, direction: 'horizontal' | 'vertical' | 'diagonal-dr' | 'diagonal-dl' | 'horizontal-reverse' | 'vertical-reverse' | 'diagonal-ur' | 'diagonal-ul'): boolean {
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

  private calculateWordPlacement(word: string, startRow: number, startCol: number, direction: 'horizontal' | 'vertical' | 'diagonal-dr' | 'diagonal-dl' | 'horizontal-reverse' | 'vertical-reverse' | 'diagonal-ur' | 'diagonal-ul') {
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

  private getDirectionDeltas(direction: 'horizontal' | 'vertical' | 'diagonal-dr' | 'diagonal-dl' | 'horizontal-reverse' | 'vertical-reverse' | 'diagonal-ur' | 'diagonal-ul') {
    switch (direction) {
      case 'horizontal':
        return { deltaRow: 0, deltaCol: 1 }; // Left to right
      case 'horizontal-reverse':
        return { deltaRow: 0, deltaCol: -1 }; // Right to left
      case 'vertical':
        return { deltaRow: 1, deltaCol: 0 }; // Top to bottom
      case 'vertical-reverse':
        return { deltaRow: -1, deltaCol: 0 }; // Bottom to top
      case 'diagonal-dr':
        return { deltaRow: 1, deltaCol: 1 }; // Top-left to bottom-right
      case 'diagonal-dl':
        return { deltaRow: 1, deltaCol: -1 }; // Top-right to bottom-left
      case 'diagonal-ur':
        return { deltaRow: -1, deltaCol: 1 }; // Bottom-left to top-right
      case 'diagonal-ul':
        return { deltaRow: -1, deltaCol: -1 }; // Bottom-right to top-left
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

  private getRandomDirection(): 'horizontal' | 'vertical' | 'diagonal-dr' | 'diagonal-dl' | 'horizontal-reverse' | 'vertical-reverse' | 'diagonal-ur' | 'diagonal-ul' {
    const directions = this.getAllDirections();
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
