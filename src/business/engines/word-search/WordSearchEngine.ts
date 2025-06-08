
import { GameEngine } from '../GameEngine';
import { BaseGameState, GameConfig, MoveValidationResult, WinConditionResult, GameEvent } from '../../models/GameState';

// Word Search specific game state
export interface WordSearchState extends BaseGameState {
  grid: string[][];
  gridSize: number;
  words: string[];
  foundWords: Set<string>;
  placedWords: PlacedWord[];
  selectedCells: string[];
  incorrectSelections: number;
  category: string;
  difficulty: 'rookie' | 'pro' | 'master';
}

export interface PlacedWord {
  word: string;
  cells: string[];
  direction: 'horizontal' | 'vertical' | 'diagonal';
  startRow: number;
  startCol: number;
}

export interface WordSearchMove {
  type: 'SELECT_CELLS' | 'VALIDATE_SELECTION' | 'HINT';
  selectedCells?: string[];
  payload?: any;
}

export class WordSearchEngine extends GameEngine<WordSearchState, WordSearchMove> {
  private gridGenerator: WordSearchGridGenerator;
  private validator: WordSearchValidator;

  constructor(initialState: WordSearchState, config: GameConfig) {
    super(initialState, config);
    this.gridGenerator = new WordSearchGridGenerator();
    this.validator = new WordSearchValidator();
  }

  async initialize(): Promise<void> {
    const { words, difficulty } = this.gameState;
    const gridResult = this.gridGenerator.generateGrid(words, difficulty);
    
    this.updateGameState({
      grid: gridResult.grid,
      placedWords: gridResult.placedWords,
      gridSize: gridResult.gridSize,
      status: 'idle'
    });

    this.emitEvent({
      type: 'GAME_STARTED',
      timestamp: Date.now()
    });
  }

  start(): void {
    this.updateGameState({
      status: 'playing',
      startTime: Date.now()
    });

    this.emitEvent({
      type: 'GAME_STARTED',
      timestamp: Date.now()
    });
  }

  validateMove(move: WordSearchMove): MoveValidationResult {
    if (!this.isGameActive()) {
      return { isValid: false, error: 'Game is not active' };
    }

    switch (move.type) {
      case 'SELECT_CELLS':
        return this.validateCellSelection(move.selectedCells || []);
      case 'VALIDATE_SELECTION':
        return this.validateWordSelection(move.selectedCells || []);
      case 'HINT':
        return { isValid: true };
      default:
        return { isValid: false, error: 'Invalid move type' };
    }
  }

  makeMove(move: WordSearchMove): void {
    const validation = this.validateMove(move);
    if (!validation.isValid) {
      return;
    }

    switch (move.type) {
      case 'SELECT_CELLS':
        this.updateGameState({
          selectedCells: move.selectedCells || []
        });
        break;

      case 'VALIDATE_SELECTION':
        this.processWordSelection(move.selectedCells || []);
        break;

      case 'HINT':
        this.processHint();
        break;
    }

    this.updateGameState({
      moves: this.gameState.moves + 1
    });

    this.emitEvent({
      type: 'MOVE_MADE',
      move,
      timestamp: Date.now()
    });
  }

  calculateScore(): number {
    const { foundWords, words, incorrectSelections, startTime, difficulty } = this.gameState;
    
    if (!startTime) return 0;

    const baseScore = 1000;
    const wordsFoundScore = (foundWords.size / words.length) * 500;
    const timeElapsed = Date.now() - startTime;
    const timeBonus = Math.max(0, (this.config.timeLimit || 300) * 1000 - timeElapsed) / 1000 * 2;
    const penaltyDeduction = incorrectSelections * 25;
    
    // Difficulty multiplier
    const difficultyMultiplier = difficulty === 'master' ? 1.5 : difficulty === 'pro' ? 1.2 : 1.0;
    
    return Math.max(0, Math.floor((baseScore + wordsFoundScore + timeBonus - penaltyDeduction) * difficultyMultiplier));
  }

  checkWinCondition(): WinConditionResult {
    const { foundWords, words } = this.gameState;
    const isWin = foundWords.size === words.length;
    const completionPercentage = (foundWords.size / words.length) * 100;
    const finalScore = this.calculateScore();

    if (isWin && this.gameState.status === 'playing') {
      this.updateGameState({
        status: 'completed',
        endTime: Date.now(),
        score: finalScore,
        isComplete: true
      });

      this.emitEvent({
        type: 'GAME_COMPLETED',
        finalScore,
        timestamp: Date.now()
      });
    }

    return {
      isWin,
      completionPercentage,
      finalScore,
      bonusPoints: isWin ? 100 : 0
    };
  }

  pause(): void {
    if (this.gameState.status === 'playing') {
      this.updateGameState({ status: 'paused' });
      this.emitEvent({
        type: 'GAME_PAUSED',
        timestamp: Date.now()
      });
    }
  }

  resume(): void {
    if (this.gameState.status === 'paused') {
      this.updateGameState({ status: 'playing' });
      this.emitEvent({
        type: 'GAME_RESUMED',
        timestamp: Date.now()
      });
    }
  }

  reset(): void {
    const resetState: Partial<WordSearchState> = {
      status: 'idle',
      startTime: null,
      endTime: null,
      score: 0,
      moves: 0,
      isComplete: false,
      foundWords: new Set(),
      selectedCells: [],
      incorrectSelections: 0
    };

    this.updateGameState(resetState);
  }

  // Word Search specific methods
  getUnfoundWords(): PlacedWord[] {
    return this.gameState.placedWords.filter(
      placedWord => !this.gameState.foundWords.has(placedWord.word)
    );
  }

  getHint(): PlacedWord | null {
    const unfoundWords = this.getUnfoundWords();
    if (unfoundWords.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * unfoundWords.length);
    return unfoundWords[randomIndex];
  }

  private validateCellSelection(selectedCells: string[]): MoveValidationResult {
    if (selectedCells.length === 0) {
      return { isValid: false, error: 'No cells selected' };
    }

    // Validate cell format and bounds
    const { gridSize } = this.gameState;
    for (const cellId of selectedCells) {
      const [row, col] = cellId.split('-').map(Number);
      if (isNaN(row) || isNaN(col) || row < 0 || row >= gridSize || col < 0 || col >= gridSize) {
        return { isValid: false, error: 'Invalid cell coordinates' };
      }
    }

    return { isValid: true };
  }

  private validateWordSelection(selectedCells: string[]): MoveValidationResult {
    if (selectedCells.length < 2) {
      return { isValid: false, error: 'Selection too short' };
    }

    const validationResult = this.validator.validateSelection(
      selectedCells,
      this.gameState.placedWords,
      this.gameState.grid
    );

    return {
      isValid: validationResult.isValid,
      error: validationResult.error,
      newState: validationResult.foundWord ? {
        foundWords: new Set([...this.gameState.foundWords, validationResult.foundWord.word])
      } : undefined
    };
  }

  private processWordSelection(selectedCells: string[]): void {
    const validationResult = this.validator.validateSelection(
      selectedCells,
      this.gameState.placedWords,
      this.gameState.grid
    );

    if (validationResult.isValid && validationResult.foundWord) {
      const newFoundWords = new Set([...this.gameState.foundWords, validationResult.foundWord.word]);
      this.updateGameState({
        foundWords: newFoundWords,
        selectedCells: []
      });
    } else {
      this.updateGameState({
        incorrectSelections: this.gameState.incorrectSelections + 1,
        selectedCells: []
      });
    }
  }

  private processHint(): void {
    this.emitEvent({
      type: 'HINT_USED',
      timestamp: Date.now()
    });
  }
}

// Grid generation logic
class WordSearchGridGenerator {
  generateGrid(words: string[], difficulty: 'rookie' | 'pro' | 'master') {
    const gridSize = this.getGridSize(difficulty);
    const grid = this.createEmptyGrid(gridSize);
    const placedWords: PlacedWord[] = [];

    // Place words in grid
    for (const word of words) {
      const placement = this.placeWordInGrid(grid, word, gridSize);
      if (placement) {
        placedWords.push(placement);
      }
    }

    // Fill empty cells with random letters
    this.fillEmptyCells(grid);

    return { grid, placedWords, gridSize };
  }

  private getGridSize(difficulty: 'rookie' | 'pro' | 'master'): number {
    switch (difficulty) {
      case 'rookie': return 12;
      case 'pro': return 15;
      case 'master': return 18;
      default: return 12;
    }
  }

  private createEmptyGrid(size: number): string[][] {
    return Array(size).fill(null).map(() => Array(size).fill(''));
  }

  private placeWordInGrid(grid: string[][], word: string, gridSize: number): PlacedWord | null {
    const directions = ['horizontal', 'vertical', 'diagonal'] as const;
    const attempts = 100;

    for (let attempt = 0; attempt < attempts; attempt++) {
      const direction = directions[Math.floor(Math.random() * directions.length)];
      const placement = this.tryPlaceWord(grid, word, direction, gridSize);
      if (placement) {
        return placement;
      }
    }

    return null;
  }

  private tryPlaceWord(
    grid: string[][],
    word: string,
    direction: 'horizontal' | 'vertical' | 'diagonal',
    gridSize: number
  ): PlacedWord | null {
    const maxRow = direction === 'horizontal' ? gridSize : gridSize - word.length;
    const maxCol = direction === 'vertical' ? gridSize : gridSize - word.length;

    const startRow = Math.floor(Math.random() * maxRow);
    const startCol = Math.floor(Math.random() * maxCol);

    const cells: string[] = [];
    const positions: Array<{ row: number; col: number }> = [];

    // Calculate positions
    for (let i = 0; i < word.length; i++) {
      let row = startRow;
      let col = startCol;

      switch (direction) {
        case 'horizontal':
          col += i;
          break;
        case 'vertical':
          row += i;
          break;
        case 'diagonal':
          row += i;
          col += i;
          break;
      }

      if (row >= gridSize || col >= gridSize) return null;

      positions.push({ row, col });
      cells.push(`${row}-${col}`);
    }

    // Check if positions are free or have matching letters
    for (let i = 0; i < positions.length; i++) {
      const { row, col } = positions[i];
      const existingLetter = grid[row][col];
      const currentLetter = word[i];

      if (existingLetter !== '' && existingLetter !== currentLetter) {
        return null;
      }
    }

    // Place the word
    for (let i = 0; i < positions.length; i++) {
      const { row, col } = positions[i];
      grid[row][col] = word[i];
    }

    return {
      word,
      cells,
      direction,
      startRow,
      startCol
    };
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
}

// Word validation logic
class WordSearchValidator {
  validateSelection(selectedCells: string[], placedWords: PlacedWord[], grid: string[][]) {
    try {
      if (!selectedCells || selectedCells.length < 2) {
        return { isValid: false, error: 'Selection too short' };
      }

      const selectedWord = this.getWordFromCells(selectedCells, grid);
      const reverseWord = selectedWord.split('').reverse().join('');

      // Check against placed words
      for (const placedWord of placedWords) {
        if (this.isSelectionMatchingWord(selectedCells, placedWord) &&
            (selectedWord === placedWord.word || reverseWord === placedWord.word)) {
          return {
            isValid: true,
            foundWord: placedWord
          };
        }
      }

      return { isValid: false, error: 'No matching word found' };
    } catch (error) {
      return { isValid: false, error: 'Validation error' };
    }
  }

  private getWordFromCells(selectedCells: string[], grid: string[][]): string {
    const sortedCells = this.sortCellsInSequence(selectedCells);
    
    return sortedCells.map(cellId => {
      const [row, col] = cellId.split('-').map(Number);
      if (isNaN(row) || isNaN(col) || row < 0 || row >= grid.length || col < 0 || col >= grid[0]?.length) {
        return '';
      }
      return grid[row]?.[col] || '';
    }).join('');
  }

  private sortCellsInSequence(cells: string[]): string[] {
    if (!cells || cells.length <= 1) return cells || [];

    const coords = cells.map(cell => {
      const [row, col] = cell.split('-').map(Number);
      return { cellId: cell, row: isNaN(row) ? 0 : row, col: isNaN(col) ? 0 : col };
    });

    if (coords.length === 0) return [];

    const first = coords[0];
    const last = coords[coords.length - 1];
    
    const deltaRow = last.row - first.row;
    const deltaCol = last.col - first.col;

    // Sort based on direction
    if (deltaRow === 0) {
      coords.sort((a, b) => a.col - b.col);
    } else if (deltaCol === 0) {
      coords.sort((a, b) => a.row - b.row);
    } else if (deltaRow === deltaCol) {
      coords.sort((a, b) => a.row - b.row);
    } else if (deltaRow === -deltaCol) {
      coords.sort((a, b) => a.row - b.row);
    } else {
      if (Math.abs(deltaRow) > Math.abs(deltaCol)) {
        coords.sort((a, b) => a.row - b.row);
      } else {
        coords.sort((a, b) => a.col - b.col);
      }
    }

    return coords.map(coord => coord.cellId);
  }

  private isSelectionMatchingWord(selectedCells: string[], placedWord: PlacedWord): boolean {
    if (!selectedCells || !placedWord || !placedWord.cells) {
      return false;
    }

    if (selectedCells.length === placedWord.cells.length) {
      const sortedSelected = [...selectedCells].sort();
      const sortedWordCells = [...placedWord.cells].sort();
      
      return JSON.stringify(sortedSelected) === JSON.stringify(sortedWordCells);
    }

    return false;
  }
}
