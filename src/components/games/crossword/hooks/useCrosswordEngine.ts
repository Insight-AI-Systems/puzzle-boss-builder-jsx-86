import { useState, useEffect, useCallback } from 'react';
import { CrosswordEngine } from '@/business/engines/crossword/CrosswordEngine';
import { GameError } from '@/infrastructure/errors';
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
  const { currentGame, updateGameState, startGame } = useGameContext();
  const { puzzle, isLoading: puzzleLoading } = useCrosswordPuzzleData();
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
    difficulty: 'medium', 
    enableHints: true 
  };

  const [engine, setEngine] = useState<CrosswordEngine | null>(null);
  const [gameState, setGameState] = useState<CrosswordGameState>({
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
      if (!puzzle) return;

      try {
        setIsLoading(true);
        
        // Create initial state with real puzzle data
        const initialStateWithPuzzle: CrosswordState = {
          ...initialState,
          puzzle,
          progress: {
            puzzleId: puzzle.id,
            startTime: Date.now(),
            currentTime: Date.now(),
            hintsUsed: 0,
            isCompleted: false,
            grid: puzzle.grid.map(row => row.map(cell => cell.letter)),
            completedWords: []
          }
        };

        const crosswordEngine = new CrosswordEngine(initialStateWithPuzzle, gameConfig);
        await crosswordEngine.initialize();
        
        setEngine(crosswordEngine);
        
        // Set game state from puzzle
        setGameState({
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
        const savedState = await loadGameState();
        if (savedState) {
          setGameState(savedState);
        }
        
        startGame(gameId);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize crossword');
        setIsLoading(false);
      }
    };

    if (puzzle) {
      initializeGame();
    }
  }, [puzzle, gameId, startGame]);

  // Auto-save game state
  useEffect(() => {
    if (engine && gameState) {
      saveGameState(gameState);
    }
  }, [gameState, engine, saveGameState]);

  const handleGameComplete = useCallback(async () => {
    if (!engine) return;
    
    const finalScore = engine.calculateScore();
    const completionTime = Date.now() - (engine.getState().startTime || Date.now());
    
    // Submit to leaderboard
    await submitScore({
      gameId,
      gameType: 'crossword',
      score: finalScore,
      completionTime: completionTime / 1000, // Convert to seconds
      difficulty: gameConfig.difficulty
    });
    
    setGameState(prev => ({ ...prev, isComplete: true, score: finalScore }));
  }, [engine, gameId, gameConfig.difficulty, submitScore]);

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

  const handleLetterInput = useCallback((letter: string) => {
    try {
      if (!engine || !gameState.selectedCell) return;
      
      engine.makeMove({
        type: 'INPUT_LETTER',
        row: gameState.selectedCell.row,
        col: gameState.selectedCell.col,
        letter
      });
      
      const newState = engine.getState();
      if (newState.puzzle) {
        setGameState(prev => ({
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
  }, [engine, gameState.selectedCell, gameId, updateGameState, handleGameComplete]);

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
      updateGameState(gameId, { score: 0, status: 'playing' });
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

  if (puzzleLoading || isLoading) {
    return {
      gameState,
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
