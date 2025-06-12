
import { useState, useCallback, useEffect } from 'react';
import { SudokuDifficulty, SudokuSize, SudokuGrid, SudokuMove } from '../types/sudokuTypes';
import { generateSudoku, solveSudoku, isValidMove, hasConflicts } from '../utils/sudokuEngine';

export function useSudokuGame(difficulty: SudokuDifficulty, size: SudokuSize) {
  const [grid, setGrid] = useState<SudokuGrid | null>(null);
  const [initialGrid, setInitialGrid] = useState<SudokuGrid | null>(null);
  const [solution, setSolution] = useState<SudokuGrid | null>(null);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [conflicts, setConflicts] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [undoStack, setUndoStack] = useState<SudokuMove[]>([]);
  const [redoStack, setRedoStack] = useState<SudokuMove[]>([]);

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Difficulty settings
  const difficultyConfig = {
    easy: { 4: { maxHints: 5, fillPercentage: 0.6 }, 6: { maxHints: 8, fillPercentage: 0.5 }, 9: { maxHints: 10, fillPercentage: 0.4 } },
    medium: { 4: { maxHints: 3, fillPercentage: 0.5 }, 6: { maxHints: 5, fillPercentage: 0.4 }, 9: { maxHints: 7, fillPercentage: 0.3 } },
    hard: { 4: { maxHints: 2, fillPercentage: 0.4 }, 6: { maxHints: 3, fillPercentage: 0.3 }, 9: { maxHints: 5, fillPercentage: 0.25 } },
    expert: { 4: { maxHints: 1, fillPercentage: 0.3 }, 6: { maxHints: 2, fillPercentage: 0.25 }, 9: { maxHints: 3, fillPercentage: 0.2 } }
  };

  const maxHints = difficultyConfig[difficulty][size].maxHints;

  const generateNewPuzzle = useCallback(() => {
    const { puzzle, solution: puzzleSolution } = generateSudoku(size, difficulty);
    setGrid([...puzzle.map(row => [...row])]);
    setInitialGrid([...puzzle.map(row => [...row])]);
    setSolution([...puzzleSolution.map(row => [...row])]);
    setSelectedCell(null);
    setSelectedNumber(null);
    setConflicts(new Set());
    setMoves(0);
    setHintsUsed(0);
    setTimeElapsed(0);
    setUndoStack([]);
    setRedoStack([]);
  }, [size, difficulty]);

  // Generate initial puzzle
  useEffect(() => {
    generateNewPuzzle();
  }, [generateNewPuzzle]);

  const updateConflicts = useCallback((newGrid: SudokuGrid) => {
    const newConflicts = new Set<string>();
    
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (newGrid[row][col] !== 0 && hasConflicts(newGrid, row, col, size)) {
          newConflicts.add(`${row}-${col}`);
        }
      }
    }
    
    setConflicts(newConflicts);
  }, [size]);

  const makeMove = useCallback((row: number, col: number, number: number) => {
    if (!grid || !initialGrid) return;
    
    const oldValue = grid[row][col];
    const newGrid = grid.map((r, rowIndex) => 
      r.map((cell, colIndex) => 
        rowIndex === row && colIndex === col ? number : cell
      )
    );
    
    // Add to undo stack
    const move: SudokuMove = {
      row,
      col,
      oldValue,
      newValue: number,
      timestamp: Date.now()
    };
    
    setUndoStack(prev => [...prev, move]);
    setRedoStack([]); // Clear redo stack on new move
    setGrid(newGrid);
    setMoves(prev => prev + 1);
    
    // Check for conflicts
    updateConflicts(newGrid);
  }, [grid, initialGrid, updateConflicts]);

  const getHint = useCallback(() => {
    if (!grid || !solution || hintsUsed >= maxHints) return;
    
    // Find empty cells
    const emptyCells: [number, number][] = [];
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (grid[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }
    
    if (emptyCells.length === 0) return;
    
    // Randomly select an empty cell and fill it with the solution
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [row, col] = emptyCells[randomIndex];
    const correctNumber = solution[row][col];
    
    makeMove(row, col, correctNumber);
    setHintsUsed(prev => prev + 1);
  }, [grid, solution, hintsUsed, maxHints, size, makeMove]);

  const undo = useCallback(() => {
    if (undoStack.length === 0 || !grid) return;
    
    const lastMove = undoStack[undoStack.length - 1];
    const newGrid = grid.map((r, rowIndex) => 
      r.map((cell, colIndex) => 
        rowIndex === lastMove.row && colIndex === lastMove.col ? lastMove.oldValue : cell
      )
    );
    
    setGrid(newGrid);
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, lastMove]);
    setMoves(prev => prev + 1);
    updateConflicts(newGrid);
  }, [undoStack, grid, updateConflicts]);

  const redo = useCallback(() => {
    if (redoStack.length === 0 || !grid) return;
    
    const moveToRedo = redoStack[redoStack.length - 1];
    const newGrid = grid.map((r, rowIndex) => 
      r.map((cell, colIndex) => 
        rowIndex === moveToRedo.row && colIndex === moveToRedo.col ? moveToRedo.newValue : cell
      )
    );
    
    setGrid(newGrid);
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, moveToRedo]);
    setMoves(prev => prev + 1);
    updateConflicts(newGrid);
  }, [redoStack, grid, updateConflicts]);

  const resetGame = useCallback(() => {
    if (!initialGrid) return;
    
    setGrid([...initialGrid.map(row => [...row])]);
    setSelectedCell(null);
    setSelectedNumber(null);
    setConflicts(new Set());
    setMoves(0);
    setHintsUsed(0);
    setTimeElapsed(0);
    setUndoStack([]);
    setRedoStack([]);
  }, [initialGrid]);

  const newGame = useCallback(() => {
    generateNewPuzzle();
  }, [generateNewPuzzle]);

  const checkSolution = useCallback(() => {
    if (!grid || !solution) return false;
    
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (grid[row][col] !== solution[row][col]) {
          return false;
        }
      }
    }
    return true;
  }, [grid, solution, size]);

  const isComplete = grid && checkSolution() && conflicts.size === 0;

  // Computed properties
  const canUndo = undoStack.length > 0;
  const canRedo = redoStack.length > 0;

  return {
    grid,
    initialGrid,
    selectedCell,
    selectedNumber,
    conflicts,
    moves,
    hintsUsed,
    timeElapsed,
    isComplete: Boolean(isComplete),
    canUndo,
    canRedo,
    maxHints,
    setSelectedCell,
    setSelectedNumber,
    makeMove,
    undo,
    redo,
    getHint,
    resetGame,
    newGame
  };
}
