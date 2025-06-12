
import { PlacedWord, Cell } from './types';
import { cellToString, stringToCell, cellsToStrings, stringsToCells } from './utils';
import { WordPlacementEngine } from '../../../components/games/word-search/WordPlacementEngine';

export interface WordSearchState {
  grid: string[][];
  placedWords: PlacedWord[];
  foundWords: string[];
  targetWords: string[];
  currentSelection: string[];
  gameCompleted: boolean;
  score: number;
  timeElapsed: number;
}

export interface WordSearchMove {
  type: 'select_cells' | 'clear_selection' | 'submit_word';
  cellIds?: string[];
  word?: string;
}

type GameStateListener = (state: WordSearchState) => void;

export class WordSearchEngine {
  private state: WordSearchState;
  private listeners: GameStateListener[] = [];
  private gridSize: number;
  private placementEngine: WordPlacementEngine;

  constructor(gridSize: number = 15) {
    this.gridSize = gridSize;
    this.placementEngine = new WordPlacementEngine(gridSize);
    this.state = {
      grid: [],
      placedWords: [],
      foundWords: [],
      targetWords: [],
      currentSelection: [],
      gameCompleted: false,
      score: 0,
      timeElapsed: 0
    };
  }

  public initializeGame(words: string[]): WordSearchState {
    console.log('WordSearchEngine: Initializing game with words:', words);
    
    const { grid, placedWords } = this.placementEngine.placeWords(words);
    
    console.log('WordSearchEngine: Grid after placement:', grid);
    console.log('WordSearchEngine: Placed words count:', placedWords.length);

    this.state = {
      grid,
      placedWords,
      foundWords: [],
      targetWords: words.map(w => w.toUpperCase()),
      currentSelection: [],
      gameCompleted: false,
      score: 0,
      timeElapsed: 0
    };

    console.log('WordSearchEngine: Final state initialized');
    this.notifyListeners();
    return this.state;
  }

  public makeMove(move: WordSearchMove): WordSearchState {
    switch (move.type) {
      case 'select_cells':
        if (move.cellIds) {
          this.state.currentSelection = move.cellIds;
        }
        break;
      
      case 'clear_selection':
        this.state.currentSelection = [];
        break;
      
      case 'submit_word':
        if (move.cellIds) {
          const result = this.validateWordSelection(move.cellIds);
          if (result.isValid && result.word && !this.state.foundWords.includes(result.word)) {
            this.state.foundWords.push(result.word);
            this.state.currentSelection = [];
            this.state.score = this.calculateScore();
            
            // Check if game is completed
            if (this.state.foundWords.length === this.state.targetWords.length) {
              this.state.gameCompleted = true;
            }
          }
        }
        break;
    }

    this.notifyListeners();
    return this.state;
  }

  public calculateScore(): number {
    return this.state.foundWords.length * 100;
  }

  public validateWordSelection(cellIds: string[]): { isValid: boolean; word?: string } {
    if (cellIds.length === 0) return { isValid: false };

    // Convert cell IDs to cells
    const cells = stringsToCells(cellIds);
    
    // Check if selection forms a valid line
    if (!this.isValidLine(cells)) {
      return { isValid: false };
    }
    
    // Get the word from the grid (both forward and reverse)
    const forwardWord = this.getWordFromCells(cells);
    const reverseWord = forwardWord.split('').reverse().join('');
    
    console.log('Validating word:', forwardWord, 'reverse:', reverseWord);
    console.log('Target words:', this.state.targetWords);
    console.log('Found words:', this.state.foundWords);
    
    // Check if it's a target word and not already found
    const isTargetWord = this.state.targetWords.includes(forwardWord) && 
                        !this.state.foundWords.includes(forwardWord);
    
    if (isTargetWord) {
      console.log('Valid word found:', forwardWord);
      return { isValid: true, word: forwardWord };
    }

    // Also check reverse
    const isReverseTargetWord = this.state.targetWords.includes(reverseWord) && 
                               !this.state.foundWords.includes(reverseWord);
    
    if (isReverseTargetWord) {
      console.log('Valid reverse word found:', reverseWord);
      return { isValid: true, word: reverseWord };
    }

    console.log('No valid word found');
    return { isValid: false };
  }

  private isValidLine(cells: Cell[]): boolean {
    if (cells.length < 2) return false;

    const first = cells[0];
    const last = cells[cells.length - 1];
    
    const deltaRow = last.row - first.row;
    const deltaCol = last.col - first.col;
    
    // Check if it's a straight line (8 directions)
    const isHorizontal = deltaRow === 0 && deltaCol !== 0;
    const isVertical = deltaCol === 0 && deltaRow !== 0;
    const isDiagonal = Math.abs(deltaRow) === Math.abs(deltaCol) && deltaRow !== 0 && deltaCol !== 0;
    
    return isHorizontal || isVertical || isDiagonal;
  }

  private getWordFromCells(cells: Cell[]): string {
    // Sort cells to form a proper word sequence
    const sortedCells = this.sortCellsInSequence(cells);
    
    return sortedCells.map(cell => {
      if (cell.row < 0 || cell.row >= this.gridSize || cell.col < 0 || cell.col >= this.gridSize) {
        return '';
      }
      return this.state.grid[cell.row]?.[cell.col] || '';
    }).join('');
  }

  private sortCellsInSequence(cells: Cell[]): Cell[] {
    if (!cells || cells.length <= 1) return cells || [];

    // Determine direction and sort accordingly
    const first = cells[0];
    const last = cells[cells.length - 1];
    
    const deltaRow = last.row - first.row;
    const deltaCol = last.col - first.col;

    // Create a copy to sort
    const sortedCells = [...cells];

    if (deltaRow === 0) {
      // Horizontal line - sort by column
      sortedCells.sort((a, b) => deltaCol > 0 ? a.col - b.col : b.col - a.col);
    } else if (deltaCol === 0) {
      // Vertical line - sort by row
      sortedCells.sort((a, b) => deltaRow > 0 ? a.row - b.row : b.row - a.row);
    } else {
      // Diagonal line - sort by primary direction
      if (deltaRow > 0) {
        // Going down
        sortedCells.sort((a, b) => a.row - b.row);
      } else {
        // Going up
        sortedCells.sort((a, b) => b.row - a.row);
      }
    }

    return sortedCells;
  }

  public getGameState(): WordSearchState {
    return { ...this.state };
  }

  public subscribe(listener: GameStateListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }
}
