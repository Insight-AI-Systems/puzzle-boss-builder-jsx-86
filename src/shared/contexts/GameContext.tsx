
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface GameState {
  currentGame: string | null;
  isPlaying: boolean;
  score: number;
  timeElapsed: number;
  moves: number;
  isComplete: boolean;
  difficulty: 'rookie' | 'pro' | 'master';
  gameData: any;
}

export interface GameAction {
  type: 'START_GAME' | 'END_GAME' | 'UPDATE_SCORE' | 'UPDATE_TIME' | 'UPDATE_MOVES' | 'COMPLETE_GAME' | 'RESET_GAME' | 'UPDATE_GAME_STATE';
  payload?: any;
}

export interface GameContextType {
  gameState: GameState;
  dispatch: React.Dispatch<GameAction>;
  startGame: (gameType: string, difficulty: 'rookie' | 'pro' | 'master') => void;
  endGame: () => void;
  updateScore: (score: number) => void;
  updateTime: (time: number) => void;
  updateMoves: (moves: number) => void;
  completeGame: () => void;
  resetGame: () => void;
  updateGameState: (gameId: string, updates: Partial<GameState>) => void;
  currentGame: string | null;
}

const initialState: GameState = {
  currentGame: null,
  isPlaying: false,
  score: 0,
  timeElapsed: 0,
  moves: 0,
  isComplete: false,
  difficulty: 'rookie',
  gameData: null
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        currentGame: action.payload.gameType,
        difficulty: action.payload.difficulty,
        isPlaying: true,
        isComplete: false,
        score: 0,
        timeElapsed: 0,
        moves: 0,
        gameData: action.payload.gameData
      };
    case 'END_GAME':
      return {
        ...state,
        isPlaying: false,
        currentGame: null
      };
    case 'UPDATE_SCORE':
      return {
        ...state,
        score: action.payload
      };
    case 'UPDATE_TIME':
      return {
        ...state,
        timeElapsed: action.payload
      };
    case 'UPDATE_MOVES':
      return {
        ...state,
        moves: action.payload
      };
    case 'COMPLETE_GAME':
      return {
        ...state,
        isPlaying: false,
        isComplete: true
      };
    case 'UPDATE_GAME_STATE':
      return {
        ...state,
        ...action.payload
      };
    case 'RESET_GAME':
      return initialState;
    default:
      return state;
  }
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);

  const startGame = (gameType: string, difficulty: 'rookie' | 'pro' | 'master') => {
    dispatch({ 
      type: 'START_GAME', 
      payload: { gameType, difficulty } 
    });
  };

  const endGame = () => {
    dispatch({ type: 'END_GAME' });
  };

  const updateScore = (score: number) => {
    dispatch({ type: 'UPDATE_SCORE', payload: score });
  };

  const updateTime = (time: number) => {
    dispatch({ type: 'UPDATE_TIME', payload: time });
  };

  const updateMoves = (moves: number) => {
    dispatch({ type: 'UPDATE_MOVES', payload: moves });
  };

  const completeGame = () => {
    dispatch({ type: 'COMPLETE_GAME' });
  };

  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  const updateGameState = (gameId: string, updates: Partial<GameState>) => {
    dispatch({ type: 'UPDATE_GAME_STATE', payload: updates });
  };

  return (
    <GameContext.Provider value={{
      gameState,
      dispatch,
      startGame,
      endGame,
      updateScore,
      updateTime,
      updateMoves,
      completeGame,
      resetGame,
      updateGameState,
      currentGame: gameState.currentGame
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}
