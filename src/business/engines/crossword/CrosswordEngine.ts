import { GameEngine } from '../GameEngine';
import type { BaseGameState, GameConfig, MoveValidationResult, WinConditionResult } from '../../models/GameState';

export interface CrosswordPuzzle {
  id: string;
  title: string;
  grid: CrosswordCell[][];
  words: CrosswordWord[];
  clues: { across: CrosswordClue[]; down: CrosswordClue[]; }; // Changed to match the expected structure
  difficulty: string;
}

export interface CrosswordProgress {
  completedWords: string[];
  userInput: { [key: string]: string };
  incorrectAttempts: number;
}

export interface CrosswordCell {
  letter: string;
  isBlocked: boolean;
  number?: number;
  belongsToWords?: string[];
}

export interface CrosswordWord {
  id: string;
  word: string;
  startRow: number;
  startCol: number;
  direction: 'across' | 'down';
  clueId: string;
}

export interface CrosswordClue {
  id: string;
  number: number;
  clue: string;
  answer: string;
  direction: 'across' | 'down';
}

export interface CrosswordState extends BaseGameState {
  puzzle: CrosswordPuzzle | null;
  progress: CrosswordProgress | null;
  selectedCell: { row: number; col: number } | null;
  selectedWord: string | null;
  selectedDirection: 'across' | 'down';
  showHints: boolean;
  isPaused: boolean;
  gameStatus: 'loading' | 'ready' | 'playing' | 'completed' | 'error';
}

export interface CrosswordMove {
  type: 'ENTER_LETTER' | 'DELETE_LETTER' | 'SELECT_CELL' | 'SELECT_WORD' | 'HINT';
  row?: number;
  col?: number;
  letter?: string;
  wordId?: string;
  direction?: 'across' | 'down';
}

export class CrosswordEngine extends GameEngine<CrosswordState, CrosswordMove> {
  constructor(initialState: CrosswordState, config: GameConfig) {
    super(initialState, config);
  }

  async initialize(): Promise<void> {
    // Initialize crossword puzzle
    this.gameState = {
      ...this.gameState,
      status: 'idle'
    };
  }

  start(): void {
    this.gameState = {
      ...this.gameState,
      status: 'playing',
      startTime: Date.now()
    };
  }

  validateMove(move: CrosswordMove): MoveValidationResult {
    // Basic validation for crossword moves
    return { isValid: true, error: null };
  }

  makeMove(move: CrosswordMove): void {
    if (this.gameState.status !== 'playing') return;

    switch (move.type) {
      case 'ENTER_LETTER':
        if (move.row !== undefined && move.col !== undefined && move.letter) {
          // Handle letter entry logic
          this.gameState = {
            ...this.gameState,
            moves: this.gameState.moves + 1
          };
        }
        break;

      case 'DELETE_LETTER':
        if (move.row !== undefined && move.col !== undefined) {
          // Handle letter deletion logic
          this.gameState = {
            ...this.gameState,
            moves: this.gameState.moves + 1
          };
        }
        break;

      case 'SELECT_CELL':
        if (move.row !== undefined && move.col !== undefined) {
          this.gameState = {
            ...this.gameState,
            selectedCell: { row: move.row, col: move.col }
          };
        }
        break;
    }
  }

  calculateScore(): number {
    return this.gameState.score;
  }

  checkWinCondition(): WinConditionResult {
    const isWin = this.gameState.progress?.completedWords.length === this.gameState.puzzle?.words.length;
    const completionPercentage = this.gameState.puzzle?.words.length 
      ? (this.gameState.progress?.completedWords.length || 0) / this.gameState.puzzle.words.length * 100 
      : 0;
    
    return {
      isWin: isWin || false,
      completionPercentage,
      finalScore: this.gameState.score
    };
  }

  pause(): void {
    this.gameState = {
      ...this.gameState,
      status: 'paused'
    };
  }

  resume(): void {
    this.gameState = {
      ...this.gameState,
      status: 'playing'
    };
  }

  reset(): void {
    this.gameState = {
      ...this.gameState,
      status: 'idle',
      score: 0,
      moves: 0,
      startTime: null,
      endTime: null,
      isComplete: false
    };
  }
}
