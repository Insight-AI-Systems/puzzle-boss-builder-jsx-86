
import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DifficultyLevel, PuzzleState, GameMode } from '@/components/puzzles/types/puzzle-types';

export const usePuzzleState = (
  initialDifficulty: DifficultyLevel = '3x3',
  initialGameMode: GameMode = 'classic',
  initialTimeLimit: number = 300
) => {
  const { toast } = useToast();
  const [state, setState] = useState<PuzzleState>({
    isComplete: false,
    timeSpent: 0,
    correctPieces: 0,
    difficulty: initialDifficulty,
    moveCount: 0,
    isActive: false,
    gameMode: initialGameMode,
    timeLimit: initialTimeLimit
  });
  
  const timerRef = useRef<number | null>(null);
  
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
  
  const startNewPuzzle = useCallback(
    (
      difficulty: DifficultyLevel = state.difficulty,
      gameMode: GameMode = state.gameMode || 'classic',
      timeLimit: number = state.timeLimit || 300
    ) => {
      setState({
        isComplete: false,
        timeSpent: 0,
        correctPieces: 0,
        difficulty,
        moveCount: 0,
        isActive: true,
        gameMode,
        timeLimit
      });
    }, 
    [state.difficulty, state.gameMode, state.timeLimit]
  );
  
  const checkCompletion = useCallback((pieceCount: number, correctCount: number) => {
    if (correctCount === pieceCount && !state.isComplete) {
      setState(prev => ({ ...prev, isComplete: true, isActive: false }));
      
      let message = `You completed the puzzle in ${state.moveCount} moves and ${formatTime(state.timeSpent)}.`;
      
      if (state.gameMode === 'timed') {
        const timeLeft = (state.timeLimit || 300) - state.timeSpent;
        message += ` You had ${formatTime(timeLeft)} left on the clock.`;
      }
      
      toast({
        title: "Puzzle Completed!",
        description: message,
        variant: "default",
      });
      return true;
    }
    return false;
  }, [state.isComplete, state.moveCount, state.timeSpent, state.gameMode, state.timeLimit, toast]);

  const updateCorrectPieces = useCallback((count: number) => {
    setState(prev => ({ ...prev, correctPieces: count }));
  }, []);
  
  const incrementMoves = useCallback(() => {
    setState(prev => ({ ...prev, moveCount: prev.moveCount + 1 }));
  }, []);
  
  const changeDifficulty = useCallback((difficulty: DifficultyLevel) => {
    setState(prev => ({ ...prev, difficulty }));
  }, []);
  
  const togglePause = useCallback(() => {
    if (!state.isComplete) {
      setState(prev => ({ ...prev, isActive: !prev.isActive }));
    }
  }, [state.isComplete]);
  
  const loadState = useCallback(
    (
      savedTimeSpent: number, 
      savedGameMode?: GameMode, 
      savedTimeLimit?: number
    ) => {
      setState(prev => ({
        ...prev,
        timeSpent: savedTimeSpent,
        isActive: true,
        gameMode: savedGameMode || prev.gameMode,
        timeLimit: savedTimeLimit || prev.timeLimit
      }));
    }, 
    []
  );

  const formattedTime = formatTime(state.timeSpent);
  
  return {
    ...state,
    formattedTime,
    startNewPuzzle,
    checkCompletion,
    updateCorrectPieces,
    incrementMoves,
    changeDifficulty,
    togglePause,
    loadState
  };
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
