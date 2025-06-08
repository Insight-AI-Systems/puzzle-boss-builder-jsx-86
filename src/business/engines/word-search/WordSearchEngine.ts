
import { GameEngine } from '../GameEngine';
import { BaseGameState, GameConfig, MoveValidationResult, WinConditionResult, GameEvent } from '../../models/GameState';
import { PlacedWord, Cell } from './types';
import { cellsToStrings, stringsToCells } from './utils';
import { WordPlacementEngine } from '../../../components/games/word-search/WordPlacementEngine';

// Word search specific state
export interface WordSearchState extends BaseGameState {
  grid: string[][];
  words: string[];
  foundWords: Set<string>;
  selectedCells: string[]; // Keep as string[] for internal consistency
  currentSelection: string[]; // Keep as string[] for internal consistency
  difficulty: 'rookie' | 'pro' | 'master';
  timeElapsed: number;
  hintsUsed: number;
}

// Move types for word search
export type WordSearchMove = 
  | { type: 'SELECT_CELLS'; cells: Cell[] }
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
    console.log('Generated words:', words);
    
    // Create empty grid
    const gridSize = this.getGridSize();
    const emptyGrid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
    
    // CRITICAL FIX: Use WordPlacementEngine to place words in grid
    console.log('Placing words in grid using WordPlacementEngine...');
    this.placedWords = WordPlacementEngine.placeWords(words, emptyGrid);
    
    // Verify word placement
    console.log('Words successfully placed:', this.placedWords.length);
    console.log('Placed words details:', this.placedWords.map(pw => ({ 
      word: pw.word, 
      direction: pw.direction, 
      start: `${pw.startRow}-${pw.startCol}` 
    })));
    
    // Ensure minimum words are placed
    if (this.placedWords.length === 0) {
      console.error('CRITICAL: No words were placed in the grid!');
      // Try with a simpler word list as fallback
      const simpleWords = ['CAT', 'DOG', 'SUN'];
      this.placedWords = WordPlacementEngine.placeWords(simpleWords, emptyGrid);
      if (this.placedWords.length === 0) {
        throw new Error('Failed to place any words in the grid');
      }
    }
    
    // Fill remaining empty cells with random letters
    this.fillEmptyCells(emptyGrid);
    
    // Verify grid is populated
    console.log('Grid populated. Sample row:', emptyGrid[0]);
    console.log('Grid contains letters:', emptyGrid.flat().some(cell => cell !== ''));
    
    // Update initial state with populated grid and placed words
    this.updateGameState({
      ...this.gameState,
      grid: emptyGrid, // Now contains actual letters
      words: this.placedWords.map(pw => pw.word), // Use successfully placed words
      foundWords: new Set<string>(),
      selectedCells: [],
      currentSelection: [],
      timeElapsed: 0,
      hintsUsed: 0
    });

    console.log('Word Search Engine initialized with', this.placedWords.length, 'words');
    console.log('Final game state words:', this.gameState.words);
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
        // Convert Cell[] to string[] for internal state
        const cellStrings = cellsToStrings(move.cells);
        this.updateGameState({
          ...this.gameState,
          currentSelection: cellStrings,
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

  private getGridSize(): number {
    const sizeMap = {
      rookie: 10,
      pro: 12,
      master: 15
    };
    
    return sizeMap[this.gameState.difficulty] || 10;
  }

  private fillEmptyCells(grid: string[][]): void {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let cellsFilled = 0;
    
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (grid[row][col] === '') {
          grid[row][col] = letters[Math.floor(Math.random() * letters.length)];
          cellsFilled++;
        }
      }
    }
    
    console.log('Filled', cellsFilled, 'empty cells with random letters');
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
    
    // Convert string cell IDs to coordinates and get letters
    const cellCoordinates = stringsToCells(this.gameState.currentSelection);
    return cellCoordinates
      .map(cell => this.gameState.grid[cell.row][cell.col])
      .join('');
  }

  private provideHint(): boolean {
    const unFoundWords = this.gameState.words.filter(word => !this.gameState.foundWords.has(word));
    
    if (unFoundWords.length === 0) return false;
    
    const randomWord = unFoundWords[Math.floor(Math.random() * unFoundWords.length)];
    const wordPlacement = this.placedWords.find(p => p.word === randomWord);
    
    if (wordPlacement && wordPlacement.cells.length > 0) {
      // Highlight the first letter of the word
      const firstCell = wordPlacement.cells[0];
      const cellId = `${firstCell.row}-${firstCell.col}`;
      this.updateGameState({
        ...this.gameState,
        currentSelection: [cellId],
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

  public getPlacedWords(): PlacedWord[] {
    console.log('Getting placed words for validator:', this.placedWords.length);
    return this.placedWords;
  }
}
