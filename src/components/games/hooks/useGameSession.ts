import { useState, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { GameSession, GameState, GameConfig } from '../types/GameTypes';

export function useGameSession(config: GameConfig) {
  const { user } = useAuth();
  const [session, setSession] = useState<GameSession | null>(null);
  const sessionRef = useRef<string | null>(null);

  const createSession = useCallback(() => {
    const sessionId = `${config.gameType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionRef.current = sessionId;
    
    const newSession: GameSession = {
      sessionId,
      userId: user?.id,
      gameType: config.gameType,
      score: 0,
      moves: 0,
      timeElapsed: 0,
      state: 'not_started'
    };
    
    setSession(newSession);
    return newSession;
  }, [config.gameType, user?.id]);

  const updateSession = useCallback((updates: Partial<GameSession>) => {
    setSession(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  const updateState = useCallback((state: GameState) => {
    updateSession({ state });
  }, [updateSession]);

  const updateScore = useCallback((score: number) => {
    updateSession({ score });
  }, [updateSession]);

  const updateMoves = useCallback((moves: number) => {
    updateSession({ moves });
  }, [updateSession]);

  const updateTime = useCallback((timeElapsed: number) => {
    updateSession({ timeElapsed });
  }, [updateSession]);

  const startSession = useCallback(() => {
    if (session) {
      updateSession({ 
        state: 'playing', 
        startTime: Date.now() 
      });
    }
  }, [session, updateSession]);

  const endSession = useCallback(() => {
    if (session) {
      updateSession({ 
        state: 'completed', 
        endTime: Date.now() 
      });
    }
  }, [session, updateSession]);

  const resetSession = useCallback(() => {
    setSession(null);
    sessionRef.current = null;
  }, []);

  return {
    session,
    createSession,
    updateSession,
    updateState,
    updateScore,
    updateMoves,
    updateTime,
    startSession,
    endSession,
    resetSession
  };
}
