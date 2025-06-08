
import { useState, useEffect } from 'react';
import { CrosswordEngine } from '@/business/engines/crossword/CrosswordEngine';
import { GameError } from '@/infrastructure/errors';

export interface CrosswordState {
  grid: any[][];
  clues: { across: any[]; down: any[] };
  selectedCell: { row: number; col: number } | null;
  selectedDirection: 'across' | 'down';
  selectedWord: string | null;
  isComplete: boolean;
  score: number;
  hintsUsed: number;
}

export function useCrosswordEngine() {
  const [engine] = useState(() => new CrosswordEngine());
  const [gameState, setGameState] = useState<CrosswordState>({
    grid: [],
    clues: { across: [], down: [] },
    selectedCell: null,
    selectedDirection: 'across',
    selectedWord: null,
    isComplete: false,
    score: 0,
    hintsUsed: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      // Initialize with mock data since engine methods don't exist yet
      setGameState({
        grid: Array(10).fill(null).map(() => Array(10).fill({ letter: '', isBlocked: false })),
        clues: { 
          across: [{ id: '1', number: 1, clue: 'Sample clue', answer: 'WORD' }], 
          down: [{ id: '2', number: 1, clue: 'Sample down clue', answer: 'TEST' }] 
        },
        selectedCell: null,
        selectedDirection: 'across',
        selectedWord: null,
        isComplete: false,
        score: 0,
        hintsUsed: 0
      });
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize crossword');
      setIsLoading(false);
    }
  }, []);

  const handleCellClick = (row: number, col: number) => {
    try {
      setGameState(prev => ({
        ...prev,
        selectedCell: { row, col }
      }));
    } catch (err) {
      console.error('Error selecting cell:', err);
    }
  };

  const handleLetterInput = (letter: string) => {
    try {
      // Mock implementation - update grid
      setGameState(prev => {
        if (!prev.selectedCell) return prev;
        
        const newGrid = [...prev.grid];
        newGrid[prev.selectedCell.row][prev.selectedCell.col] = {
          ...newGrid[prev.selectedCell.row][prev.selectedCell.col],
          letter: letter.toUpperCase()
        };
        
        return {
          ...prev,
          grid: newGrid,
          score: prev.score + 10
        };
      });
    } catch (err) {
      console.error('Error inputting letter:', err);
    }
  };

  const handleToggleDirection = () => {
    setGameState(prev => ({
      ...prev,
      selectedDirection: prev.selectedDirection === 'across' ? 'down' : 'across'
    }));
  };

  const handleTogglePause = () => {
    // Mock implementation
    console.log('Toggle pause');
  };

  const handleReset = () => {
    try {
      setGameState(prev => ({
        ...prev,
        grid: Array(10).fill(null).map(() => Array(10).fill({ letter: '', isBlocked: false })),
        score: 0,
        hintsUsed: 0,
        isComplete: false
      }));
    } catch (err) {
      console.error('Error resetting game:', err);
    }
  };

  const handleGetHint = () => {
    try {
      setGameState(prev => ({
        ...prev,
        hintsUsed: prev.hintsUsed + 1
      }));
    } catch (err) {
      console.error('Error getting hint:', err);
    }
  };

  return {
    gameState,
    isLoading,
    error,
    handleCellClick,
    handleLetterInput,
    handleToggleDirection,
    handleTogglePause,
    handleReset,
    handleGetHint
  };
}
