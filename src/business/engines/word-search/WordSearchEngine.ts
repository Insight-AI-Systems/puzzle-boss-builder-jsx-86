import { GameEngine } from '../GameEngine';
import type { BaseGameState, GameConfig, MoveValidationResult, WinConditionResult } from '../../models/GameState';
import type { PlacedWord, Cell } from './types';
import { cellToString, stringToCell, cellsToStrings, stringsToCells } from './utils';

export interface WordSearchState extends BaseGameState {
  grid: string[][];
  words: string[];
  foundWords: Set<string>;
  selectedCells: string[];
  currentSelection: string[];
  hintCells: string[];
  difficulty: 'rookie' | 'expert' | 'master';
  timeElapsed: number;
  hintsUsed: number;
}

export interface WordSearchMove {
  type: 'SELECT_CELLS' | 'WORD_FOUND' | 'HINT';
  cells?: Cell[] | string[];
  word?: string;
}

export class WordSearchEngine extends GameEngine<WordSearchState, WordSearchMove> {
  private listeners: ((state: WordSearchState) => void)[] = [];
  private placedWords: PlacedWord[] = [];

  constructor(initialState: WordSearchState, config: GameConfig) {
    super(initialState, config);
  }

  // Add subscribe method for component compatibility
  subscribe(listener: (state: WordSearchState) => void): void {
    this.listeners.push(listener);
  }

  // Add getGameState method for component compatibility
  getGameState(): WordSearchState {
    return this.getState();
  }

  // Add getGameStateForSave method for persistence
  getGameStateForSave(): any {
    return {
      ...this.gameState,
      foundWords: Array.from(this.gameState.foundWords)
    };
  }

  // Add restoreGameState method for loading saved state
  restoreGameState(savedState: any): void {
    this.gameState = {
      ...savedState,
      foundWords: new Set(savedState.foundWords || [])
    };
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.gameState));
  }

  async initialize(): Promise<void> {
    // Generate grid and place words
    const gridSize = 15;
    const words = ['PUZZLE', 'SEARCH', 'GAME', 'WORD', 'FIND', 'HIDDEN', 'GRID', 'LETTERS'];
    
    // Create empty grid
    const grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
    
    // Simple word placement (horizontal only for now)
    const placedWords: PlacedWord[] = [];
    let wordIndex = 0;
    
    for (let i = 0; i < Math.min(words.length, 8); i++) {
      const word = words[i];
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * (gridSize - word.length));
      
      // Place word horizontally
      for (let j = 0; j < word.length; j++) {
        grid[row][col + j] = word[j];
      }
      
      placedWords.push({
        word,
        start: { row, col },
        end: { row, col: col + word.length - 1 },
        direction: 'horizontal'
      });
    }
    
    // Fill empty cells with random letters
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (grid[row][col] === '') {
          grid[row][col] = letters[Math.floor(Math.random() * letters.length)];
        }
      }
    }
    
    this.placedWords = placedWords;
    this.gameState = {
      ...this.gameState,
      grid,
      words,
      status: 'idle'
    };
    
    this.notifyListeners();
  }

  start(): void {
    this.gameState = {
      ...this.gameState,
      status: 'playing',
      startTime: Date.now()
    };
    this.emitEvent({
      type: 'GAME_STARTED',
      timestamp: Date.now(),
      data: {}
    });
    this.notifyListeners();
  }

  validateMove(move: WordSearchMove): MoveValidationResult {
    if (move.type === 'WORD_FOUND' && move.word && move.cells) {
      const result = this.validateWordSelection(move.cells);
      return {
        isValid: result.isValid,
        error: result.isValid ? null : 'Invalid word selection'
      };
    }
    return { isValid: true, error: null };
  }

  makeMove(move: WordSearchMove): void {
    if (this.gameState.status !== 'playing' && move.type !== 'SELECT_CELLS') return;

    switch (move.type) {
      case 'SELECT_CELLS':
        if (move.cells) {
          const cellStrings = Array.isArray(move.cells[0]) && typeof move.cells[0] === 'object'
            ? cellsToStrings(move.cells as Cell[])
            : move.cells as string[];
          
          this.gameState = {
            ...this.gameState,
            currentSelection: cellStrings
          };
        }
        break;

      case 'WORD_FOUND':
        if (move.word && move.cells) {
          const cellStrings = Array.isArray(move.cells[0]) && typeof move.cells[0] === 'object'
            ? cellsToStrings(move.cells as Cell[])
            : move.cells as string[];

          const validation = this.validateWordSelection(cellStrings);
          if (validation.isValid && validation.word) {
            this.gameState = {
              ...this.gameState,
              foundWords: new Set([...this.gameState.foundWords, validation.word]),
              selectedCells: [...this.gameState.selectedCells, ...cellStrings],
              moves: this.gameState.moves + 1,
              score: this.gameState.score + validation.word.length * 10,
              currentSelection: []
            };

            this.emitEvent({
              type: 'MOVE_MADE',
              timestamp: Date.now(),
              data: { word: validation.word }
            });

            // Check for completion
            if (this.gameState.foundWords.size === this.gameState.words.length) {
              this.gameState = {
                ...this.gameState,
                status: 'completed',
                isComplete: true,
                endTime: Date.now()
              };
              this.emitEvent({
                type: 'GAME_COMPLETED',
                timestamp: Date.now(),
                data: {}
              });
            }
          }
        }
        break;

      case 'HINT':
        this.gameState = {
          ...this.gameState,
          hintsUsed: this.gameState.hintsUsed + 1
        };
        
        // Find a word that hasn't been found yet
        const unfoundWords = this.gameState.words.filter(word => !this.gameState.foundWords.has(word));
        if (unfoundWords.length > 0) {
          const hintWord = unfoundWords[0];
          const placedWord = this.placedWords.find(pw => pw.word === hintWord);
          
          if (placedWord) {
            const hintCells: string[] = [];
            for (let i = 0; i < placedWord.word.length; i++) {
              if (placedWord.direction === 'horizontal') {
                hintCells.push(cellToString({ row: placedWord.start.row, col: placedWord.start.col + i }));
              }
            }
            
            this.gameState = {
              ...this.gameState,
              hintCells
            };
          }
        }
        
        this.emitEvent({
          type: 'HINT_USED',
          timestamp: Date.now(),
          data: {}
        });
        break;
    }

    this.notifyListeners();
  }

  validateWordSelection(cells: string[]): { isValid: boolean; word?: string } {
    if (cells.length < 2) return { isValid: false };

    // Convert to Cell objects
    const cellCoords = stringsToCells(cells);
    
    // Check if selection forms a straight line
    if (!this.isLinearSelection(cellCoords)) return { isValid: false };

    // Get the word from the grid
    const word = cellCoords.map(cell => this.gameState.grid[cell.row]?.[cell.col] || '').join('');
    
    // Check if it's one of our target words
    if (this.gameState.words.includes(word) && !this.gameState.foundWords.has(word)) {
      return { isValid: true, word };
    }

    return { isValid: false };
  }

  private isLinearSelection(cells: Cell[]): boolean {
    if (cells.length < 2) return true;

    const first = cells[0];
    const second = cells[1];
    
    // Check if horizontal, vertical, or diagonal
    const deltaRow = second.row - first.row;
    const deltaCol = second.col - first.col;
    
    for (let i = 2; i < cells.length; i++) {
      const expectedRow = first.row + (deltaRow * i);
      const expectedCol = first.col + (deltaCol * i);
      
      if (cells[i].row !== expectedRow || cells[i].col !== expectedCol) {
        return false;
      }
    }
    
    return true;
  }

  calculateScore(): number {
    return this.gameState.score;
  }

  checkWinCondition(): WinConditionResult {
    const isWon = this.gameState.foundWords.size === this.gameState.words.length;
    return {
      isWon,
      message: isWon ? 'Congratulations! You found all words!' : ''
    };
  }

  pause(): void {
    this.gameState = {
      ...this.gameState,
      status: 'paused'
    };
    this.emitEvent({
      type: 'GAME_PAUSED',
      timestamp: Date.now(),
      data: {}
    });
    this.notifyListeners();
  }

  resume(): void {
    this.gameState = {
      ...this.gameState,
      status: 'playing'
    };
    this.emitEvent({
      type: 'GAME_RESUMED',
      timestamp: Date.now(),
      data: {}
    });
    this.notifyListeners();
  }

  reset(): void {
    this.gameState = {
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
    };
    this.notifyListeners();
  }
}
