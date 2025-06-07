
import { PlacedWord } from './WordPlacementEngine';

export class WordSelectionValidator {
  private placedWords: PlacedWord[];
  private grid: string[][];

  constructor(placedWords: PlacedWord[], grid: string[][]) {
    this.placedWords = placedWords;
    this.grid = grid;
  }

  public validateSelection(selectedCells: string[]): {
    isValid: boolean;
    word?: string;
    foundWord?: PlacedWord;
  } {
    if (selectedCells.length < 2) {
      return { isValid: false };
    }

    // Get the word formed by selection
    const selectedWord = this.getWordFromCells(selectedCells);
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
  }

  private getWordFromCells(selectedCells: string[]): string {
    // Sort cells to form a proper word sequence
    const sortedCells = this.sortCellsInSequence(selectedCells);
    
    return sortedCells.map(cellId => {
      const [row, col] = cellId.split('-').map(Number);
      return this.grid[row][col];
    }).join('');
  }

  private sortCellsInSequence(cells: string[]): string[] {
    if (cells.length <= 1) return cells;

    // Convert to coordinates
    const coords = cells.map(cell => {
      const [row, col] = cell.split('-').map(Number);
      return { cellId: cell, row, col };
    });

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
  }

  private isSelectionMatchingWord(selectedCells: string[], placedWord: PlacedWord): boolean {
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
  }

  public getUnfoundWords(foundWords: Set<string>): PlacedWord[] {
    return this.placedWords.filter(placedWord => !foundWords.has(placedWord.word));
  }

  public getRandomUnfoundWord(foundWords: Set<string>): PlacedWord | null {
    const unfound = this.getUnfoundWords(foundWords);
    if (unfound.length === 0) return null;
    
    return unfound[Math.floor(Math.random() * unfound.length)];
  }
}
