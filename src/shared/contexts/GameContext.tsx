
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// Game state interface
export interface GameState {
  id: string;
  type: 'jigsaw' | 'crossword' | 'word-search' | 'memory' | 'sudoku' | 'tetris' | 'trivia';
  status: 'idle' | 'initializing' | 'playing' | 'paused' | 'completed' | 'error';
  startTime: number | null;
  endTime: number | null;
  timeElapsed: number;
  score: number;
  moves: number;
  hintsUsed: number;
  difficulty: string;
  player: {
    id: string;
    name: string;
  } | null;
  config: {
    entryFee?: number;
    timeLimit?: number;
    maxHints?: number;
    difficulty?: string;
  };
  error?: string;
}

// Game actions
type GameAction =
  | { type: 'START_GAME'; payload: { gameType: GameState['type']; config: GameState['config']; playerId?: string; playerName?: string } }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'END_GAME'; payload: { score?: number; completed?: boolean } }
  | { type: 'UPDATE_SCORE'; payload: number }
  | { type: 'INCREMENT_MOVES' }
  | { type: 'USE_HINT' }
  | { type: 'UPDATE_TIME'; payload: number }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'RESET_GAME' }
  | { type: 'LOAD_SAVED_STATE'; payload: Partial<GameState> };

// Initial state
const initialState: GameState = {
  id: '',
  type: 'jigsaw',
  status: 'idle',
  startTime: null,
  endTime: null,
  timeElapsed: 0,
  score: 0,
  moves: 0,
  hintsUsed: 0,
  difficulty: 'medium',
  player: null,
  config: {},
};

// Game reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        id: `${action.payload.gameType}-${Date.now()}`,
        type: action.payload.gameType,
        status: 'playing',
        startTime: Date.now(),
        endTime: null,
        timeElapsed: 0,
        score: 0,
        moves: 0,
        hintsUsed: 0,
        config: action.payload.config,
        player: action.payload.playerId ? {
          id: action.payload.playerId,
          name: action.payload.playerName || 'Player'
        } : null,
        error: undefined
      };

    case 'PAUSE_GAME':
      return {
        ...state,
        status: state.status === 'playing' ? 'paused' : state.status
      };

    case 'RESUME_GAME':
      return {
        ...state,
        status: state.status === 'paused' ? 'playing' : state.status
      };

    case 'END_GAME':
      return {
        ...state,
        status: 'completed',
        endTime: Date.now(),
        score: action.payload.score ?? state.score
      };

    case 'UPDATE_SCORE':
      return {
        ...state,
        score: action.payload
      };

    case 'INCREMENT_MOVES':
      return {
        ...state,
        moves: state.moves + 1
      };

    case 'USE_HINT':
      return {
        ...state,
        hintsUsed: state.hintsUsed + 1
      };

    case 'UPDATE_TIME':
      return {
        ...state,
        timeElapsed: action.payload
      };

    case 'SET_ERROR':
      return {
        ...state,
        status: 'error',
        error: action.payload
      };

    case 'RESET_GAME':
      return {
        ...initialState
      };

    case 'LOAD_SAVED_STATE':
      return {
        ...state,
        ...action.payload
      };

    default:
      return state;
  }
}

// Context interface
interface GameContextType {
  gameState: GameState;
  startGame: (gameType: GameState['type'], config: GameState['config'], playerId?: string, playerName?: string) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: (result: { score?: number; completed?: boolean }) => void;
  updateScore: (score: number) => void;
  incrementMoves: () => void;
  useHint: () => void;
  updateTime: (time: number) => void;
  setError: (error: string) => void;
  resetGame: () => void;
  loadSavedState: (state: Partial<GameState>) => void;
}

// Create context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Storage key for persistence
const STORAGE_KEY = 'puzzleboss-game-state';

// Provider component
export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);

  // Load saved state on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        dispatch({ type: 'LOAD_SAVED_STATE', payload: parsed });
      }
    } catch (error) {
      console.error('Failed to load saved game state:', error);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    } catch (error) {
      console.error('Failed to save game state:', error);
    }
  }, [gameState]);

  // Timer effect for active games
  useEffect(() => {
    if (gameState.status === 'playing' && gameState.startTime) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - gameState.startTime!) / 1000);
        dispatch({ type: 'UPDATE_TIME', payload: elapsed });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameState.status, gameState.startTime]);

  // Context value
  const value: GameContextType = {
    gameState,
    startGame: (gameType, config, playerId, playerName) =>
      dispatch({ type: 'START_GAME', payload: { gameType, config, playerId, playerName } }),
    pauseGame: () => dispatch({ type: 'PAUSE_GAME' }),
    resumeGame: () => dispatch({ type: 'RESUME_GAME' }),
    endGame: (result) => dispatch({ type: 'END_GAME', payload: result }),
    updateScore: (score) => dispatch({ type: 'UPDATE_SCORE', payload: score }),
    incrementMoves: () => dispatch({ type: 'INCREMENT_MOVES' }),
    useHint: () => dispatch({ type: 'USE_HINT' }),
    updateTime: (time) => dispatch({ type: 'UPDATE_TIME', payload: time }),
    setError: (error) => dispatch({ type: 'SET_ERROR', payload: error }),
    resetGame: () => dispatch({ type: 'RESET_GAME' }),
    loadSavedState: (state) => dispatch({ type: 'LOAD_SAVED_STATE', payload: state }),
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

// Hook to use game context
export function useGameContext() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}

// Hook for managing multiple concurrent games
export function useMultiGameManager() {
  const [games, setGames] = React.useState<Map<string, GameState>>(new Map());

  const createGame = (gameType: GameState['type'], config: GameState['config']) => {
    const gameId = `${gameType}-${Date.now()}`;
    const newGame: GameState = {
      ...initialState,
      id: gameId,
      type: gameType,
      config
    };
    
    setGames(prev => new Map(prev.set(gameId, newGame)));
    return gameId;
  };

  const updateGame = (gameId: string, updates: Partial<GameState>) => {
    setGames(prev => {
      const current = prev.get(gameId);
      if (!current) return prev;
      
      const updated = { ...current, ...updates };
      return new Map(prev.set(gameId, updated));
    });
  };

  const removeGame = (gameId: string) => {
    setGames(prev => {
      const newMap = new Map(prev);
      newMap.delete(gameId);
      return newMap;
    });
  };

  const getGame = (gameId: string) => games.get(gameId);
  const getAllGames = () => Array.from(games.values());
  const getActiveGames = () => getAllGames().filter(game => game.status === 'playing');

  return {
    games: getAllGames(),
    activeGames: getActiveGames(),
    createGame,
    updateGame,
    removeGame,
    getGame
  };
}
