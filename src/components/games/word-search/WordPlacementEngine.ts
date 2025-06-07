
export interface PlacedWord {
  word: string;
  startPos: [number, number];
  endPos: [number, number];
  direction: 'horizontal' | 'vertical' | 'diagonal-down' | 'diagonal-up';
  cells: string[]; // Array of "row-col" cell positions
}

export interface WordPlacementResult {
  grid: string[][];
  placedWords: PlacedWord[];
  success: boolean;
  failedWords: string[];
}

export class WordPlacementEngine {
  private gridSize: number;
  private grid: string[][];
  private placedWords: PlacedWord[];
  private random: () => number;

  constructor(gridSize: number, seed?: string) {
    this.gridSize = gridSize;
    this.grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
    this.placedWords = [];
    
    // Seeded random generator for consistent results
    if (seed) {
      this.random = this.createSeededRandom(seed);
    } else {
      this.random = Math.random;
    }
  }

  private createSeededRandom(seed: string): () => number {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return () => {
      hash = (hash * 9301 + 49297) % 233280;
      return hash / 233280;
    };
  }

  public placeWords(words: string[]): WordPlacementResult {
    console.log('Starting word placement for words:', words);
    
    // Sort words by length (longest first for better placement)
    const sortedWords = [...words].sort((a, b) => b.length - a.length);
    const failedWords: string[] = [];

    for (const word of sortedWords) {
      const success = this.placeWord(word.toUpperCase());
      if (!success) {
        console.warn(`Failed to place word: ${word}`);
        failedWords.push(word);
      }
    }

    // Fill empty cells with random letters
    this.fillEmptyCells();

    console.log('Word placement complete:', {
      totalWords: words.length,
      placedWords: this.placedWords.length,
      failedWords: failedWords.length,
      grid: this.grid
    });

    return {
      grid: this.grid,
      placedWords: this.placedWords,
      success: failedWords.length === 0,
      failedWords
    };
  }

  private placeWord(word: string): boolean {
    const directions: Array<{
      name: 'horizontal' | 'vertical' | 'diagonal-down' | 'diagonal-up';
      deltaRow: number;
      deltaCol: number;
    }> = [
      { name: 'horizontal', deltaRow: 0, deltaCol: 1 },
      { name: 'vertical', deltaRow: 1, deltaCol: 0 },
      { name: 'diagonal-down', deltaRow: 1, deltaCol: 1 },
      { name: 'diagonal-up', deltaRow: -1, deltaCol: 1 }
    ];

    // Try each direction multiple times
    for (let attempt = 0; attempt < 100; attempt++) {
      const direction = directions[Math.floor(this.random() * directions.length)];
      
      if (this.tryPlaceWordInDirection(word, direction)) {
        return true;
      }
    }

    return false;
  }

  private tryPlaceWordInDirection(
    word: string, 
    direction: { name: 'horizontal' | 'vertical' | 'diagonal-down' | 'diagonal-up'; deltaRow: number; deltaCol: number }
  ): boolean {
    const { deltaRow, deltaCol } = direction;
    
    // Calculate valid starting positions
    const maxStartRow = direction.name === 'diagonal-up' 
      ? this.gridSize - 1 
      : deltaRow === 0 ? this.gridSize - 1 : this.gridSize - word.length;
    const maxStartCol = deltaCol === 0 ? this.gridSize - 1 : this.gridSize - word.length;
    const minStartRow = direction.name === 'diagonal-up' ? word.length - 1 : 0;

    if (maxStartRow < minStartRow || maxStartCol < 0) {
      return false;
    }

    // Try random valid positions
    for (let attempt = 0; attempt < 50; attempt++) {
      const startRow = minStartRow + Math.floor(this.random() * (maxStartRow - minStartRow + 1));
      const startCol = Math.floor(this.random() * (maxStartCol + 1));

      if (this.canPlaceWordAt(word, startRow, startCol, deltaRow, deltaCol)) {
        this.placeWordAt(word, startRow, startCol, deltaRow, deltaCol, direction.name);
        return true;
      }
    }

    return false;
  }

  private canPlaceWordAt(word: string, startRow: number, startCol: number, deltaRow: number, deltaCol: number): boolean {
    for (let i = 0; i < word.length; i++) {
      const row = startRow + i * deltaRow;
      const col = startCol + i * deltaCol;

      // Check bounds
      if (row < 0 || row >= this.gridSize || col < 0 || col >= this.gridSize) {
        return false;
      }

      // Check if cell is empty or contains the same letter
      const existingLetter = this.grid[row][col];
      if (existingLetter !== '' && existingLetter !== word[i]) {
        return false;
      }
    }

    return true;
  }

  private placeWordAt(
    word: string, 
    startRow: number, 
    startCol: number, 
    deltaRow: number, 
    deltaCol: number,
    direction: 'horizontal' | 'vertical' | 'diagonal-down' | 'diagonal-up'
  ): void {
    const cells: string[] = [];
    
    for (let i = 0; i < word.length; i++) {
      const row = startRow + i * deltaRow;
      const col = startCol + i * deltaCol;
      this.grid[row][col] = word[i];
      cells.push(`${row}-${col}`);
    }

    const endRow = startRow + (word.length - 1) * deltaRow;
    const endCol = startCol + (word.length - 1) * deltaCol;

    this.placedWords.push({
      word,
      startPos: [startRow, startCol],
      endPos: [endRow, endCol],
      direction,
      cells
    });

    console.log(`Placed word "${word}" from (${startRow},${startCol}) to (${endRow},${endCol}) direction: ${direction}`);
  }

  private fillEmptyCells(): void {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        if (this.grid[row][col] === '') {
          this.grid[row][col] = letters[Math.floor(this.random() * letters.length)];
        }
      }
    }
  }

  public validatePlacement(wordList: string[]): boolean {
    const upperWords = wordList.map(w => w.toUpperCase());
    const placedWordStrings = this.placedWords.map(w => w.word);
    
    // Check all words were placed
    for (const word of upperWords) {
      if (!placedWordStrings.includes(word)) {
        console.error(`Word "${word}" was not placed in grid`);
        return false;
      }
    }

    // Validate each placed word exists in grid
    for (const placedWord of this.placedWords) {
      if (!this.validateWordInGrid(placedWord)) {
        console.error(`Placed word "${placedWord.word}" validation failed`);
        return false;
      }
    }

    return true;
  }

  private validateWordInGrid(placedWord: PlacedWord): boolean {
    const { word, cells } = placedWord;
    
    if (cells.length !== word.length) {
      return false;
    }

    for (let i = 0; i < word.length; i++) {
      const [row, col] = cells[i].split('-').map(Number);
      if (this.grid[row][col] !== word[i]) {
        return false;
      }
    }

    return true;
  }
}
