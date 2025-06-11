
import { PlacedWord, Cell } from './types';
import { cellToString, stringToCell, cellsToStrings, stringsToCells } from './utils';

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

  constructor(gridSize: number = 15) {
    this.gridSize = gridSize;
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
    // Create empty grid
    const grid: string[][] = Array(this.gridSize).fill(null).map(() => 
      Array(this.gridSize).fill('')
    );

    // Simple word placement - horizontal only for now
    const placedWords: PlacedWord[] = [];
    
    words.forEach((word, index) => {
      if (index < this.gridSize) {
        const row = index;
        const startCol = Math.max(0, Math.floor((this.gridSize - word.length) / 2));
        
        // Place word horizontally
        for (let i = 0; i < word.length; i++) {
          grid[row][startCol + i] = word[i].toUpperCase();
        }
        
        placedWords.push({
          word: word.toUpperCase(),
          startRow: row,
          startCol: startCol,
          endRow: row,
          endCol: startCol + word.length - 1,
          direction: 'horizontal',
          cells: Array.from({ length: word.length }, (_, i) => ({
            row,
            col: startCol + i
          }))
        });
      }
    });

    // Fill empty cells with random letters
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        if (grid[row][col] === '') {
          grid[row][col] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }

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
          if (result.isValid && result.word) {
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
    
    // Get the word from the grid
    const word = cells.map(cell => this.state.grid[cell.row]?.[cell.col] || '').join('');
    
    // Check if it's a target word
    const isTargetWord = this.state.targetWords.includes(word) && 
                        !this.state.foundWords.includes(word);
    
    if (isTargetWord) {
      return { isValid: true, word };
    }

    // Also check reverse
    const reverseWord = word.split('').reverse().join('');
    const isReverseTargetWord = this.state.targetWords.includes(reverseWord) && 
                               !this.state.foundWords.includes(reverseWord);
    
    if (isReverseTargetWord) {
      return { isValid: true, word: reverseWord };
    }

    return { isValid: false };
  }

  public getGameState(): WordSearchState {
    return { ...this.state };
  }

  public getGameStateForSave(): WordSearchState {
    return this.getGameState();
  }

  public restoreGameState(savedState: WordSearchState): void {
    this.state = { ...savedState };
    this.notifyListeners();
  }

  public subscribe(listener: GameStateListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public clearHints(): void {
    // No hints system implemented yet
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }
}
