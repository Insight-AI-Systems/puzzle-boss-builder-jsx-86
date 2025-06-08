
import { CrosswordCell, CrosswordPuzzle, CrosswordWord } from '../types/crosswordTypes';
import { validateCrosswordPuzzle, logValidationResults } from './puzzleValidator';

export function generateGridFromPuzzle(puzzle: CrosswordPuzzle): CrosswordCell[][] {
  // Validate puzzle before generating grid
  const validationResult = validateCrosswordPuzzle(puzzle);
  logValidationResults(puzzle.id, validationResult);

  if (!validationResult.isValid) {
    console.error('Cannot generate grid from invalid puzzle data');
    // Return a minimal grid to prevent crashes
    return createEmptyGrid(puzzle.size);
  }

  const { size, words } = puzzle;
  const grid: CrosswordCell[][] = createEmptyGrid(size);

  // Place words in grid and unblock cells
  words.forEach(word => {
    const { startRow, startCol, direction, answer, number } = word;
    
    for (let i = 0; i < answer.length; i++) {
      const row = direction === 'down' ? startRow + i : startRow;
      const col = direction === 'across' ? startCol + i : startCol;
      
      // Ensure we don't go out of bounds
      if (row >= 0 && row < size && col >= 0 && col < size) {
        const cell = grid[row][col];
        cell.isBlocked = false;
        cell.correctLetter = answer[i];
        cell.belongsToWords.push(word.id);
        
        // Set number for first cell of word
        if (i === 0) {
          cell.number = number;
        }
      }
    }
  });

  // Generate cell IDs for words
  words.forEach(word => {
    const cells: string[] = [];
    for (let i = 0; i < word.answer.length; i++) {
      const row = word.direction === 'down' ? word.startRow + i : word.startRow;
      const col = word.direction === 'across' ? word.startCol + i : word.startCol;
      if (row < size && col < size) {
        cells.push(`${row}-${col}`);
      }
    }
    word.cells = cells;
  });

  return grid;
}

function createEmptyGrid(size: number): CrosswordCell[][] {
  const grid: CrosswordCell[][] = [];
  
  for (let row = 0; row < size; row++) {
    grid[row] = [];
    for (let col = 0; col < size; col++) {
      grid[row][col] = {
        id: `${row}-${col}`,
        row,
        col,
        letter: '',
        correctLetter: '',
        isBlocked: true,
        belongsToWords: [],
        isHighlighted: false,
        isSelected: false
      };
    }
  }
  
  return grid;
}

export function validateGridInput(
  grid: CrosswordCell[][],
  row: number,
  col: number,
  letter: string
): boolean {
  if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) {
    return false;
  }
  
  const cell = grid[row][col];
  if (cell.isBlocked) {
    return false;
  }
  
  // Only allow letters
  return /^[A-Za-z]$/.test(letter);
}

export function getWordCells(
  grid: CrosswordCell[][],
  word: CrosswordWord
): CrosswordCell[] {
  const cells: CrosswordCell[] = [];
  const { startRow, startCol, direction, answer } = word;
  
  for (let i = 0; i < answer.length; i++) {
    const row = direction === 'down' ? startRow + i : startRow;
    const col = direction === 'across' ? startCol + i : startCol;
    
    if (row < grid.length && col < grid[0].length) {
      cells.push(grid[row][col]);
    }
  }
  
  return cells;
}

export function isWordCompleted(
  grid: CrosswordCell[][],
  word: CrosswordWord
): boolean {
  const cells = getWordCells(grid, word);
  return cells.every(cell => 
    cell.letter.toUpperCase() === cell.correctLetter.toUpperCase()
  );
}

export function isPuzzleCompleted(
  grid: CrosswordCell[][],
  words: CrosswordWord[]
): boolean {
  return words.every(word => isWordCompleted(grid, word));
}
