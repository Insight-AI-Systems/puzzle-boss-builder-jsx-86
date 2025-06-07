
import { PlacedWord } from './WordPlacementEngine';

export class WordSelectionValidator {
  private placedWords: PlacedWord[];
  private grid: string[][];

  constructor(placedWords: PlacedWord[], grid: string[][]) {
    this.placedWords = placedWords || [];
    this.grid = grid || [];
  }

  public validateSelection(selectedCells: string[]): {
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

  private getWordFromCells(selectedCells: string[]): string {
    try {
      if (!selectedCells || selectedCells.length === 0) {
        return '';
      }

      // Sort cells to form a proper word sequence
      const sortedCells = this.sortCellsInSequence(selectedCells);
      
      return sortedCells.map(cellId => {
        const [row, col] = cellId.split('-').map(Number);
        if (isNaN(row) || isNaN(col) || row < 0 || row >= this.grid.length || col < 0 || col >= this.grid[0]?.length) {
          return '';
        }
        return this.grid[row]?.[col] || '';
      }).join('');
    } catch (error) {
      console.error('Error getting word from cells:', error);
      return '';
    }
  }

  private sortCellsInSequence(cells: string[]): string[] {
    try {
      if (!cells || cells.length <= 1) return cells || [];

      // Convert to coordinates
      const coords = cells.map(cell => {
        const [row, col] = cell.split('-').map(Number);
        return { cellId: cell, row: isNaN(row) ? 0 : row, col: isNaN(col) ? 0 : col };
      });

      if (coords.length === 0) return [];

      // Determine direction and sort accordingly
      const first = coords[0];
      const last = coords[coords.length - 1];
      
      const deltaRow = last.row - first.row;
      const deltaCol = last.col - first.col;

      // Sort based on direction
      if (deltaRow === 0) {
        // Horizontal
        coords.sort((a, b) => a.col - b.col);
      } else if (deltaCol === 0) {
        // Vertical
        coords.sort((a, b) => a.row - b.row);
      } else if (deltaRow === deltaCol) {
        // Diagonal down-right
        coords.sort((a, b) => a.row - b.row);
      } else if (deltaRow === -deltaCol) {
        // Diagonal up-right
        coords.sort((a, b) => a.row - b.row);
      } else {
        // Try to sort by primary direction
        if (Math.abs(deltaRow) > Math.abs(deltaCol)) {
          coords.sort((a, b) => a.row - b.row);
        } else {
          coords.sort((a, b) => a.col - b.col);
        }
      }

      return coords.map(coord => coord.cellId);
    } catch (error) {
      console.error('Error sorting cells in sequence:', error);
      return cells || [];
    }
  }

  private isSelectionMatchingWord(selectedCells: string[], placedWord: PlacedWord): boolean {
    try {
      if (!selectedCells || !placedWord || !placedWord.cells || !placedWord.word) {
        return false;
      }

      const { cells: wordCells, word } = placedWord;

      // Check if selection matches word cells exactly
      if (selectedCells.length === wordCells.length) {
        const sortedSelected = [...selectedCells].sort();
        const sortedWordCells = [...wordCells].sort();
        
        if (JSON.stringify(sortedSelected) === JSON.stringify(sortedWordCells)) {
          return true;
        }
      }

      // Check if selection is a subset that forms the word
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
      return unfound[randomIndex] || null;
    } catch (error) {
      console.error('Error getting random unfound word:', error);
      return null;
    }
  }
}
