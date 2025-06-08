
import React, { createContext, useContext, useState, useCallback } from 'react';

export interface GameState {
  status: 'idle' | 'playing' | 'paused' | 'completed' | 'failed';
  score: number;
  timeElapsed: number;
  moves?: number;
  hintsUsed?: number;
  startTime?: number;
  lastPaused?: number;
}

export interface GameContextType {
  currentGame: GameState | null;
  gameId: string | null;
  updateGameState: (gameId: string, updates: Partial<GameState>) => void;
  startGame: (gameId: string) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: (finalScore?: number) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [currentGame, setCurrentGame] = useState<GameState | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);

  const updateGameState = useCallback((id: string, updates: Partial<GameState>) => {
    if (gameId === id) {
      setCurrentGame(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [gameId]);

  const startGame = useCallback((id: string) => {
    setGameId(id);
    setCurrentGame({
      status: 'playing',
      score: 0,
      timeElapsed: 0,
      startTime: Date.now()
    });
  }, []);

  const pauseGame = useCallback(() => {
    setCurrentGame(prev => prev ? {
      ...prev,
      status: 'paused',
      lastPaused: Date.now()
    } : null);
  }, []);

  const resumeGame = useCallback(() => {
    setCurrentGame(prev => prev ? {
      ...prev,
      status: 'playing'
    } : null);
  }, []);

  const endGame = useCallback((finalScore?: number) => {
    setCurrentGame(prev => prev ? {
      ...prev,
      status: 'completed',
      score: finalScore ?? prev.score
    } : null);
  }, []);

  const resetGame = useCallback(() => {
    setCurrentGame(null);
    setGameId(null);
  }, []);

  return (
    <GameContext.Provider value={{
      currentGame,
      gameId,
      updateGameState,
      startGame,
      pauseGame,
      resumeGame,
      endGame,
      resetGame
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
