
import { useState, useEffect } from 'react';

interface GameSaveData {
  gameId: string;
  gameType: string;
  state: any;
  timestamp: number;
  userId?: string;
}

export function useGamePersistence(gameId: string, gameType: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveGameState = async (gameState: any, userId?: string) => {
    try {
      setIsLoading(true);
      const saveData: GameSaveData = {
        gameId,
        gameType,
        state: gameState,
        timestamp: Date.now(),
        userId
      };

      // Save to localStorage for immediate access
      localStorage.setItem(`game_${gameId}`, JSON.stringify(saveData));
      
      // TODO: Save to Supabase for persistence across devices
      console.log('Game state saved:', saveData);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save game');
      console.error('Error saving game state:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadGameState = async (userId?: string): Promise<any | null> => {
    try {
      setIsLoading(true);
      
      // Load from localStorage first
      const savedData = localStorage.getItem(`game_${gameId}`);
      if (savedData) {
        const parsed: GameSaveData = JSON.parse(savedData);
        console.log('Game state loaded:', parsed);
        return parsed.state;
      }

      // TODO: Load from Supabase if not in localStorage
      return null;
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load game');
      console.error('Error loading game state:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearGameState = () => {
    try {
      localStorage.removeItem(`game_${gameId}`);
      console.log('Game state cleared for:', gameId);
    } catch (err) {
      console.error('Error clearing game state:', err);
    }
  };

  return {
    saveGameState,
    loadGameState,
    clearGameState,
    isLoading,
    error
  };
}
