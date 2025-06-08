
import { useState, useEffect, useCallback } from 'react';
import { CrosswordEngine, CrosswordState } from '@/business/engines/crossword';
import { GameConfig } from '@/business/models/GameState';
import { useCrosswordGame } from './useCrosswordGame';

export function useCrosswordEngine() {
  const { gameState: hookGameState } = useCrosswordGame();
  const [engine, setEngine] = useState<CrosswordEngine | null>(null);
  const [gameState, setGameState] = useState<CrosswordState>({
    id: '',
    status: 'idle',
    startTime: null,
    endTime: null,
    score: 0,
    moves: 0,
    isComplete: false,
    puzzle: null,
    progress: null,
    selectedCell: null,
    selectedWord: null,
    selectedDirection: 'across',
    showHints: false,
    isPaused: false,
    gameStatus: 'loading'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize engine
  useEffect(() => {
    if (hookGameState.puzzle && !engine) {
      try {
        const initialState: CrosswordState = {
          id: hookGameState.puzzle.id,
          status: 'idle',
          startTime: null,
          endTime: null,
          score: 0,
          moves: 0,
          isComplete: false,
          puzzle: hookGameState.puzzle,
          progress: hookGameState.progress,
          selectedCell: null,
          selectedWord: null,
          selectedDirection: 'across',
          showHints: false,
          isPaused: false,
          gameStatus: 'playing'
        };

        const config: GameConfig = {
          gameType: 'crossword',
          hasTimer: true,
          hasScore: true,
          hasMoves: false,
          entryFee: 0,
          difficulty: hookGameState.puzzle.difficulty
        };

        const crosswordEngine = new CrosswordEngine(initialState, config);
        
        crosswordEngine.addEventListener((event) => {
          setGameState(crosswordEngine.getState());
        });

        crosswordEngine.initialize();
        setEngine(crosswordEngine);
        setGameState(crosswordEngine.getState());
        setIsLoading(false);
      } catch (err) {
        setError('Failed to initialize crossword engine');
        setIsLoading(false);
      }
    }
  }, [hookGameState.puzzle, engine]);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (!engine) return;
    engine.makeMove({ type: 'SELECT_CELL', row, col });
  }, [engine]);

  const handleLetterInput = useCallback((letter: string) => {
    if (!engine) return;
    engine.makeMove({ type: 'INPUT_LETTER', letter });
  }, [engine]);

  const handleToggleDirection = useCallback(() => {
    if (!engine) return;
    engine.makeMove({ type: 'TOGGLE_DIRECTION' });
  }, [engine]);

  const handleTogglePause = useCallback(() => {
    if (!engine) return;
    if (gameState.isPaused) {
      engine.resume();
    } else {
      engine.pause();
    }
  }, [engine, gameState.isPaused]);

  const handleReset = useCallback(() => {
    if (!engine) return;
    engine.reset();
  }, [engine]);

  const handleGetHint = useCallback(() => {
    if (!engine) return;
    engine.makeMove({ type: 'GET_HINT' });
  }, [engine]);

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
