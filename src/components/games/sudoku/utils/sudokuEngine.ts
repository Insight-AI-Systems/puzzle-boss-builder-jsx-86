
import { SudokuDifficulty, SudokuSize, SudokuGrid } from '../types/sudokuTypes';

// Generate a valid Sudoku puzzle
export function generateSudoku(size: SudokuSize, difficulty: SudokuDifficulty): { puzzle: SudokuGrid; solution: SudokuGrid } {
  // Create a complete valid grid
  const solution = generateCompleteGrid(size);
  
  // Remove numbers based on difficulty
  const puzzle = createPuzzle(solution, size, difficulty);
  
  return { puzzle, solution };
}

// Generate a complete valid Sudoku grid
function generateCompleteGrid(size: SudokuSize): SudokuGrid {
  const grid: SudokuGrid = Array(size).fill(null).map(() => Array(size).fill(0));
  
  fillGrid(grid, size);
  return grid;
}

// Fill grid using backtracking
function fillGrid(grid: SudokuGrid, size: SudokuSize): boolean {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col] === 0) {
        const numbers = shuffleArray([...Array(size).keys()].map(i => i + 1));
        
        for (const num of numbers) {
          if (isValidMove(grid, row, col, num, size)) {
            grid[row][col] = num;
            
            if (fillGrid(grid, size)) {
              return true;
            }
            
            grid[row][col] = 0;
          }
        }
        
        return false;
      }
    }
  }
  return true;
}

// Create puzzle by removing numbers from complete grid
function createPuzzle(solution: SudokuGrid, size: SudokuSize, difficulty: SudokuDifficulty): SudokuGrid {
  const puzzle = solution.map(row => [...row]);
  
  const fillPercentages = {
    easy: { 4: 0.6, 6: 0.5, 9: 0.4 },
    medium: { 4: 0.5, 6: 0.4, 9: 0.3 },
    hard: { 4: 0.4, 6: 0.3, 9: 0.25 },
    expert: { 4: 0.3, 6: 0.25, 9: 0.2 }
  };
  
  const fillPercentage = fillPercentages[difficulty][size];
  const totalCells = size * size;
  const cellsToKeep = Math.floor(totalCells * fillPercentage);
  const cellsToRemove = totalCells - cellsToKeep;
  
  // Create list of all cell positions
  const positions: [number, number][] = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      positions.push([row, col]);
    }
  }
  
  // Randomly remove cells
  const shuffledPositions = shuffleArray(positions);
  for (let i = 0; i < cellsToRemove; i++) {
    const [row, col] = shuffledPositions[i];
    puzzle[row][col] = 0;
  }
  
  return puzzle;
}

// Check if a move is valid
export function isValidMove(grid: SudokuGrid, row: number, col: number, num: number, size: SudokuSize): boolean {
  // Check row
  for (let c = 0; c < size; c++) {
    if (c !== col && grid[row][c] === num) {
      return false;
    }
  }
  
  // Check column
  for (let r = 0; r < size; r++) {
    if (r !== row && grid[r][col] === num) {
      return false;
    }
  }
  
  // Check box
  const boxSize = getBoxSize(size);
  const boxRow = Math.floor(row / boxSize.height) * boxSize.height;
  const boxCol = Math.floor(col / boxSize.width) * boxSize.width;
  
  for (let r = boxRow; r < boxRow + boxSize.height; r++) {
    for (let c = boxCol; c < boxCol + boxSize.width; c++) {
      if ((r !== row || c !== col) && grid[r][c] === num) {
        return false;
      }
    }
  }
  
  return true;
}

// Check if a cell has conflicts
export function hasConflicts(grid: SudokuGrid, row: number, col: number, size: SudokuSize): boolean {
  const num = grid[row][col];
  if (num === 0) return false;
  
  return !isValidMove(grid, row, col, num, size);
}

// Solve Sudoku using backtracking
export function solveSudoku(grid: SudokuGrid, size: SudokuSize): SudokuGrid | null {
  const solution = grid.map(row => [...row]);
  
  if (solveSudokuRecursive(solution, size)) {
    return solution;
  }
  
  return null;
}

function solveSudokuRecursive(grid: SudokuGrid, size: SudokuSize): boolean {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col] === 0) {
        for (let num = 1; num <= size; num++) {
          if (isValidMove(grid, row, col, num, size)) {
            grid[row][col] = num;
            
            if (solveSudokuRecursive(grid, size)) {
              return true;
            }
            
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

// Get box dimensions for different grid sizes
function getBoxSize(size: SudokuSize): { width: number; height: number } {
  switch (size) {
    case 4:
      return { width: 2, height: 2 };
    case 6:
      return { width: 3, height: 2 };
    case 9:
      return { width: 3, height: 3 };
    default:
      return { width: 3, height: 3 };
  }
}

// Utility function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
