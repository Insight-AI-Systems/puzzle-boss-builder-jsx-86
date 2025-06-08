
import { GameEngine } from '../GameEngine';
import { BaseGameState, GameConfig, MoveValidationResult, WinConditionResult, GameEvent } from '../../models/GameState';

// Word search specific state
export interface WordSearchState extends BaseGameState {
  grid: string[][];
  words: string[];
  foundWords: Set<string>;
  selectedCells: Array<{ row: number; col: number }>;
  currentSelection: Array<{ row: number; col: number }>;
  difficulty: 'rookie' | 'pro' | 'master';
  timeElapsed: number;
  hintsUsed: number;
}

// Word placement information
export interface PlacedWord {
  word: string;
  startRow: number;
  startCol: number;
  direction: 'horizontal' | 'vertical' | 'diagonal';
  cells: Array<{ row: number; col: number }>;
}

// Move types for word search
export type WordSearchMove = 
  | { type: 'SELECT_CELLS'; cells: Array<{ row: number; col: number }> }
  | { type: 'VALIDATE_SELECTION' }
  | { type: 'HINT' };

export class WordSearchEngine extends GameEngine<WordSearchState, WordSearchMove> {
  private placedWords: PlacedWord[] = [];
  private timer: NodeJS.Timeout | null = null;

  constructor(initialState: WordSearchState, config: GameConfig) {
    super(initialState, config);
  }

  async initialize(): Promise<void> {
    console.log('Initializing Word Search Engine');
    
    // Generate word list based on difficulty
    const words = this.generateWordList();
    
    // Create empty grid
    const grid = this.createEmptyGrid();
    
    // Place words in grid
    this.placeWordsInGrid(grid, words);
    
    // Fill empty cells with random letters
    this.fillEmptyCells(grid);
    
    // Update initial state
    this.updateGameState({
      ...this.gameState,
      grid,
      words,
      foundWords: new Set<string>(),
      selectedCells: [],
      currentSelection: [],
      timeElapsed: 0,
      hintsUsed: 0
    });

    console.log('Word Search Engine initialized with', words.length, 'words');
  }

  start(): void {
    console.log('Starting word search game');
    this.updateGameState({
      ...this.gameState,
      status: 'playing',
      startTime: Date.now()
    });

    // Start timer
    this.startTimer();
    
    this.emitEvent({
      type: 'GAME_STARTED',
      timestamp: Date.now()
    });
  }

  pause(): void {
    console.log('Pausing word search game');
    this.updateGameState({
      ...this.gameState,
      status: 'paused'
    });
    this.stopTimer();
  }

  resume(): void {
    console.log('Resuming word search game');
    this.updateGameState({
      ...this.gameState,
      status: 'playing'
    });
    this.startTimer();
  }

  reset(): void {
    console.log('Resetting word search game');
    this.stopTimer();
    this.initialize();
  }

  calculateScore(): number {
    const baseScore = this.gameState.score;
    const timeBonus = Math.max(0, 300 - this.gameState.timeElapsed) * 2;
    const hintPenalty = this.gameState.hintsUsed * 50;
    
    return Math.max(0, baseScore + timeBonus - hintPenalty);
  }

  validateMove(move: WordSearchMove): MoveValidationResult {
    switch (move.type) {
      case 'SELECT_CELLS':
        return { isValid: true };
      
      case 'VALIDATE_SELECTION':
        return this.validateSelection();
      
      case 'HINT':
        return { isValid: this.gameState.hintsUsed < 3 }; // Max 3 hints
      
      default:
        return { isValid: false, error: 'Invalid move type' };
    }
  }

  makeMove(move: WordSearchMove): void {
    const validation = this.validateMove(move);
    if (!validation.isValid) {
      console.warn('Invalid move:', validation.error);
      return;
    }

    switch (move.type) {
      case 'SELECT_CELLS':
        this.updateGameState({
          ...this.gameState,
          currentSelection: move.cells,
          moves: this.gameState.moves + 1
        });
        break;
      
      case 'VALIDATE_SELECTION':
        this.processSelection();
        break;
      
      case 'HINT':
        this.provideHint();
        break;
    }
  }

  checkWinCondition(): WinConditionResult {
    const foundAllWords = this.gameState.foundWords.size === this.gameState.words.length;
    const completionPercentage = (this.gameState.foundWords.size / this.gameState.words.length) * 100;
    
    if (foundAllWords) {
      const finalScore = this.calculateScore();
      return {
        isWin: true,
        completionPercentage: 100,
        finalScore,
        bonusPoints: this.calculateBonusPoints()
      };
    }

    return {
      isWin: false,
      completionPercentage,
      finalScore: this.gameState.score
    };
  }

  // Private methods
  private startTimer(): void {
    this.timer = setInterval(() => {
      this.updateGameState({
        ...this.gameState,
        timeElapsed: this.gameState.timeElapsed + 1
      });
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private generateWordList(): string[] {
    const difficultyWords = {
      rookie: ['CAT', 'DOG', 'SUN', 'TREE', 'BOOK', 'FISH', 'BIRD', 'MOON'],
      pro: ['PUZZLE', 'SEARCH', 'HIDDEN', 'LETTER', 'WORD', 'GRID', 'FIND', 'GAME'],
      master: ['ALGORITHM', 'CHALLENGE', 'DIAGONAL', 'VERTICAL', 'HORIZONTAL', 'PATTERN']
    };

    return difficultyWords[this.gameState.difficulty] || difficultyWords.rookie;
  }

  private createEmptyGrid(): string[][] {
    const size = 10;
    return Array(size).fill(null).map(() => Array(size).fill(''));
  }

  private placeWordsInGrid(grid: string[][], words: string[]): void {
    this.placedWords = [];
    
    for (const word of words) {
      const placement = this.findWordPlacement(grid, word);
      if (placement) {
        this.placedWords.push(placement);
        this.placeWordInGrid(grid, placement);
      }
    }
  }

  private findWordPlacement(grid: string[][], word: string): PlacedWord | null {
    const directions = ['horizontal', 'vertical', 'diagonal'] as const;
    const size = grid.length;
    
    for (let attempts = 0; attempts < 100; attempts++) {
      const direction = directions[Math.floor(Math.random() * directions.length)];
      const startRow = Math.floor(Math.random() * size);
      const startCol = Math.floor(Math.random() * size);
      
      if (this.canPlaceWord(grid, word, startRow, startCol, direction)) {
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

  private canPlaceWord(grid: string[][], word: string, startRow: number, startCol: number, direction: string): boolean {
    const size = grid.length;
    const { rowDir, colDir } = this.getDirection(direction);
    
    for (let i = 0; i < word.length; i++) {
      const row = startRow + i * rowDir;
      const col = startCol + i * colDir;
      
      if (row < 0 || row >= size || col < 0 || col >= size) {
        return false;
      }
      
      if (grid[row][col] !== '' && grid[row][col] !== word[i]) {
        return false;
      }
    }
    
    return true;
  }

  private placeWordInGrid(grid: string[][], placement: PlacedWord): void {
    const { word, startRow, startCol, direction } = placement;
    const { rowDir, colDir } = this.getDirection(direction);
    
    for (let i = 0; i < word.length; i++) {
      const row = startRow + i * rowDir;
      const col = startCol + i * colDir;
      grid[row][col] = word[i];
    }
  }

  private getDirection(direction: string): { rowDir: number; colDir: number } {
    switch (direction) {
      case 'horizontal': return { rowDir: 0, colDir: 1 };
      case 'vertical': return { rowDir: 1, colDir: 0 };
      case 'diagonal': return { rowDir: 1, colDir: 1 };
      default: return { rowDir: 0, colDir: 1 };
    }
  }

  private getWordCells(startRow: number, startCol: number, length: number, direction: string): Array<{ row: number; col: number }> {
    const { rowDir, colDir } = this.getDirection(direction);
    const cells = [];
    
    for (let i = 0; i < length; i++) {
      cells.push({
        row: startRow + i * rowDir,
        col: startCol + i * colDir
      });
    }
    
    return cells;
  }

  private fillEmptyCells(grid: string[][]): void {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (grid[row][col] === '') {
          grid[row][col] = letters[Math.floor(Math.random() * letters.length)];
        }
      }
    }
  }

  private validateSelection(): MoveValidationResult {
    const selectedWord = this.getSelectedWord();
    
    if (selectedWord && this.gameState.words.includes(selectedWord) && !this.gameState.foundWords.has(selectedWord)) {
      return {
        isValid: true,
        newState: {
          ...this.gameState,
          foundWords: new Set([...this.gameState.foundWords, selectedWord]),
          selectedCells: [...this.gameState.selectedCells, ...this.gameState.currentSelection],
          score: this.gameState.score + selectedWord.length * 10
        },
        scoreChange: selectedWord.length * 10
      };
    }
    
    return { isValid: false, error: 'Invalid word selection' };
  }

  private processSelection(): boolean {
    const validation = this.validateSelection();
    
    if (validation.isValid && validation.newState) {
      this.updateGameState(validation.newState);
      
      // Check win condition
      const winCheck = this.checkWinCondition();
      if (winCheck.isWin) {
        this.handleGameComplete();
      }
      
      return true;
    }
    
    // Clear selection on invalid word
    this.updateGameState({
      ...this.gameState,
      currentSelection: []
    });
    
    return false;
  }

  private getSelectedWord(): string {
    if (this.gameState.currentSelection.length === 0) return '';
    
    return this.gameState.currentSelection
      .map(cell => this.gameState.grid[cell.row][cell.col])
      .join('');
  }

  private provideHint(): boolean {
    const unFoundWords = this.gameState.words.filter(word => !this.gameState.foundWords.has(word));
    
    if (unFoundWords.length === 0) return false;
    
    const randomWord = unFoundWords[Math.floor(Math.random() * unFoundWords.length)];
    const wordPlacement = this.placedWords.find(p => p.word === randomWord);
    
    if (wordPlacement) {
      // Highlight the first letter of the word
      const firstCell = wordPlacement.cells[0];
      this.updateGameState({
        ...this.gameState,
        currentSelection: [firstCell],
        hintsUsed: this.gameState.hintsUsed + 1
      });
      
      return true;
    }
    
    return false;
  }

  private calculateBonusPoints(): number {
    const timeBonus = Math.max(0, 300 - this.gameState.timeElapsed) * 2;
    const noHintBonus = this.gameState.hintsUsed === 0 ? 100 : 0;
    
    return timeBonus + noHintBonus;
  }

  private handleGameComplete(): void {
    this.stopTimer();
    
    this.updateGameState({
      ...this.gameState,
      status: 'completed',
      endTime: Date.now(),
      isComplete: true,
      score: this.calculateScore()
    });
    
    this.emitEvent({
      type: 'GAME_COMPLETED',
      finalScore: this.gameState.score,
      timestamp: Date.now()
    });
  }
}
