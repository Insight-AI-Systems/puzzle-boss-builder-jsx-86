
import { PlacedWord, Cell } from '@/business/engines/word-search/types';

export class WordSelectionValidator {
  private placedWords: PlacedWord[];
  private grid: string[][];

  constructor(placedWords: PlacedWord[], grid: string[][]) {
    this.placedWords = placedWords || [];
    this.grid = grid || [];
  }

  public validateSelection(selectedCells: Cell[]): {
    isValid: boolean;
    word?: string;
    foundWord?: PlacedWord;
  } {
    try {
      if (!selectedCells || selectedCells.length < 2) {
        return { isValid: false };
      }

      // Get the word formed by selection
      const selectedWord = this.getWordFromCells(selectedCells);
      if (!selectedWord) {
        return { isValid: false };
      }

      const reverseWord = selectedWord.split('').reverse().join('');

      console.log('Validating selection:', { selectedCells, selectedWord, reverseWord });

      // Check against all placed words
      for (const placedWord of this.placedWords) {
        if (this.isSelectionMatchingWord(selectedCells, placedWord)) {
          console.log('Selection matches placed word:', placedWord.word);
          return {
            isValid: true,
            word: placedWord.word,
            foundWord: placedWord
          };
        }
      }

      return { isValid: false };
    } catch (error) {
      console.error('Error validating selection:', error);
      return { isValid: false };
    }
  }

  private getWordFromCells(selectedCells: Cell[]): string {
    try {
      if (!selectedCells || selectedCells.length === 0) {
        return '';
      }

      // Sort cells to form a proper word sequence
      const sortedCells = this.sortCellsInSequence(selectedCells);
      
      return sortedCells.map(cell => {
        if (cell.row < 0 || cell.row >= this.grid.length || cell.col < 0 || cell.col >= this.grid[0]?.length) {
          return '';
        }
        return this.grid[cell.row]?.[cell.col] || '';
      }).join('');
    } catch (error) {
      console.error('Error getting word from cells:', error);
      return '';
    }
  }

  private sortCellsInSequence(cells: Cell[]): Cell[] {
    try {
      if (!cells || cells.length <= 1) return cells || [];

      // Determine direction and sort accordingly
      const first = cells[0];
      const last = cells[cells.length - 1];
      
      const deltaRow = last.row - first.row;
      const deltaCol = last.col - first.col;

      // Sort based on direction
      if (deltaRow === 0) {
        // Horizontal
        cells.sort((a, b) => a.col - b.col);
      } else if (deltaCol === 0) {
        // Vertical
        cells.sort((a, b) => a.row - b.row);
      } else if (deltaRow === deltaCol) {
        // Diagonal down-right
        cells.sort((a, b) => a.row - b.row);
      } else if (deltaRow === -deltaCol) {
        // Diagonal up-right
        cells.sort((a, b) => a.row - b.row);
      } else {
        // Try to sort by primary direction
        if (Math.abs(deltaRow) > Math.abs(deltaCol)) {
          cells.sort((a, b) => a.row - b.row);
        } else {
          cells.sort((a, b) => a.col - b.col);
        }
      }

      return cells;
    } catch (error) {
      console.error('Error sorting cells in sequence:', error);
      return cells || [];
    }
  }

  private isSelectionMatchingWord(selectedCells: Cell[], placedWord: PlacedWord): boolean {
    try {
      if (!selectedCells || !placedWord || !placedWord.cells || !placedWord.word) {
        return false;
      }

      const { cells: wordCells, word } = placedWord;

      // Convert word cells from string format to Cell objects
      const wordCellObjects = wordCells.map(cellId => {
        const [row, col] = cellId.split('-').map(Number);
        return { row, col };
      });

      // Check if selection matches word cells exactly
      if (selectedCells.length === wordCellObjects.length) {
        const selectedCellIds = selectedCells.map(cell => `${cell.row}-${cell.col}`).sort();
        const wordCellIds = wordCells.sort();
        
        if (JSON.stringify(selectedCellIds) === JSON.stringify(wordCellIds)) {
          return true;
        }
      }

      // Check if selection forms the word
      const selectedWord = this.getWordFromCells(selectedCells);
      const reverseWord = selectedWord.split('').reverse().join('');

      return selectedWord === word || reverseWord === word;
    } catch (error) {
      console.error('Error checking selection match:', error);
      return false;
    }
  }

  public getUnfoundWords(foundWords: Set<string>): PlacedWord[] {
    try {
      if (!foundWords) {
        return this.placedWords;
      }
      return this.placedWords.filter(placedWord => !foundWords.has(placedWord.word));
    } catch (error) {
      console.error('Error getting unfound words:', error);
      return [];
    }
  }

  public getRandomUnfoundWord(foundWords: Set<string>): PlacedWord | null {
    try {
      const unfound = this.getUnfoundWords(foundWords);
      if (unfound.length === 0) return null;
      
      const randomIndex = Math.floor(Math.random() * unfound.length);
      return unfound[randomIndex];
    } catch (error) {
      console.error('Error getting random unfound word:', error);
      return null;
    }
  }
}
