
import { GameEngine } from '../GameEngine';
import type { BaseGameState, GameConfig, MoveValidationResult, WinConditionResult } from '../../models/GameState';
import type { PlacedWord, Cell } from './types';
import { cellToString, stringToCell, cellsToStrings, stringsToCells } from './utils';
import { WordPlacementEngine } from '@/components/games/word-search/WordPlacementEngine';

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
  // Add placedWords to the state so it persists across saves/loads
  placedWords?: PlacedWord[];
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

  // Add getGameStateForSave method for persistence - fix state access
  getGameStateForSave(): any {
    const currentState = this.getState();
    return {
      ...currentState,
      foundWords: Array.from(currentState.foundWords),
      placedWords: this.placedWords // Include placed words for hint functionality
    };
  }

  // Add restoreGameState method for loading saved state
  restoreGameState(savedState: any): void {
    const restoredState = {
      ...savedState,
      foundWords: new Set(savedState.foundWords || [])
    };
    
    // Restore placed words if available
    if (savedState.placedWords) {
      this.placedWords = savedState.placedWords;
    }
    
    // Use the protected updateGameState method to update state
    this.updateGameState(restoredState);
    this.notifyListeners();
  }

  public notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getState()));
  }

  async initialize(): Promise<void> {
    // Generate grid and place words
    const gridSize = 15;
    const words = ['PUZZLE', 'SEARCH', 'GAME', 'WORD', 'FIND', 'HIDDEN', 'GRID', 'LETTERS'];
    
    // Use the placement engine for better word placement
    const placementEngine = new WordPlacementEngine(gridSize);
    const { grid, placedWords } = placementEngine.placeWords(words);
    
    this.placedWords = placedWords;
    const currentState = this.getState();
    this.updateGameState({
      ...currentState,
      grid,
      words,
      status: 'idle',
      placedWords // Store in state as well
    });
    
    this.notifyListeners();
  }

  start(): void {
    const currentState = this.getState();
    this.updateGameState({
      ...currentState,
      status: 'playing',
      startTime: Date.now()
    });
    this.emitEvent({
      type: 'GAME_STARTED',
      timestamp: Date.now()
    });
    this.notifyListeners();
  }

  validateMove(move: WordSearchMove): MoveValidationResult {
    if (move.type === 'WORD_FOUND' && move.word && move.cells) {
      // Ensure cells are in string format
      const cellStrings = Array.isArray(move.cells[0]) && typeof move.cells[0] === 'object'
        ? cellsToStrings(move.cells as Cell[])
        : move.cells as string[];
      
      const result = this.validateWordSelection(cellStrings);
      return {
        isValid: result.isValid,
        error: result.isValid ? null : 'Invalid word selection'
      };
    }
    return { isValid: true, error: null };
  }

  makeMove(move: WordSearchMove): void {
    const currentState = this.getState();
    if (currentState.status !== 'playing' && move.type !== 'SELECT_CELLS') return;

    switch (move.type) {
      case 'SELECT_CELLS':
        if (move.cells) {
          const cellStrings = Array.isArray(move.cells[0]) && typeof move.cells[0] === 'object'
            ? cellsToStrings(move.cells as Cell[])
            : move.cells as string[];
          
          this.updateGameState({
            ...currentState,
            currentSelection: cellStrings,
            // Clear hint cells when user starts selecting to avoid confusion
            hintCells: []
          });
        }
        break;

      case 'WORD_FOUND':
        if (move.word && move.cells) {
          const cellStrings = Array.isArray(move.cells[0]) && typeof move.cells[0] === 'object'
            ? cellsToStrings(move.cells as Cell[])
            : move.cells as string[];

          const validation = this.validateWordSelection(cellStrings);
          if (validation.isValid && validation.word) {
            this.updateGameState({
              ...currentState,
              foundWords: new Set([...currentState.foundWords, validation.word]),
              selectedCells: [...currentState.selectedCells, ...cellStrings],
              moves: currentState.moves + 1,
              score: currentState.score + validation.word.length * 10,
              currentSelection: [],
              hintCells: [] // Clear hints when word is found
            });

            this.emitEvent({
              type: 'MOVE_MADE',
              move: move,
              timestamp: Date.now()
            });

            // Check for completion
            const updatedState = this.getState();
            if (updatedState.foundWords.size === updatedState.words.length) {
              this.updateGameState({
                ...updatedState,
                status: 'completed',
                isComplete: true,
                endTime: Date.now()
              });
              this.emitEvent({
                type: 'GAME_COMPLETED',
                finalScore: updatedState.score,
                timestamp: Date.now()
              });
            }
          }
        }
        break;

      case 'HINT':
        console.log('Processing hint request...');
        const newState = {
          ...currentState,
          hintsUsed: currentState.hintsUsed + 1
        };
        
        // Find a word that hasn't been found yet
        const unfoundWords = currentState.words.filter(word => !currentState.foundWords.has(word));
        console.log('Unfound words:', unfoundWords);
        console.log('Available placed words:', this.placedWords);
        
        if (unfoundWords.length > 0 && this.placedWords.length > 0) {
          const hintWord = unfoundWords[0];
          const placedWord = this.placedWords.find(pw => pw.word === hintWord);
          
          console.log('Hint word:', hintWord, 'Placed word found:', !!placedWord);
          
          if (placedWord) {
            const hintCells: string[] = [];
            for (let i = 0; i < placedWord.word.length; i++) {
              if (placedWord.direction === 'horizontal') {
                hintCells.push(cellToString({ row: placedWord.startRow, col: placedWord.startCol + i }));
              } else if (placedWord.direction === 'vertical') {
                hintCells.push(cellToString({ row: placedWord.startRow + i, col: placedWord.startCol }));
              } else if (placedWord.direction === 'diagonal') {
                hintCells.push(cellToString({ row: placedWord.startRow + i, col: placedWord.startCol + i }));
              }
            }
            
            console.log('Generated hint cells:', hintCells);
            
            newState.hintCells = hintCells;
            newState.currentSelection = []; // Clear any current selection when showing hint
          } else {
            console.warn('No placed word found for hint word:', hintWord);
          }
        } else {
          console.warn('No unfound words or no placed words available for hints');
        }
        
        this.updateGameState(newState);
        
        this.emitEvent({
          type: 'HINT_USED',
          timestamp: Date.now()
        });
        break;
    }

    this.notifyListeners();
  }

  // Add a method to clear hints that can be called externally
  clearHints(): void {
    const currentState = this.getState();
    this.updateGameState({
      ...currentState,
      hintCells: []
    });
    this.notifyListeners();
  }

  validateWordSelection(cells: string[]): { isValid: boolean; word?: string } {
    if (cells.length < 2) return { isValid: false };

    // Convert to Cell objects
    const cellCoords = stringsToCells(cells);
    
    // Check if selection forms a straight line
    if (!this.isLinearSelection(cellCoords)) return { isValid: false };

    // Get the word from the grid
    const currentState = this.getState();
    const word = cellCoords.map(cell => currentState.grid[cell.row]?.[cell.col] || '').join('');
    
    // Check if it's one of our target words
    if (currentState.words.includes(word) && !currentState.foundWords.has(word)) {
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
    return this.getState().score;
  }

  checkWinCondition(): WinConditionResult {
    const currentState = this.getState();
    const isWin = currentState.foundWords.size === currentState.words.length;
    const completionPercentage = (currentState.foundWords.size / currentState.words.length) * 100;
    
    return {
      isWin,
      completionPercentage,
      finalScore: currentState.score
    };
  }

  pause(): void {
    const currentState = this.getState();
    this.updateGameState({
      ...currentState,
      status: 'paused'
    });
    this.emitEvent({
      type: 'GAME_PAUSED',
      timestamp: Date.now()
    });
    this.notifyListeners();
  }

  resume(): void {
    const currentState = this.getState();
    this.updateGameState({
      ...currentState,
      status: 'playing'
    });
    this.emitEvent({
      type: 'GAME_RESUMED',
      timestamp: Date.now()
    });
    this.notifyListeners();
  }

  reset(): void {
    const currentState = this.getState();
    this.updateGameState({
      ...currentState,
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
}
