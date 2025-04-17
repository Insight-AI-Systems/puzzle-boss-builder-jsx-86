
import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DifficultyLevel, PuzzleState } from '../types/puzzle-types';

export const usePuzzleState = (initialDifficulty: DifficultyLevel = '3x3') => {
  const { toast } = useToast();
  const [state, setState] = useState<PuzzleState>({
    isComplete: false,
    timeSpent: 0,
    correctPieces: 0,
    difficulty: initialDifficulty,
    moveCount: 0,
    isActive: false
  });
  
  const timerRef = useRef<number | null>(null);
  
  // Update timer when puzzle is active
  useEffect(() => {
    if (state.isActive && !state.isComplete) {
      timerRef.current = window.setInterval(() => {
        setState(prev => ({
          ...prev,
          timeSpent: prev.timeSpent + 1
        }));
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [state.isActive, state.isComplete]);
  
  // Start a new puzzle
  const startNewPuzzle = useCallback((difficulty: DifficultyLevel = state.difficulty) => {
    setState({
      isComplete: false,
      timeSpent: 0,
      correctPieces: 0,
      difficulty,
      moveCount: 0,
      isActive: true
    });
  }, [state.difficulty]);
  
  // Check if puzzle is complete
  const checkCompletion = useCallback((pieceCount: number, correctCount: number) => {
    if (correctCount === pieceCount && !state.isComplete) {
      setState(prev => ({ ...prev, isComplete: true, isActive: false }));
      toast({
        title: "Puzzle Completed!",
        description: `You completed the puzzle in ${state.moveCount} moves and ${formatTime(state.timeSpent)}.`,
        variant: "default",
      });
      return true;
    }
    return false;
  }, [state.isComplete, state.moveCount, state.timeSpent, toast]);
  
  // Update the correct pieces count
  const updateCorrectPieces = useCallback((count: number) => {
    setState(prev => ({ ...prev, correctPieces: count }));
  }, []);
  
  // Increment move count
  const incrementMoves = useCallback(() => {
    setState(prev => ({ ...prev, moveCount: prev.moveCount + 1 }));
  }, []);
  
  // Change difficulty
  const changeDifficulty = useCallback((difficulty: DifficultyLevel) => {
    setState(prev => ({ ...prev, difficulty }));
  }, []);
  
  // Pause the puzzle
  const togglePause = useCallback(() => {
    if (!state.isComplete) {
      setState(prev => ({ ...prev, isActive: !prev.isActive }));
    }
  }, [state.isComplete]);
  
  // Format time for display (mm:ss)
  const formattedTime = formatTime(state.timeSpent);
  
  return {
    ...state,
    formattedTime,
    startNewPuzzle,
    checkCompletion,
    updateCorrectPieces,
    incrementMoves,
    changeDifficulty,
    togglePause
  };
};

// Helper function to format time
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
