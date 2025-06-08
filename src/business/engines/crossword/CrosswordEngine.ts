
import { GameEngine } from '../GameEngine';
import { BaseGameState, GameConfig, MoveValidationResult, WinConditionResult } from '../../models/GameState';

// Crossword-specific types
export interface CrosswordCell {
  id: string;
  row: number;
  col: number;
  letter: string;
  correctLetter: string;
  number?: number;
  isBlocked: boolean;
  belongsToWords: string[];
  isHighlighted: boolean;
  isSelected: boolean;
}

export interface CrosswordWord {
  id: string;
  clue: string;
  answer: string;
  startRow: number;
  startCol: number;
  direction: 'across' | 'down';
  number: number;
  isCompleted: boolean;
  cells: string[];
}

export interface CrosswordClue {
  id: string;
  number: number;
  direction: 'across' | 'down';
  clue: string;
  answer: string;
  isCompleted: boolean;
}

export interface CrosswordPuzzle {
  id: string;
  title: string;
  date: string;
  difficulty: 'easy' | 'medium' | 'hard';
  grid: CrosswordCell[][];
  words: CrosswordWord[];
  clues: {
    across: CrosswordClue[];
    down: CrosswordClue[];
  };
  size: number;
}

export interface CrosswordProgress {
  puzzleId: string;
  startTime: number;
  currentTime: number;
  hintsUsed: number;
  isCompleted: boolean;
  grid: string[][];
  completedWords: string[];
}

export interface CrosswordState extends BaseGameState {
  puzzle: CrosswordPuzzle | null;
  progress: CrosswordProgress | null;
  selectedCell: { row: number; col: number } | null;
  selectedWord: string | null;
  selectedDirection: 'across' | 'down';
  showHints: boolean;
  isPaused: boolean;
  gameStatus: 'loading' | 'playing' | 'completed' | 'error';
}

export interface CrosswordMove {
  type: 'INPUT_LETTER' | 'SELECT_CELL' | 'TOGGLE_DIRECTION' | 'GET_HINT';
  row?: number;
  col?: number;
  letter?: string;
}

export class CrosswordEngine extends GameEngine<CrosswordState, CrosswordMove> {
  constructor(initialState: CrosswordState, config: GameConfig) {
    super(initialState, config);
  }

  async initialize(): Promise<void> {
    if (!this.gameState.puzzle) {
      this.updateGameState({
        status: 'error',
        error: 'No puzzle data available'
      } as Partial<CrosswordState>);
      return;
    }

    // Validate puzzle structure
    const validationResult = this.validatePuzzle(this.gameState.puzzle);
    if (!validationResult.isValid) {
      console.warn('Puzzle validation failed:', validationResult.errors);
    }

    this.updateGameState({
      status: 'idle'
    } as Partial<CrosswordState>);

    this.emitEvent({
      type: 'GAME_STARTED',
      timestamp: Date.now()
    });
  }

  start(): void {
    if (this.gameState.status !== 'idle') return;

    this.updateGameState({
      status: 'playing',
      startTime: Date.now()
    } as Partial<CrosswordState>);

    this.emitEvent({
      type: 'GAME_STARTED',
      timestamp: Date.now()
    });
  }

  validateMove(move: CrosswordMove): MoveValidationResult {
    if (!this.isGameActive()) {
      return {
        isValid: false,
        error: 'Game is not active'
      };
    }

    switch (move.type) {
      case 'INPUT_LETTER':
        return this.validateLetterInput(move);
      case 'SELECT_CELL':
        return this.validateCellSelection(move);
      case 'TOGGLE_DIRECTION':
        return { isValid: true };
      case 'GET_HINT':
        return this.validateHintRequest();
      default:
        return {
          isValid: false,
          error: 'Invalid move type'
        };
    }
  }

  makeMove(move: CrosswordMove): void {
    const validation = this.validateMove(move);
    if (!validation.isValid) {
      console.error('Invalid move:', validation.error);
      return;
    }

    switch (move.type) {
      case 'INPUT_LETTER':
        this.handleLetterInput(move);
        break;
      case 'SELECT_CELL':
        this.handleCellSelection(move);
        break;
      case 'TOGGLE_DIRECTION':
        this.handleDirectionToggle();
        break;
      case 'GET_HINT':
        this.handleHintRequest();
        break;
    }

    this.updateGameState({
      moves: this.gameState.moves + 1
    } as Partial<CrosswordState>);

    this.emitEvent({
      type: 'MOVE_MADE',
      move,
      timestamp: Date.now()
    });

    // Check for completion after each move
    const winResult = this.checkWinCondition();
    if (winResult.isWin) {
      this.handleGameCompletion();
    }
  }

  calculateScore(): number {
    if (!this.gameState.puzzle || !this.gameState.progress) return 0;

    const completedWords = this.getCompletedWords();
    const totalWords = this.gameState.puzzle.words.length;
    const completionPercentage = completedWords.length / totalWords;
    
    // Base score from completion
    let score = Math.floor(completionPercentage * 1000);
    
    // Time bonus (faster completion = higher score)
    if (this.gameState.startTime && this.gameState.endTime) {
      const timeElapsed = this.gameState.endTime - this.gameState.startTime;
      const timeBonus = Math.max(0, 500 - Math.floor(timeElapsed / 1000));
      score += timeBonus;
    }
    
    // Penalty for hints
    const hintPenalty = this.gameState.progress.hintsUsed * 50;
    score = Math.max(0, score - hintPenalty);
    
    return score;
  }

  checkWinCondition(): WinConditionResult {
    if (!this.gameState.puzzle) {
      return {
        isWin: false,
        completionPercentage: 0,
        finalScore: 0
      };
    }

    const completedWords = this.getCompletedWords();
    const totalWords = this.gameState.puzzle.words.length;
    const completionPercentage = completedWords.length / totalWords;
    const isWin = completionPercentage === 1;

    return {
      isWin,
      completionPercentage,
      finalScore: this.calculateScore(),
      bonusPoints: isWin ? 100 : 0
    };
  }

  pause(): void {
    if (this.gameState.status === 'playing') {
      this.updateGameState({
        status: 'paused',
        isPaused: true
      } as Partial<CrosswordState>);

      this.emitEvent({
        type: 'GAME_PAUSED',
        timestamp: Date.now()
      });
    }
  }

  resume(): void {
    if (this.gameState.status === 'paused') {
      this.updateGameState({
        status: 'playing',
        isPaused: false
      } as Partial<CrosswordState>);

      this.emitEvent({
        type: 'GAME_RESUMED',
        timestamp: Date.now()
      });
    }
  }

  reset(): void {
    if (!this.gameState.puzzle) return;

    // Reset grid to empty state
    const resetGrid = this.gameState.puzzle.grid.map(row =>
      row.map(cell => ({
        ...cell,
        letter: '',
        isSelected: false,
        isHighlighted: false
      }))
    );

    const resetProgress: CrosswordProgress = {
      puzzleId: this.gameState.puzzle.id,
      startTime: Date.now(),
      currentTime: Date.now(),
      hintsUsed: 0,
      isCompleted: false,
      grid: resetGrid.map(row => row.map(cell => cell.letter)),
      completedWords: []
    };

    this.updateGameState({
      status: 'idle',
      startTime: null,
      endTime: null,
      score: 0,
      moves: 0,
      isComplete: false,
      progress: resetProgress,
      selectedCell: null,
      selectedWord: null,
      isPaused: false,
      gameStatus: 'playing'
    } as Partial<CrosswordState>);
  }

  // Private helper methods
  private validatePuzzle(puzzle: CrosswordPuzzle): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!puzzle.grid || puzzle.grid.length === 0) {
      errors.push('Empty or invalid grid');
    }

    if (!puzzle.words || puzzle.words.length === 0) {
      errors.push('No words defined');
    }

    if (!puzzle.clues || !puzzle.clues.across || !puzzle.clues.down) {
      errors.push('Missing clues');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private validateLetterInput(move: CrosswordMove): MoveValidationResult {
    if (!this.gameState.selectedCell) {
      return {
        isValid: false,
        error: 'No cell selected'
      };
    }

    if (move.letter && !/^[a-zA-Z]$/.test(move.letter)) {
      return {
        isValid: false,
        error: 'Invalid letter'
      };
    }

    return { isValid: true };
  }

  private validateCellSelection(move: CrosswordMove): MoveValidationResult {
    if (move.row === undefined || move.col === undefined) {
      return {
        isValid: false,
        error: 'Invalid cell coordinates'
      };
    }

    if (!this.gameState.puzzle) {
      return {
        isValid: false,
        error: 'No puzzle loaded'
      };
    }

    const { row, col } = move;
    if (row < 0 || row >= this.gameState.puzzle.grid.length ||
        col < 0 || col >= this.gameState.puzzle.grid[0].length) {
      return {
        isValid: false,
        error: 'Cell out of bounds'
      };
    }

    const cell = this.gameState.puzzle.grid[row][col];
    if (cell.isBlocked) {
      return {
        isValid: false,
        error: 'Cannot select blocked cell'
      };
    }

    return { isValid: true };
  }

  private validateHintRequest(): MoveValidationResult {
    if (!this.gameState.selectedCell) {
      return {
        isValid: false,
        error: 'No cell selected for hint'
      };
    }

    return { isValid: true };
  }

  private handleLetterInput(move: CrosswordMove): void {
    if (!this.gameState.puzzle || !this.gameState.selectedCell) return;

    const { row, col } = this.gameState.selectedCell;
    const newGrid = [...this.gameState.puzzle.grid];
    const cell = newGrid[row][col];
    
    cell.letter = move.letter || '';
    
    this.updateGameState({
      puzzle: {
        ...this.gameState.puzzle,
        grid: newGrid
      }
    } as Partial<CrosswordState>);
  }

  private handleCellSelection(move: CrosswordMove): void {
    if (!this.gameState.puzzle || move.row === undefined || move.col === undefined) return;

    // Clear previous selections
    const newGrid = this.gameState.puzzle.grid.map(row =>
      row.map(cell => ({
        ...cell,
        isSelected: false,
        isHighlighted: false
      }))
    );

    // Set new selection
    newGrid[move.row][move.col].isSelected = true;

    // Find and highlight words containing this cell
    const selectedCell = newGrid[move.row][move.col];
    const wordsContainingCell = this.gameState.puzzle.words.filter(word =>
      word.cells.includes(selectedCell.id)
    );

    if (wordsContainingCell.length > 0) {
      const word = wordsContainingCell.find(w => w.direction === this.gameState.selectedDirection) ||
                   wordsContainingCell[0];
      
      // Highlight word cells
      word.cells.forEach(cellId => {
        const [cellRow, cellCol] = cellId.split('-').map(Number);
        if (newGrid[cellRow] && newGrid[cellRow][cellCol]) {
          newGrid[cellRow][cellCol].isHighlighted = true;
        }
      });

      this.updateGameState({
        selectedWord: word.id
      } as Partial<CrosswordState>);
    }

    this.updateGameState({
      puzzle: {
        ...this.gameState.puzzle,
        grid: newGrid
      },
      selectedCell: { row: move.row, col: move.col }
    } as Partial<CrosswordState>);
  }

  private handleDirectionToggle(): void {
    const newDirection = this.gameState.selectedDirection === 'across' ? 'down' : 'across';
    this.updateGameState({
      selectedDirection: newDirection
    } as Partial<CrosswordState>);
  }

  private handleHintRequest(): void {
    if (!this.gameState.puzzle || !this.gameState.selectedCell || !this.gameState.progress) return;

    const { row, col } = this.gameState.selectedCell;
    const cell = this.gameState.puzzle.grid[row][col];
    const correctLetter = cell.correctLetter;

    // Set the correct letter
    const newGrid = [...this.gameState.puzzle.grid];
    newGrid[row][col] = { ...cell, letter: correctLetter };

    this.updateGameState({
      puzzle: {
        ...this.gameState.puzzle,
        grid: newGrid
      },
      progress: {
        ...this.gameState.progress,
        hintsUsed: this.gameState.progress.hintsUsed + 1
      }
    } as Partial<CrosswordState>);

    this.emitEvent({
      type: 'HINT_USED',
      timestamp: Date.now()
    });
  }

  private getCompletedWords(): CrosswordWord[] {
    if (!this.gameState.puzzle) return [];

    return this.gameState.puzzle.words.filter(word => {
      return word.cells.every(cellId => {
        const [row, col] = cellId.split('-').map(Number);
        const cell = this.gameState.puzzle!.grid[row][col];
        return cell.letter.toLowerCase() === cell.correctLetter.toLowerCase();
      });
    });
  }

  private handleGameCompletion(): void {
    const endTime = Date.now();
    const finalScore = this.calculateScore();

    this.updateGameState({
      status: 'completed',
      endTime,
      score: finalScore,
      isComplete: true,
      gameStatus: 'completed'
    } as Partial<CrosswordState>);

    this.emitEvent({
      type: 'GAME_COMPLETED',
      finalScore,
      timestamp: endTime
    });
  }
}
