
import { useState, useEffect, useCallback } from 'react';
import { CrosswordEngine } from '@/business/engines/crossword/CrosswordEngine';
import type { CrosswordState } from '@/business/engines/crossword/CrosswordEngine';
import type { GameConfig } from '@/business/models/GameState';
import { useCrosswordPuzzleData } from './useCrosswordPuzzleData';

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
  console.log('🎯 useCrosswordEngine: Starting initialization with gameId:', gameId);
  
  const { puzzle, isLoading: puzzleLoading, error: puzzleError } = useCrosswordPuzzleData();
  
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
      console.log('🔄 useCrosswordEngine: Starting game initialization...');
      console.log('📊 Puzzle loading state:', { puzzleLoading, puzzleError, hasPuzzle: !!puzzle });
      
      if (puzzleLoading) {
        console.log('⏳ useCrosswordEngine: Still loading puzzle data, waiting...');
        return;
      }
      
      if (puzzleError) {
        console.error('❌ useCrosswordEngine: Puzzle error:', puzzleError);
        setError(puzzleError);
        setIsLoading(false);
        return;
      }
      
      if (!puzzle) {
        console.error('❌ useCrosswordEngine: No puzzle data available');
        setError('No puzzle data available');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log('🏗️ useCrosswordEngine: Creating engine with puzzle:', puzzle);
        
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

        console.log('🎮 useCrosswordEngine: Creating CrosswordEngine...');
        const crosswordEngine = new CrosswordEngine(initialStateWithPuzzle, gameConfig);
        
        console.log('🚀 useCrosswordEngine: Initializing engine...');
        await crosswordEngine.initialize();
        
        console.log('✅ useCrosswordEngine: Engine initialized successfully');
        setEngine(crosswordEngine);
        
        // Set game state from puzzle
        const newGameState = {
          grid: puzzle.grid,
          clues: puzzle.clues,
          selectedCell: null,
          selectedDirection: 'across' as const,
          selectedWord: null,
          isComplete: false,
          score: 0,
          hintsUsed: 0
        };
        
        console.log('📝 useCrosswordEngine: Setting local game state:', newGameState);
        setLocalGameState(newGameState);
        
        console.log('🎉 useCrosswordEngine: Game initialized successfully!');
        setIsLoading(false);
        setError('');
      } catch (err) {
        console.error('💥 useCrosswordEngine: Error during initialization:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize crossword');
        setIsLoading(false);
      }
    };

    initializeGame();
  }, [puzzle, puzzleLoading, puzzleError, gameId]);

  const handleCellClick = useCallback((row: number, col: number) => {
    try {
      console.log('🖱️ useCrosswordEngine: Cell clicked at:', { row, col });
      setLocalGameState(prev => ({
        ...prev,
        selectedCell: { row, col }
      }));
    } catch (err) {
      console.error('❌ useCrosswordEngine: Error in handleCellClick:', err);
    }
  }, []);

  const handleLetterInput = useCallback((letter: string) => {
    try {
      console.log('⌨️ useCrosswordEngine: Letter input:', { letter, selectedCell: localGameState.selectedCell });
      
      if (!engine || !localGameState.selectedCell) {
        console.log('⚠️ useCrosswordEngine: No engine or selected cell for letter input');
        return;
      }
      
      engine.makeMove({
        type: 'ENTER_LETTER',
        row: localGameState.selectedCell.row,
        col: localGameState.selectedCell.col,
        letter
      });
      
      const newState = engine.getState();
      if (newState.puzzle) {
        console.log('📝 useCrosswordEngine: Updating grid after letter input');
        setLocalGameState(prev => ({
          ...prev,
          grid: newState.puzzle!.grid,
          score: newState.score
        }));
        
        // Check for completion
        const winResult = engine.checkWinCondition();
        if (winResult.isWin) {
          console.log('🎉 useCrosswordEngine: Game completed!');
          setLocalGameState(prev => ({ ...prev, isComplete: true }));
        }
      }
    } catch (err) {
      console.error('❌ useCrosswordEngine: Error in handleLetterInput:', err);
    }
  }, [engine, localGameState.selectedCell]);

  // Loading state
  if (puzzleLoading || isLoading) {
    console.log('⏳ useCrosswordEngine: Returning loading state');
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
    console.error('❌ useCrosswordEngine: Returning error state:', { error, puzzleError });
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

  console.log('✅ useCrosswordEngine: Returning ready state with gameState:', localGameState);

  return {
    gameState: localGameState,
    isLoading: false,
    error: '',
    handleCellClick,
    handleLetterInput,
    handleToggleDirection: () => {
      console.log('🔄 useCrosswordEngine: Toggling direction');
      setLocalGameState(prev => ({
        ...prev,
        selectedDirection: prev.selectedDirection === 'across' ? 'down' : 'across'
      }));
    },
    handleTogglePause: () => {
      console.log('⏸️ useCrosswordEngine: Toggle pause');
    },
    handleReset: () => {
      try {
        console.log('🔄 useCrosswordEngine: Resetting game');
        setLocalGameState(prev => ({
          ...prev,
          grid: puzzle?.grid || [],
          score: 0,
          hintsUsed: 0,
          isComplete: false,
          selectedCell: null
        }));
      } catch (err) {
        console.error('❌ useCrosswordEngine: Error resetting game:', err);
      }
    },
    handleGetHint: () => {
      try {
        console.log('💡 useCrosswordEngine: Getting hint');
        setLocalGameState(prev => ({
          ...prev,
          hintsUsed: prev.hintsUsed + 1
        }));
      } catch (err) {
        console.error('❌ useCrosswordEngine: Error getting hint:', err);
      }
    }
  };
}
