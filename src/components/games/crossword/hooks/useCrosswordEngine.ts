
import { useState, useEffect, useCallback } from 'react';
import { CrosswordEngine } from '@/business/engines/crossword/CrosswordEngine';
import { useGameContext } from '@/shared/contexts';
import type { CrosswordState } from '@/business/engines/crossword/CrosswordEngine';
import type { GameConfig } from '@/business/models/GameState';
import { useCrosswordPuzzleData } from './useCrosswordPuzzleData';
import { useGamePersistence } from '../../hooks/useGamePersistence';
import { useLeaderboardSubmission } from '../../hooks/useLeaderboardSubmission';

export interface CrosswordGameState {
  grid: any[][];
  clues: { across: any[]; down: any[] };
  selectedCell: { row: number; col: number } | null;
  selectedDirection: 'across' | 'down';
  selectedWord: string | null;
  isComplete: boolean;
  score: number;
  hintsUsed: number;
}

export function useCrosswordEngine(gameId: string = 'crossword-1') {
  const { updateGameState, startGame } = useGameContext();
  const { puzzle, isLoading: puzzleLoading, error: puzzleError } = useCrosswordPuzzleData();
  const { saveGameState, loadGameState } = useGamePersistence(gameId, 'crossword');
  const { submitScore } = useLeaderboardSubmission();
  
  // Create initial state for CrosswordEngine
  const initialState: CrosswordState = {
    puzzle: null,
    progress: null,
    selectedCell: null,
    selectedWord: null,
    selectedDirection: 'across',
    showHints: false,
    isPaused: false,
    gameStatus: 'loading',
    id: gameId,
    status: 'idle',
    score: 0,
    moves: 0,
    startTime: null,
    endTime: null,
    isComplete: false,
    error: null
  };

  const gameConfig: GameConfig = { 
    gameType: 'crossword',
    hasTimer: true,
    hasScore: true,
    hasMoves: true,
    difficulty: 'pro', 
    enableHints: true 
  };

  const [engine, setEngine] = useState<CrosswordEngine | null>(null);
  const [localGameState, setLocalGameState] = useState<CrosswordGameState>({
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
    const initializeGame = async () => {
      console.log('Initializing crossword game...', { puzzle, puzzleLoading, puzzleError });
      
      if (puzzleLoading) return;
      
      if (puzzleError) {
        setError(puzzleError);
        setIsLoading(false);
        return;
      }
      
      if (!puzzle) {
        setError('No puzzle data available');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log('Creating crossword engine with puzzle:', puzzle);
        
        // Create initial state with real puzzle data
        const initialStateWithPuzzle: CrosswordState = {
          ...initialState,
          puzzle,
          progress: {
            completedWords: [],
            userInput: {},
            incorrectAttempts: 0
          },
          gameStatus: 'ready'
        };

        const crosswordEngine = new CrosswordEngine(initialStateWithPuzzle, gameConfig);
        await crosswordEngine.initialize();
        
        setEngine(crosswordEngine);
        
        // Set game state from puzzle
        setLocalGameState({
          grid: puzzle.grid,
          clues: puzzle.clues,
          selectedCell: null,
          selectedDirection: 'across',
          selectedWord: null,
          isComplete: false,
          score: 0,
          hintsUsed: 0
        });
        
        // Try to load saved progress
        try {
          const savedState = await loadGameState();
          if (savedState) {
            console.log('Loaded saved state:', savedState);
            setLocalGameState(savedState);
          }
        } catch (saveError) {
          console.warn('Could not load saved state:', saveError);
        }
        
        startGame(gameId, 'pro');
        console.log('Crossword game initialized successfully');
        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing crossword:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize crossword');
        setIsLoading(false);
      }
    };

    initializeGame();
  }, [puzzle, puzzleLoading, puzzleError, gameId, startGame]);

  // Auto-save game state
  useEffect(() => {
    if (engine && localGameState && !isLoading) {
      saveGameState(localGameState);
    }
  }, [localGameState, engine, saveGameState, isLoading]);

  const handleGameComplete = useCallback(async () => {
    if (!engine) return;
    
    const finalScore = engine.calculateScore();
    const completionTime = Date.now() - (engine.getState().startTime || Date.now());
    
    // Submit to leaderboard
    try {
      await submitScore({
        gameId,
        gameType: 'crossword',
        score: finalScore,
        completionTime: completionTime / 1000, // Convert to seconds
        difficulty: gameConfig.difficulty
      });
    } catch (err) {
      console.error('Error submitting score:', err);
    }
    
    setLocalGameState(prev => ({ ...prev, isComplete: true, score: finalScore }));
  }, [engine, gameId, gameConfig.difficulty, submitScore]);

  const handleCellClick = (row: number, col: number) => {
    try {
      console.log('Cell clicked:', row, col);
      setLocalGameState(prev => ({
        ...prev,
        selectedCell: { row, col }
      }));
    } catch (err) {
      console.error('Error selecting cell:', err);
    }
  };

  const handleLetterInput = useCallback((letter: string) => {
    try {
      if (!engine || !localGameState.selectedCell) return;
      
      console.log('Letter input:', letter, 'at cell:', localGameState.selectedCell);
      
      engine.makeMove({
        type: 'ENTER_LETTER',
        row: localGameState.selectedCell.row,
        col: localGameState.selectedCell.col,
        letter
      });
      
      const newState = engine.getState();
      if (newState.puzzle) {
        setLocalGameState(prev => ({
          ...prev,
          grid: newState.puzzle!.grid,
          score: newState.score
        }));
        
        updateGameState(gameId, { score: newState.score });
        
        // Check for completion
        const winResult = engine.checkWinCondition();
        if (winResult.isWin) {
          handleGameComplete();
        }
      }
    } catch (err) {
      console.error('Error inputting letter:', err);
    }
  }, [engine, localGameState.selectedCell, gameId, updateGameState, handleGameComplete]);

  // Loading state
  if (puzzleLoading || isLoading) {
    console.log('Crossword engine in loading state:', { puzzleLoading, isLoading });
    return {
      gameState: localGameState,
      isLoading: true,
      error: '',
      handleCellClick: () => {},
      handleLetterInput: () => {},
      handleToggleDirection: () => {},
      handleTogglePause: () => {},
      handleReset: () => {},
      handleGetHint: () => {}
    };
  }

  // Error state
  if (error || puzzleError) {
    console.error('Crossword engine in error state:', { error, puzzleError });
    return {
      gameState: localGameState,
      isLoading: false,
      error: error || puzzleError || 'Unknown error',
      handleCellClick: () => {},
      handleLetterInput: () => {},
      handleToggleDirection: () => {},
      handleTogglePause: () => {},
      handleReset: () => {},
      handleGetHint: () => {}
    };
  }

  console.log('Crossword engine ready:', { localGameState, engine: !!engine });

  return {
    gameState: localGameState,
    isLoading: false,
    error: '',
    handleCellClick,
    handleLetterInput,
    handleToggleDirection: () => {
      setLocalGameState(prev => ({
        ...prev,
        selectedDirection: prev.selectedDirection === 'across' ? 'down' : 'across'
      }));
    },
    handleTogglePause: () => {
      console.log('Toggle pause');
    },
    handleReset: () => {
      try {
        console.log('Resetting crossword game');
        setLocalGameState(prev => ({
          ...prev,
          grid: puzzle?.grid || [],
          score: 0,
          hintsUsed: 0,
          isComplete: false,
          selectedCell: null
        }));
        updateGameState(gameId, { score: 0, isComplete: false });
      } catch (err) {
        console.error('Error resetting game:', err);
      }
    },
    handleGetHint: () => {
      try {
        console.log('Getting hint');
        setLocalGameState(prev => ({
          ...prev,
          hintsUsed: prev.hintsUsed + 1
        }));
      } catch (err) {
        console.error('Error getting hint:', err);
      }
    }
  };
}
