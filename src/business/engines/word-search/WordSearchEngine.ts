
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
    this.updateState({
      ...this.state,
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
    this.updateState({
      ...this.state,
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
    this.updateState({
      ...this.state,
      status: 'paused'
    });
    this.stopTimer();
  }

  resume(): void {
    console.log('Resuming word search game');
    this.updateState({
      ...this.state,
      status: 'playing'
    });
    this.startTimer();
  }

  reset(): void {
    console.log('Resetting word search game');
    this.stopTimer();
    this.initialize();
  }

  validateMove(move: WordSearchMove): MoveValidationResult {
    switch (move.type) {
      case 'SELECT_CELLS':
        return { isValid: true };
      
      case 'VALIDATE_SELECTION':
        return this.validateSelection();
      
      case 'HINT':
        return { isValid: this.state.hintsUsed < 3 }; // Max 3 hints
      
      default:
        return { isValid: false, error: 'Invalid move type' };
    }
  }

  makeMove(move: WordSearchMove): boolean {
    const validation = this.validateMove(move);
    if (!validation.isValid) {
      console.warn('Invalid move:', validation.error);
      return false;
    }

    switch (move.type) {
      case 'SELECT_CELLS':
        this.updateState({
          ...this.state,
          currentSelection: move.cells,
          moves: this.state.moves + 1
        });
        return true;
      
      case 'VALIDATE_SELECTION':
        return this.processSelection();
      
      case 'HINT':
        return this.provideHint();
      
      default:
        return false;
    }
  }

  checkWinCondition(): WinConditionResult {
    const foundAllWords = this.state.foundWords.size === this.state.words.length;
    const completionPercentage = (this.state.foundWords.size / this.state.words.length) * 100;
    
    if (foundAllWords) {
      const finalScore = this.calculateFinalScore();
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
      finalScore: this.state.score
    };
  }

  // Private methods
  private startTimer(): void {
    this.timer = setInterval(() => {
      this.updateState({
        ...this.state,
        timeElapsed: this.state.timeElapsed + 1
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

    return difficultyWords[this.state.difficulty] || difficultyWords.rookie;
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
    
    if (selectedWord && this.state.words.includes(selectedWord) && !this.state.foundWords.has(selectedWord)) {
      return {
        isValid: true,
        newState: {
          ...this.state,
          foundWords: new Set([...this.state.foundWords, selectedWord]),
          selectedCells: [...this.state.selectedCells, ...this.state.currentSelection],
          score: this.state.score + selectedWord.length * 10
        },
        scoreChange: selectedWord.length * 10
      };
    }
    
    return { isValid: false, error: 'Invalid word selection' };
  }

  private processSelection(): boolean {
    const validation = this.validateSelection();
    
    if (validation.isValid && validation.newState) {
      this.updateState(validation.newState);
      
      // Check win condition
      const winCheck = this.checkWinCondition();
      if (winCheck.isWin) {
        this.handleGameComplete();
      }
      
      return true;
    }
    
    // Clear selection on invalid word
    this.updateState({
      ...this.state,
      currentSelection: []
    });
    
    return false;
  }

  private getSelectedWord(): string {
    if (this.state.currentSelection.length === 0) return '';
    
    return this.state.currentSelection
      .map(cell => this.state.grid[cell.row][cell.col])
      .join('');
  }

  private provideHint(): boolean {
    const unFoundWords = this.state.words.filter(word => !this.state.foundWords.has(word));
    
    if (unFoundWords.length === 0) return false;
    
    const randomWord = unFoundWords[Math.floor(Math.random() * unFoundWords.length)];
    const wordPlacement = this.placedWords.find(p => p.word === randomWord);
    
    if (wordPlacement) {
      // Highlight the first letter of the word
      const firstCell = wordPlacement.cells[0];
      this.updateState({
        ...this.state,
        currentSelection: [firstCell],
        hintsUsed: this.state.hintsUsed + 1
      });
      
      return true;
    }
    
    return false;
  }

  private calculateFinalScore(): number {
    const baseScore = this.state.score;
    const timeBonus = Math.max(0, 300 - this.state.timeElapsed) * 2; // Time bonus
    const hintPenalty = this.state.hintsUsed * 50; // Penalty for using hints
    
    return Math.max(0, baseScore + timeBonus - hintPenalty);
  }

  private calculateBonusPoints(): number {
    const timeBonus = Math.max(0, 300 - this.state.timeElapsed) * 2;
    const noHintBonus = this.state.hintsUsed === 0 ? 100 : 0;
    
    return timeBonus + noHintBonus;
  }

  private handleGameComplete(): void {
    this.stopTimer();
    
    this.updateState({
      ...this.state,
      status: 'completed',
      endTime: Date.now(),
      isComplete: true,
      score: this.calculateFinalScore()
    });
    
    this.emitEvent({
      type: 'GAME_COMPLETED',
      finalScore: this.state.score,
      timestamp: Date.now()
    });
  }
}
