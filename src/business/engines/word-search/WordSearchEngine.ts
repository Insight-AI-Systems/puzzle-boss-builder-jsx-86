
import { GameEngine } from '../GameEngine';
import { PlacedWord, Cell } from './types';
import { cellsToStrings, stringsToCells } from './utils';
import { MoveValidationResult, WinConditionResult } from '../../models/GameState';

export interface WordSearchState {
  id: string;
  status: 'idle' | 'playing' | 'paused' | 'completed';
  score: number;
  moves: number;
  startTime: number | null;
  endTime: number | null;
  isComplete: boolean;
  error: string | null;
  grid: string[][];
  words: string[];
  foundWords: Set<string>;
  selectedCells: string[];
  currentSelection: string[];
  hintCells: string[];
  difficulty: 'rookie' | 'master' | 'expert';
  timeElapsed: number;
  hintsUsed: number;
}

export interface WordSearchMove {
  type: 'SELECT_CELLS' | 'WORD_FOUND' | 'HINT';
  cells?: string[] | Cell[];
  word?: string;
}

export class WordSearchEngine extends GameEngine<WordSearchState, WordSearchMove> {
  private placedWords: PlacedWord[] = [];
  private timerInterval: NodeJS.Timeout | null = null;
  private listeners: ((state: WordSearchState) => void)[] = [];

  constructor(initialState: WordSearchState, config: any) {
    super(initialState, config);
  }

  // Implement abstract methods from GameEngine
  validateMove(move: WordSearchMove): MoveValidationResult {
    if (this.gameState.status !== 'playing') {
      return { isValid: false, error: 'Game is not in playing state' };
    }

    switch (move.type) {
      case 'SELECT_CELLS':
        return { isValid: true };
      case 'WORD_FOUND':
        if (!move.word || !move.cells) {
          return { isValid: false, error: 'Word and cells are required' };
        }
        return { isValid: true };
      case 'HINT':
        return { isValid: true };
      default:
        return { isValid: false, error: 'Invalid move type' };
    }
  }

  calculateScore(): number {
    return this.gameState.score;
  }

  checkWinCondition(): WinConditionResult {
    const isWin = this.gameState.foundWords.size === this.gameState.words.length;
    return {
      isGameComplete: isWin,
      winner: isWin ? 'player' : null,
      reason: isWin ? 'all_words_found' : null
    };
  }

  // Subscription system for React component
  subscribe(listener: (state: WordSearchState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.gameState));
  }

  private startTimer(): void {
    this.stopTimer(); // Clear any existing timer
    
    this.timerInterval = setInterval(() => {
      if (this.gameState.status === 'playing' && this.gameState.startTime) {
        const timeElapsed = Math.floor((Date.now() - this.gameState.startTime) / 1000);
        this.updateGameState({
          ...this.gameState,
          timeElapsed
        });
        this.notifyListeners();
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  async initialize(): Promise<void> {
    console.log('WordSearchEngine: Initializing...');
    
    const words = ['JAVASCRIPT', 'REACT', 'TYPESCRIPT', 'HTML', 'CSS', 'NODE', 'EXPRESS', 'DATABASE'];
    const { grid, placedWords } = this.generateGrid(words, 15);
    
    this.placedWords = placedWords;
    this.updateGameState({
      ...this.gameState,
      grid,
      words,
      foundWords: new Set(),
      selectedCells: [],
      currentSelection: [],
      hintCells: [],
      isComplete: false,
      status: 'idle'
    });
    
    console.log('WordSearchEngine: Initialized with', words.length, 'words and', placedWords.length, 'placed words');
    this.notifyListeners();
  }

  start(): void {
    this.updateGameState({
      ...this.gameState,
      status: 'playing',
      startTime: Date.now(),
      timeElapsed: 0
    });
    this.startTimer();
    this.notifyListeners();
  }

  pause(): void {
    this.updateGameState({
      ...this.gameState,
      status: 'paused'
    });
    this.stopTimer();
    this.notifyListeners();
  }

  resume(): void {
    this.updateGameState({
      ...this.gameState,
      status: 'playing'
    });
    this.startTimer();
    this.notifyListeners();
  }

  reset(): void {
    this.stopTimer();
    this.updateGameState({
      ...this.gameState,
      status: 'idle',
      score: 0,
      moves: 0,
      startTime: null,
      endTime: null,
      isComplete: false,
      foundWords: new Set(),
      selectedCells: [],
      currentSelection: [],
      hintCells: [],
      timeElapsed: 0,
      hintsUsed: 0
    });
    this.notifyListeners();
  }

  makeMove(move: WordSearchMove): void {
    const validation = this.validateMove(move);
    if (!validation.isValid) {
      console.warn('Invalid move:', validation.error);
      return;
    }
    
    switch (move.type) {
      case 'SELECT_CELLS':
        if (move.cells) {
          const cellStrings = Array.isArray(move.cells) && move.cells.length > 0 && typeof move.cells[0] === 'object'
            ? cellsToStrings(move.cells as Cell[])
            : move.cells as string[];
          
          this.updateGameState({
            ...this.gameState,
            currentSelection: cellStrings,
            hintCells: [] // Clear hints when selecting
          });
          this.notifyListeners();
        }
        break;

      case 'WORD_FOUND':
        if (move.word && move.cells) {
          const cellStrings = Array.isArray(move.cells) && move.cells.length > 0 && typeof move.cells[0] === 'object'
            ? cellsToStrings(move.cells as Cell[])
            : move.cells as string[];

          const validation = this.validateWordSelection(cellStrings);
          if (validation.isValid && validation.word) {
            this.updateGameState({
              ...this.gameState,
              foundWords: new Set([...this.gameState.foundWords, validation.word]),
              selectedCells: [...this.gameState.selectedCells, ...cellStrings],
              currentSelection: [],
              score: this.gameState.score + validation.word.length * 10,
              moves: this.gameState.moves + 1
            });

            // Check for completion
            const winCondition = this.checkWinCondition();
            if (winCondition.isGameComplete) {
              this.updateGameState({
                ...this.gameState,
                status: 'completed',
                isComplete: true,
                endTime: Date.now()
              });
              this.stopTimer();
            }
            this.notifyListeners();
          }
        }
        break;

      case 'HINT':
        const unfoundWords = this.gameState.words.filter(word => !this.gameState.foundWords.has(word));
        
        if (unfoundWords.length > 0 && this.placedWords.length > 0) {
          const randomWord = unfoundWords[Math.floor(Math.random() * unfoundWords.length)];
          const placedWord = this.placedWords.find(pw => pw.word === randomWord);
          
          if (placedWord && placedWord.cells) {
            const hintCells = cellsToStrings(placedWord.cells.slice(0, Math.ceil(placedWord.cells.length / 2)));
            
            this.updateGameState({
              ...this.gameState,
              hintCells,
              hintsUsed: this.gameState.hintsUsed + 1
            });
            
            console.log('Hint generated for word:', randomWord, 'cells:', hintCells);
          }
        }
        this.notifyListeners();
        break;
    }
  }

  clearHints(): void {
    this.updateGameState({
      ...this.gameState,
      hintCells: []
    });
    this.notifyListeners();
  }

  validateWordSelection(cells: string[]): { isValid: boolean; word?: string } {
    if (!this.placedWords || this.placedWords.length === 0) {
      console.warn('No placed words available for validation');
      return { isValid: false };
    }

    for (const placedWord of this.placedWords) {
      if (placedWord.cells) {
        const placedCells = cellsToStrings(placedWord.cells);
        
        if (this.arraysEqual(cells.sort(), placedCells.sort()) || 
            this.arraysEqual(cells.sort(), placedCells.reverse().sort())) {
          return { isValid: true, word: placedWord.word };
        }
      }
    }
    
    return { isValid: false };
  }

  private arraysEqual(a: string[], b: string[]): boolean {
    return a.length === b.length && a.every((val, i) => val === b[i]);
  }

  private generateGrid(words: string[], size: number): { grid: string[][]; placedWords: PlacedWord[] } {
    const grid: string[][] = Array(size).fill(null).map(() => Array(size).fill(''));
    const placedWords: PlacedWord[] = [];
    
    // Simple word placement algorithm
    for (const word of words) {
      let placed = false;
      let attempts = 0;
      
      while (!placed && attempts < 100) {
        const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
        const row = Math.floor(Math.random() * size);
        const col = Math.floor(Math.random() * size);
        
        if (this.canPlaceWord(grid, word, row, col, direction, size)) {
          const cells = this.placeWord(grid, word, row, col, direction);
          const startRow = row;
          const startCol = col;
          const endRow = direction === 'vertical' ? row + word.length - 1 : row;
          const endCol = direction === 'horizontal' ? col + word.length - 1 : col;
          
          placedWords.push({ 
            word, 
            cells, 
            direction: direction as 'horizontal' | 'vertical',
            startRow,
            startCol,
            endRow,
            endCol
          });
          placed = true;
        }
        attempts++;
      }
    }
    
    // Fill empty cells with random letters
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (grid[i][j] === '') {
          grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }
    
    return { grid, placedWords };
  }

  private canPlaceWord(grid: string[][], word: string, row: number, col: number, direction: string, size: number): boolean {
    if (direction === 'horizontal') {
      if (col + word.length > size) return false;
      for (let i = 0; i < word.length; i++) {
        if (grid[row][col + i] !== '' && grid[row][col + i] !== word[i]) {
          return false;
        }
      }
    } else {
      if (row + word.length > size) return false;
      for (let i = 0; i < word.length; i++) {
        if (grid[row + i][col] !== '' && grid[row + i][col] !== word[i]) {
          return false;
        }
      }
    }
    return true;
  }

  private placeWord(grid: string[][], word: string, row: number, col: number, direction: string): Cell[] {
    const cells: Cell[] = [];
    
    for (let i = 0; i < word.length; i++) {
      if (direction === 'horizontal') {
        grid[row][col + i] = word[i];
        cells.push({ row, col: col + i });
      } else {
        grid[row + i][col] = word[i];
        cells.push({ row: row + i, col });
      }
    }
    
    return cells;
  }

  restoreGameState(savedState: any): void {
    const restoredState: WordSearchState = {
      ...this.gameState,
      ...savedState,
      foundWords: new Set(savedState.foundWords || [])
    };
    
    if (savedState.placedWords) {
      this.placedWords = savedState.placedWords;
    }
    
    this.updateGameState(restoredState);
    
    // Restart timer if game was playing
    if (restoredState.status === 'playing') {
      this.startTimer();
    }
    
    this.notifyListeners();
  }

  getGameStateForSave(): any {
    return {
      ...this.gameState,
      foundWords: Array.from(this.gameState.foundWords),
      placedWords: this.placedWords
    };
  }

  // Clean up timer when engine is destroyed
  destroy(): void {
    this.stopTimer();
  }
}
