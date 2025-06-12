
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

      // Check if selection forms a valid line (horizontal, vertical, or diagonal)
      if (!this.isValidLine(selectedCells)) {
        return { isValid: false };
      }

      // Get the word formed by selection (both forward and reverse)
      const forwardWord = this.getWordFromCells(selectedCells);
      const reverseWord = forwardWord.split('').reverse().join('');

      console.log('Validating selection:', { selectedCells, forwardWord, reverseWord });

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
    
    if (!isHorizontal && !isVertical && !isDiagonal) {
      return false;
    }
    
    // Verify all cells are in a straight line
    const expectedCells = this.generateLineCells(first, last);
    
    if (expectedCells.length !== cells.length) {
      return false;
    }
    
    // Check if all selected cells match the expected line
    const selectedCellIds = new Set(cells.map(cell => `${cell.row}-${cell.col}`));
    const expectedCellIds = new Set(expectedCells.map(cell => `${cell.row}-${cell.col}`));
    
    return selectedCellIds.size === expectedCellIds.size && 
           [...selectedCellIds].every(id => expectedCellIds.has(id));
  }

  private generateLineCells(start: Cell, end: Cell): Cell[] {
    const cells: Cell[] = [];
    const deltaRow = end.row - start.row;
    const deltaCol = end.col - start.col;
    
    const steps = Math.max(Math.abs(deltaRow), Math.abs(deltaCol));
    const stepRow = steps === 0 ? 0 : deltaRow / steps;
    const stepCol = steps === 0 ? 0 : deltaCol / steps;
    
    for (let i = 0; i <= steps; i++) {
      cells.push({
        row: start.row + Math.round(stepRow * i),
        col: start.col + Math.round(stepCol * i)
      });
    }
    
    return cells;
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

      // Check if selection matches word cells exactly (forward or backward)
      if (selectedCells.length === wordCells.length) {
        const selectedCellIds = selectedCells.map(cell => `${cell.row}-${cell.col}`).sort();
        const wordCellIds = wordCells.map(cell => `${cell.row}-${cell.col}`).sort();
        
        if (JSON.stringify(selectedCellIds) === JSON.stringify(wordCellIds)) {
          return true;
        }
      }

      // Also check if selection forms the word (forward or reverse)
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
