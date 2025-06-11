
import { GameEngine } from '../GameEngine';
import { PlacedWord, Cell } from './types';
import { cellToString, stringToCell, cellsToStrings, stringsToCells } from './utils';

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
  cells?: string[];
  word?: string;
}

export class WordSearchEngine extends GameEngine<WordSearchState, WordSearchMove> {
  private placedWords: PlacedWord[] = [];
  private gameTimer: number | null = null;

  constructor(initialState: WordSearchState, config: any) {
    super(initialState, config);
  }

  protected validateMove(move: WordSearchMove): { isValid: boolean; reason?: string } {
    switch (move.type) {
      case 'SELECT_CELLS':
        return { isValid: true }; // Cell selection is always valid
      case 'WORD_FOUND':
        return { isValid: !!move.word && !!move.cells };
      case 'HINT':
        return { isValid: this.getState().hintsUsed < 3 }; // Limit hints
      default:
        return { isValid: false, reason: 'Invalid move type' };
    }
  }

  protected calculateScore(): number {
    const state = this.getState();
    const baseScore = state.foundWords.size * 100;
    const timeBonus = Math.max(0, 300 - state.timeElapsed);
    const hintPenalty = state.hintsUsed * 50;
    return Math.max(0, baseScore + timeBonus - hintPenalty);
  }

  protected checkWinCondition() {
    const state = this.getState();
    const isWin = state.foundWords.size === state.words.length;
    return {
      isWin,
      score: this.calculateScore(),
      message: isWin ? 'Congratulations! You found all words!' : ''
    };
  }

  async initialize(): Promise<void> {
    console.log('Initializing Word Search Engine...');
    
    // Generate words and grid
    const words = this.generateWords();
    const { grid, placedWords } = this.generateGrid(words);
    
    this.placedWords = placedWords;
    
    this.setState({
      ...this.getState(),
      grid,
      words,
      foundWords: new Set(),
      selectedCells: [],
      currentSelection: [],
      hintCells: [],
      score: 0,
      moves: 0,
      timeElapsed: 0,
      hintsUsed: 0,
      status: 'idle'
    });

    console.log('Word Search Engine initialized successfully');
  }

  start(): void {
    console.log('Starting Word Search game...');
    this.setState({
      ...this.getState(),
      status: 'playing',
      startTime: Date.now()
    });
    
    this.startTimer();
    this.emitEvent('gameStarted');
  }

  pause(): void {
    this.setState({
      ...this.getState(),
      status: 'paused'
    });
    this.stopTimer();
    this.emitEvent('gamePaused');
  }

  resume(): void {
    this.setState({
      ...this.getState(),
      status: 'playing'
    });
    this.startTimer();
    this.emitEvent('gameResumed');
  }

  reset(): void {
    this.stopTimer();
    this.setState({
      ...this.getState(),
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
    this.emitEvent('gameReset');
  }

  makeMove(move: WordSearchMove): boolean {
    const validation = this.validateMove(move);
    if (!validation.isValid) {
      return false;
    }

    let newState = { ...this.getState() };

    switch (move.type) {
      case 'SELECT_CELLS':
        newState.currentSelection = move.cells || [];
        break;

      case 'WORD_FOUND':
        if (move.word && move.cells) {
          newState.foundWords = new Set([...newState.foundWords, move.word]);
          newState.selectedCells = [...newState.selectedCells, ...move.cells];
          newState.currentSelection = [];
          newState.moves += 1;
          newState.score = this.calculateScore();
        }
        break;

      case 'HINT':
        const hintCells = this.generateHint();
        newState.hintCells = hintCells;
        newState.hintsUsed += 1;
        break;
    }

    this.setState(newState);

    // Check win condition
    const winResult = this.checkWinCondition();
    if (winResult.isWin && !this.getState().isComplete) {
      this.handleGameComplete();
    }

    this.emitEvent('moveMade');
    return true;
  }

  private handleGameComplete(): void {
    this.stopTimer();
    this.setState({
      ...this.getState(),
      status: 'completed',
      isComplete: true,
      endTime: Date.now()
    });
    this.emitEvent('gameCompleted');
  }

  validateWordSelection(cellIds: string[]): { isValid: boolean; word?: string } {
    if (cellIds.length < 2) {
      return { isValid: false };
    }

    const cells = stringsToCells(cellIds);
    
    // Check if selection forms a valid line
    if (!this.isValidLine(cells)) {
      return { isValid: false };
    }

    // Get the word from the selection
    const word = this.getWordFromCells(cells);
    
    // Check if this word exists in our placed words and hasn't been found yet
    const isValidWord = this.placedWords.some(placedWord => 
      placedWord.word.toLowerCase() === word.toLowerCase() &&
      !this.getState().foundWords.has(placedWord.word)
    );

    return {
      isValid: isValidWord,
      word: isValidWord ? this.placedWords.find(pw => pw.word.toLowerCase() === word.toLowerCase())?.word : undefined
    };
  }

  clearHints(): void {
    this.setState({
      ...this.getState(),
      hintCells: []
    });
  }

  getGameStateForSave() {
    return {
      ...this.getState(),
      foundWords: Array.from(this.getState().foundWords),
      placedWords: this.placedWords
    };
  }

  restoreGameState(savedState: any): void {
    if (savedState.placedWords) {
      this.placedWords = savedState.placedWords;
    }
    
    this.setState({
      ...savedState,
      foundWords: new Set(savedState.foundWords || [])
    });
    
    if (this.getState().status === 'playing') {
      this.startTimer();
    }
  }

  subscribe(callback: (state: WordSearchState) => void) {
    return this.addEventListener('stateChanged', callback);
  }

  // Private helper methods
  private generateWords(): string[] {
    return ['JAVASCRIPT', 'REACT', 'TYPESCRIPT', 'HTML', 'CSS', 'NODE', 'EXPRESS', 'MONGODB'];
  }

  private generateGrid(words: string[]): { grid: string[][]; placedWords: PlacedWord[] } {
    const size = 15;
    const grid: string[][] = Array(size).fill(null).map(() => Array(size).fill(''));
    const placedWords: PlacedWord[] = [];

    // Simple word placement logic
    words.forEach((word, index) => {
      const row = Math.floor(index / 3) * 3 + 2;
      const col = (index % 3) * 4 + 1;
      
      for (let i = 0; i < word.length && col + i < size; i++) {
        grid[row][col + i] = word[i];
      }
      
      placedWords.push({
        word,
        startRow: row,
        startCol: col,
        endRow: row,
        endCol: col + word.length - 1,
        direction: 'horizontal',
        cells: Array.from({ length: word.length }, (_, i) => ({
          row,
          col: col + i
        }))
      });
    });

    // Fill empty cells with random letters
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (!grid[i][j]) {
          grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }

    return { grid, placedWords };
  }

  private isValidLine(cells: Cell[]): boolean {
    if (cells.length < 2) return false;
    
    const first = cells[0];
    const last = cells[cells.length - 1];
    
    // Check if all cells form a straight line
    const deltaRow = last.row - first.row;
    const deltaCol = last.col - first.col;
    
    // Must be horizontal, vertical, or diagonal
    if (deltaRow !== 0 && deltaCol !== 0 && Math.abs(deltaRow) !== Math.abs(deltaCol)) {
      return false;
    }
    
    return true;
  }

  private getWordFromCells(cells: Cell[]): string {
    return cells
      .map(cell => this.getState().grid[cell.row]?.[cell.col] || '')
      .join('');
  }

  private generateHint(): string[] {
    const unFoundWords = this.placedWords.filter(
      word => !this.getState().foundWords.has(word.word)
    );
    
    if (unFoundWords.length === 0) {
      return [];
    }
    
    const randomWord = unFoundWords[Math.floor(Math.random() * unFoundWords.length)];
    const cells = randomWord.cells || [];
    
    // Show first few cells as hint
    const hintCells = cells.slice(0, Math.min(3, cells.length));
    return hintCells.map(cell => cellToString(cell));
  }

  private startTimer(): void {
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
    }
    
    this.gameTimer = window.setInterval(() => {
      if (this.getState().status === 'playing') {
        this.setState({
          ...this.getState(),
          timeElapsed: this.getState().timeElapsed + 1
        });
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
      this.gameTimer = null;
    }
  }
}
