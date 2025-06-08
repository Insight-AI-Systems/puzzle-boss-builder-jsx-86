
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { CrosswordGameState, CrosswordPuzzle, CrosswordProgress } from '../types/crosswordTypes';
import { generateGridFromPuzzle, validateGridInput, isWordCompleted, isPuzzleCompleted } from '../utils/gridGenerator';
import { getTodaysPuzzle, getPuzzleById } from '../data/puzzleData';

const STORAGE_KEY = 'crossword_progress';

export function useCrosswordGame() {
  const [gameState, setGameState] = useState<CrosswordGameState>({
    puzzle: null,
    progress: null,
    selectedCell: null,
    selectedWord: null,
    selectedDirection: 'across',
    showHints: false,
    isPaused: false,
    gameStatus: 'loading'
  });

  const loadPuzzle = useCallback((puzzleId?: string) => {
    try {
      const puzzle = puzzleId ? getPuzzleById(puzzleId) : getTodaysPuzzle();
      
      if (!puzzle) {
        setGameState(prev => ({ ...prev, gameStatus: 'error' }));
        toast.error('Puzzle not found');
        return;
      }

      const grid = generateGridFromPuzzle(puzzle);
      puzzle.grid = grid;

      // Check for saved progress
      const savedProgress = localStorage.getItem(`${STORAGE_KEY}_${puzzle.id}`);
      let progress: CrosswordProgress;

      if (savedProgress) {
        progress = JSON.parse(savedProgress);
        // Restore grid state from saved progress
        progress.grid.forEach((row, rowIndex) => {
          row.forEach((letter, colIndex) => {
            if (grid[rowIndex] && grid[rowIndex][colIndex]) {
              grid[rowIndex][colIndex].letter = letter;
            }
          });
        });
      } else {
        progress = {
          puzzleId: puzzle.id,
          startTime: Date.now(),
          currentTime: Date.now(),
          hintsUsed: 0,
          isCompleted: false,
          grid: grid.map(row => row.map(cell => cell.letter)),
          completedWords: []
        };
      }

      setGameState({
        puzzle,
        progress,
        selectedCell: null,
        selectedWord: null,
        selectedDirection: 'across',
        showHints: false,
        isPaused: false,
        gameStatus: 'playing'
      });

      toast.success('Puzzle loaded successfully!');
    } catch (error) {
      console.error('Error loading puzzle:', error);
      setGameState(prev => ({ ...prev, gameStatus: 'error' }));
      toast.error('Failed to load puzzle');
    }
  }, []);

  const selectCell = useCallback((row: number, col: number) => {
    setGameState(prev => {
      if (!prev.puzzle) return prev;

      const newGrid = prev.puzzle.grid.map(gridRow => 
        gridRow.map(cell => ({
          ...cell,
          isSelected: cell.row === row && cell.col === col,
          isHighlighted: false
        }))
      );

      // Find words that contain this cell
      const cell = newGrid[row][col];
      if (cell.isBlocked) return prev;

      const containingWords = prev.puzzle.words.filter(word => 
        cell.belongsToWords.includes(word.id)
      );

      // Determine selected word based on direction preference
      let selectedWord = containingWords.find(word => 
        word.direction === prev.selectedDirection
      ) || containingWords[0];

      // Highlight the selected word
      if (selectedWord) {
        const { startRow, startCol, direction, answer } = selectedWord;
        for (let i = 0; i < answer.length; i++) {
          const wordRow = direction === 'down' ? startRow + i : startRow;
          const wordCol = direction === 'across' ? startCol + i : startCol;
          if (newGrid[wordRow] && newGrid[wordRow][wordCol]) {
            newGrid[wordRow][wordCol].isHighlighted = true;
          }
        }
      }

      return {
        ...prev,
        puzzle: { ...prev.puzzle, grid: newGrid },
        selectedCell: { row, col },
        selectedWord: selectedWord?.id || null,
        selectedDirection: selectedWord?.direction || prev.selectedDirection
      };
    });
  }, []);

  const inputLetter = useCallback((letter: string) => {
    setGameState(prev => {
      if (!prev.puzzle || !prev.progress || !prev.selectedCell) return prev;

      const { row, col } = prev.selectedCell;
      
      if (!validateGridInput(prev.puzzle.grid, row, col, letter)) {
        return prev;
      }

      const newGrid = prev.puzzle.grid.map((gridRow, rowIndex) =>
        gridRow.map((cell, colIndex) => {
          if (rowIndex === row && colIndex === col) {
            return { ...cell, letter: letter.toUpperCase() };
          }
          return cell;
        })
      );

      // Update progress
      const newProgress: CrosswordProgress = {
        ...prev.progress,
        currentTime: Date.now(),
        grid: newGrid.map(gridRow => gridRow.map(cell => cell.letter))
      };

      // Check for completed words
      const completedWords: string[] = [];
      prev.puzzle.words.forEach(word => {
        if (isWordCompleted(newGrid, word)) {
          completedWords.push(word.id);
          if (!prev.progress!.completedWords.includes(word.id)) {
            toast.success(`Completed: ${word.answer}!`);
          }
        }
      });
      newProgress.completedWords = completedWords;

      // Check if puzzle is completed
      if (isPuzzleCompleted(newGrid, prev.puzzle.words)) {
        newProgress.isCompleted = true;
        toast.success('Congratulations! Puzzle completed!');
      }

      // Save progress
      localStorage.setItem(
        `${STORAGE_KEY}_${prev.puzzle.id}`,
        JSON.stringify(newProgress)
      );

      // Move to next cell if in a word
      let nextCell = prev.selectedCell;
      if (prev.selectedWord) {
        const word = prev.puzzle.words.find(w => w.id === prev.selectedWord);
        if (word) {
          const currentIndex = word.cells.findIndex(cellId => cellId === `${row}-${col}`);
          if (currentIndex >= 0 && currentIndex < word.cells.length - 1) {
            const nextCellId = word.cells[currentIndex + 1];
            const [nextRow, nextCol] = nextCellId.split('-').map(Number);
            nextCell = { row: nextRow, col: nextCol };
          }
        }
      }

      return {
        ...prev,
        puzzle: { ...prev.puzzle, grid: newGrid },
        progress: newProgress,
        selectedCell: nextCell,
        gameStatus: newProgress.isCompleted ? 'completed' : 'playing'
      };
    });
  }, []);

  const toggleDirection = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      selectedDirection: prev.selectedDirection === 'across' ? 'down' : 'across'
    }));
  }, []);

  const getHint = useCallback(() => {
    setGameState(prev => {
      if (!prev.puzzle || !prev.progress || !prev.selectedCell) return prev;

      const { row, col } = prev.selectedCell;
      const cell = prev.puzzle.grid[row][col];
      
      if (cell.isBlocked || cell.letter === cell.correctLetter) {
        return prev;
      }

      const newGrid = prev.puzzle.grid.map((gridRow, rowIndex) =>
        gridRow.map((gridCell, colIndex) => {
          if (rowIndex === row && colIndex === col) {
            return { ...gridCell, letter: gridCell.correctLetter };
          }
          return gridCell;
        })
      );

      const newProgress: CrosswordProgress = {
        ...prev.progress,
        hintsUsed: prev.progress.hintsUsed + 1,
        grid: newGrid.map(gridRow => gridRow.map(cell => cell.letter))
      };

      // Save progress
      localStorage.setItem(
        `${STORAGE_KEY}_${prev.puzzle.id}`,
        JSON.stringify(newProgress)
      );

      toast.info('Hint used!');

      return {
        ...prev,
        puzzle: { ...prev.puzzle, grid: newGrid },
        progress: newProgress
      };
    });
  }, []);

  const savePuzzle = useCallback(() => {
    if (gameState.puzzle && gameState.progress) {
      localStorage.setItem(
        `${STORAGE_KEY}_${gameState.puzzle.id}`,
        JSON.stringify(gameState.progress)
      );
      toast.success('Progress saved!');
    }
  }, [gameState.puzzle, gameState.progress]);

  const resetPuzzle = useCallback(() => {
    if (gameState.puzzle) {
      localStorage.removeItem(`${STORAGE_KEY}_${gameState.puzzle.id}`);
      loadPuzzle(gameState.puzzle.id);
    }
  }, [gameState.puzzle, loadPuzzle]);

  const togglePause = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPaused: !prev.isPaused
    }));
  }, []);

  // Load today's puzzle on component mount
  useEffect(() => {
    loadPuzzle();
  }, [loadPuzzle]);

  return {
    gameState,
    loadPuzzle,
    selectCell,
    inputLetter,
    toggleDirection,
    getHint,
    savePuzzle,
    resetPuzzle,
    togglePause
  };
}
