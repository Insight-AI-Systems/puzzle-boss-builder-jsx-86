
import { useState, useEffect } from 'react';
import { CrosswordEngine } from '@/business/engines/crossword/CrosswordEngine';

export interface CrosswordState {
  grid: any[][];
  selectedCell: { row: number; col: number } | null;
  direction: 'across' | 'down';
  clues: { across: any[]; down: any[] };
  selectedClue: any;
  hintsUsed: number;
  score: number;
  status: 'idle' | 'initializing' | 'playing' | 'paused' | 'error';
}

export function useCrosswordEngine() {
  const [gameState, setGameState] = useState<CrosswordState>({
    grid: [],
    selectedCell: null,
    direction: 'across',
    clues: { across: [], down: [] },
    selectedClue: null,
    hintsUsed: 0,
    score: 0,
    status: 'idle'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [engine] = useState(() => new CrosswordEngine());

  useEffect(() => {
    initializeEngine();
  }, []);

  const initializeEngine = async () => {
    try {
      setIsLoading(true);
      setGameState(prev => ({ ...prev, status: 'initializing' }));
      
      // Initialize crossword engine with sample data
      await engine.initialize();
      
      setGameState(prev => ({
        ...prev,
        grid: engine.getGrid(),
        clues: engine.getClues(),
        status: 'playing'
      }));
    } catch (err) {
      setError('Failed to initialize crossword');
      setGameState(prev => ({ ...prev, status: 'error' }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCellClick = (row: number, col: number) => {
    engine.selectCell(row, col);
    setGameState(prev => ({
      ...prev,
      selectedCell: { row, col },
      selectedClue: engine.getSelectedClue()
    }));
  };

  const handleLetterInput = (letter: string) => {
    engine.inputLetter(letter);
    setGameState(prev => ({
      ...prev,
      grid: engine.getGrid(),
      score: engine.getScore()
    }));
  };

  const handleToggleDirection = () => {
    engine.toggleDirection();
    setGameState(prev => ({
      ...prev,
      direction: engine.getDirection(),
      selectedClue: engine.getSelectedClue()
    }));
  };

  const handleTogglePause = () => {
    setGameState(prev => ({
      ...prev,
      status: prev.status === 'paused' ? 'playing' : 'paused'
    }));
  };

  const handleReset = () => {
    engine.reset();
    setGameState(prev => ({
      ...prev,
      grid: engine.getGrid(),
      selectedCell: null,
      selectedClue: null,
      hintsUsed: 0,
      score: 0,
      status: 'playing'
    }));
  };

  const handleGetHint = () => {
    engine.useHint();
    setGameState(prev => ({
      ...prev,
      grid: engine.getGrid(),
      hintsUsed: engine.getHintsUsed(),
      score: engine.getScore()
    }));
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
