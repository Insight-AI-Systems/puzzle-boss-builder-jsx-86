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
  private maxAttempts: number;

  constructor(gridSize: number, seed?: string) {
    this.gridSize = gridSize;
    this.grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
    this.placedWords = [];
    this.maxAttempts = 2000; // Increased from 1000
    
    // Improved seeded random generator for consistent results
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
    
    // Ensure hash is positive and non-zero
    if (hash === 0) hash = 1;
    if (hash < 0) hash = Math.abs(hash);
    
    return () => {
      hash = (hash * 9301 + 49297) % 233280;
      const result = hash / 233280;
      // Ensure result is always between 0 and 1
      return Math.max(0, Math.min(0.999999, result));
    };
  }

  public placeWords(words: string[]): WordPlacementResult {
    console.log('Starting word placement for words:', words);
    
    if (!words || words.length === 0) {
      console.warn('No words provided for placement');
      return {
        grid: this.grid,
        placedWords: [],
        success: false,
        failedWords: []
      };
    }

    // Reset state for new placement
    this.grid = Array(this.gridSize).fill(null).map(() => Array(this.gridSize).fill(''));
    this.placedWords = [];
    
    // Sort words by length (longest first for better placement)
    const sortedWords = [...words].sort((a, b) => b.length - a.length);
    const failedWords: string[] = [];
    let retryCount = 0;
    const maxRetries = 3;

    // Retry entire placement if too many words fail
    while (retryCount < maxRetries) {
      this.grid = Array(this.gridSize).fill(null).map(() => Array(this.gridSize).fill(''));
      this.placedWords = [];
      failedWords.length = 0;

      for (const word of sortedWords) {
        try {
          const cleanWord = word.toUpperCase().trim();
          if (!cleanWord || cleanWord.length === 0) {
            console.warn(`Skipping empty word: "${word}"`);
            failedWords.push(word);
            continue;
          }

          if (cleanWord.length > this.gridSize) {
            console.warn(`Word "${cleanWord}" is too long for grid size ${this.gridSize}`);
            failedWords.push(word);
            continue;
          }

          const success = this.placeWordWithRetry(cleanWord);
          if (!success) {
            console.warn(`Failed to place word after ${this.maxAttempts} attempts: ${cleanWord}`);
            failedWords.push(word);
          }
        } catch (error) {
          console.error(`Error placing word "${word}":`, error);
          failedWords.push(word);
        }
      }

      // If we successfully placed most words, break
      const successRate = (this.placedWords.length / words.length);
      if (successRate >= 0.9 || failedWords.length === 0) {
        break;
      }

      retryCount++;
      console.log(`Retry attempt ${retryCount} - Success rate: ${(successRate * 100).toFixed(1)}%`);
    }

    // Fill empty cells with random letters
    this.fillEmptyCells();

    console.log('Word placement complete:', {
      totalWords: words.length,
      placedWords: this.placedWords.length,
      failedWords: failedWords.length,
      successRate: `${((this.placedWords.length / words.length) * 100).toFixed(1)}%`,
      retries: retryCount
    });

    return {
      grid: this.grid,
      placedWords: this.placedWords,
      success: failedWords.length === 0,
      failedWords
    };
  }

  private placeWordWithRetry(word: string): boolean {
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

    // Try each direction multiple times with different strategies
    for (let attempt = 0; attempt < this.maxAttempts; attempt++) {
      try {
        // Rotate through directions more evenly
        const directionIndex = attempt % directions.length;
        const direction = directions[directionIndex];
        
        // Additional safety check
        if (!direction) {
          console.warn(`Invalid direction at index ${directionIndex}, retrying...`);
          continue;
        }
        
        if (this.tryPlaceWordInDirection(word, direction)) {
          return true;
        }

        // Every 100 attempts, try with more lenient placement (allow some overlaps)
        if (attempt > 0 && attempt % 100 === 0) {
          if (this.tryPlaceWordWithOverlap(word, direction)) {
            return true;
          }
        }
      } catch (error) {
        console.error(`Error in placement attempt ${attempt + 1} for word "${word}":`, error);
        continue;
      }
    }

    return false;
  }

  private tryPlaceWordInDirection(
    word: string, 
    direction: { name: 'horizontal' | 'vertical' | 'diagonal-down' | 'diagonal-up'; deltaRow: number; deltaCol: number }
  ): boolean {
    if (!direction || !word) {
      return false;
    }

    const { deltaRow, deltaCol } = direction;
    
    // Calculate valid starting positions with proper bounds checking
    let maxStartRow: number;
    let minStartRow: number;
    let maxStartCol: number;
    
    if (direction.name === 'diagonal-up') {
      maxStartRow = this.gridSize - 1;
      minStartRow = word.length - 1;
    } else if (deltaRow === 0) {
      maxStartRow = this.gridSize - 1;
      minStartRow = 0;
    } else {
      maxStartRow = this.gridSize - word.length;
      minStartRow = 0;
    }
    
    if (deltaCol === 0) {
      maxStartCol = this.gridSize - 1;
    } else {
      maxStartCol = this.gridSize - word.length;
    }

    // Validate bounds
    if (maxStartRow < minStartRow || maxStartCol < 0 || maxStartRow < 0 || maxStartCol < 0) {
      return false;
    }

    // Try random valid positions with improved distribution
    const maxPositionAttempts = 100; // Increased from 50
    for (let attempt = 0; attempt < maxPositionAttempts; attempt++) {
      try {
        const rowRange = maxStartRow - minStartRow + 1;
        const colRange = maxStartCol + 1;
        
        if (rowRange <= 0 || colRange <= 0) {
          break;
        }
        
        const startRow = minStartRow + Math.floor(this.random() * rowRange);
        const startCol = Math.floor(this.random() * colRange);

        // Validate calculated position
        if (startRow < 0 || startRow >= this.gridSize || startCol < 0 || startCol >= this.gridSize) {
          continue;
        }

        if (this.canPlaceWordAt(word, startRow, startCol, deltaRow, deltaCol)) {
          this.placeWordAt(word, startRow, startCol, deltaRow, deltaCol, direction.name);
          return true;
        }
      } catch (error) {
        console.error(`Error in position attempt ${attempt + 1}:`, error);
        continue;
      }
    }

    return false;
  }

  private tryPlaceWordWithOverlap(
    word: string, 
    direction: { name: 'horizontal' | 'vertical' | 'diagonal-down' | 'diagonal-up'; deltaRow: number; deltaCol: number }
  ): boolean {
    if (!direction || !word) {
      return false;
    }

    const { deltaRow, deltaCol } = direction;
    
    // More lenient placement allowing some character overlaps
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        if (this.canPlaceWordWithOverlap(word, row, col, deltaRow, deltaCol)) {
          this.placeWordAt(word, row, col, deltaRow, deltaCol, direction.name);
          return true;
        }
      }
    }

    return false;
  }

  private canPlaceWordWithOverlap(word: string, startRow: number, startCol: number, deltaRow: number, deltaCol: number): boolean {
    try {
      let overlapCount = 0;
      const maxOverlaps = Math.floor(word.length * 0.3); // Allow up to 30% overlap

      for (let i = 0; i < word.length; i++) {
        const row = startRow + i * deltaRow;
        const col = startCol + i * deltaCol;

        // Check bounds
        if (row < 0 || row >= this.gridSize || col < 0 || col >= this.gridSize) {
          return false;
        }

        const existingLetter = this.grid[row][col];
        if (existingLetter !== '' && existingLetter !== word[i]) {
          overlapCount++;
          if (overlapCount > maxOverlaps) {
            return false;
          }
        }
      }
      return true;
    } catch (error) {
      console.error('Error in canPlaceWordWithOverlap:', error);
      return false;
    }
  }

  private canPlaceWordAt(word: string, startRow: number, startCol: number, deltaRow: number, deltaCol: number): boolean {
    try {
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
    } catch (error) {
      console.error('Error in canPlaceWordAt:', error);
      return false;
    }
  }

  private placeWordAt(
    word: string, 
    startRow: number, 
    startCol: number, 
    deltaRow: number, 
    deltaCol: number,
    direction: 'horizontal' | 'vertical' | 'diagonal-down' | 'diagonal-up'
  ): void {
    try {
      const cells: string[] = [];
      
      for (let i = 0; i < word.length; i++) {
        const row = startRow + i * deltaRow;
        const col = startCol + i * deltaCol;
        
        // Double-check bounds before placing
        if (row >= 0 && row < this.gridSize && col >= 0 && col < this.gridSize) {
          this.grid[row][col] = word[i];
          cells.push(`${row}-${col}`);
        } else {
          throw new Error(`Invalid position during placement: (${row}, ${col})`);
        }
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

      console.log(`Successfully placed word "${word}" from (${startRow},${startCol}) to (${endRow},${endCol}) direction: ${direction}`);
    } catch (error) {
      console.error(`Error placing word "${word}":`, error);
      throw error;
    }
  }

  private fillEmptyCells(): void {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    try {
      for (let row = 0; row < this.gridSize; row++) {
        for (let col = 0; col < this.gridSize; col++) {
          if (this.grid[row][col] === '') {
            const letterIndex = Math.floor(this.random() * letters.length);
            this.grid[row][col] = letters[letterIndex] || 'A'; // Fallback to 'A'
          }
        }
      }
    } catch (error) {
      console.error('Error filling empty cells:', error);
      // Fill remaining empty cells with 'A' as fallback
      for (let row = 0; row < this.gridSize; row++) {
        for (let col = 0; col < this.gridSize; col++) {
          if (this.grid[row][col] === '') {
            this.grid[row][col] = 'A';
          }
        }
      }
    }
  }

  public validatePlacement(wordList: string[]): boolean {
    try {
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
    } catch (error) {
      console.error('Error during validation:', error);
      return false;
    }
  }

  private validateWordInGrid(placedWord: PlacedWord): boolean {
    try {
      const { word, cells } = placedWord;
      
      if (!cells || cells.length !== word.length) {
        return false;
      }

      for (let i = 0; i < word.length; i++) {
        const cellParts = cells[i].split('-');
        if (cellParts.length !== 2) {
          return false;
        }
        
        const row = parseInt(cellParts[0], 10);
        const col = parseInt(cellParts[1], 10);
        
        if (isNaN(row) || isNaN(col) || row < 0 || row >= this.gridSize || col < 0 || col >= this.gridSize) {
          return false;
        }
        
        if (this.grid[row][col] !== word[i]) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error validating word in grid:', error);
      return false;
    }
  }
}
