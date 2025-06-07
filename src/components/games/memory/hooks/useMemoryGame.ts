
import { useState, useCallback, useRef, useEffect } from 'react';
import { MemoryLayout, MemoryTheme } from '../types/memoryTypes';
import { MemoryGameHookInterface } from '../interfaces/memoryGameInterfaces';
import { useMemoryGameLogic } from './useMemoryGameLogic';
import { useMemoryGameScoring } from './useMemoryGameScoring';
import { useAuth } from '@/contexts/AuthContext';
import { useMemberProfile } from '@/hooks/useMemberProfile';

export function useMemoryGame(
  layout: MemoryLayout,
  theme: MemoryTheme
): MemoryGameHookInterface {
  const { user } = useAuth();
  const { profile } = useMemberProfile();
  const [startTime, setStartTime] = useState<number | null>(null);
  const [gameTime, setGameTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Use focused hooks for game logic and scoring
  const gameLogic = useMemoryGameLogic(layout, theme);
  const scoring = useMemoryGameScoring(gameLogic.layout);

  // Timer management
  useEffect(() => {
    if (gameLogic.isGameActive && !timerRef.current) {
      setStartTime(Date.now());
      timerRef.current = setInterval(() => {
        setGameTime(prev => prev + 1);
      }, 1000);
    } else if (!gameLogic.isGameActive && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameLogic.isGameActive]);

  // Update scoring in real-time
  useEffect(() => {
    if (gameLogic.isGameActive) {
      const timeElapsed = startTime ? Date.now() - startTime : 0;
      scoring.updateScore(gameLogic.matchedPairs, gameLogic.moves, timeElapsed);
    }
  }, [gameLogic.matchedPairs, gameLogic.moves, gameLogic.isGameActive, startTime]);

  // Handle game completion
  useEffect(() => {
    if (gameLogic.isGameComplete && startTime) {
      const timeElapsed = Date.now() - startTime;
      const finalScore = scoring.updateScore(gameLogic.matchedPairs, gameLogic.moves, timeElapsed);
      
      // Submit to leaderboard
      const playerName = profile?.username || profile?.display_name || profile?.full_name || 'Anonymous Player';
      scoring.submitToLeaderboard(finalScore, playerName);
    }
  }, [gameLogic.isGameComplete, startTime, profile]);

  const getGameStats = useCallback(() => {
    const timeElapsed = startTime ? gameTime : 0;
    const accuracy = gameLogic.moves > 0 ? (gameLogic.matchedPairs / gameLogic.moves * 100) : 0;
    const gridSize = gameLogic.getGridSize();
    
    return {
      moves: gameLogic.moves,
      timeElapsed,
      matchedPairs: gameLogic.matchedPairs,
      totalPairs: gridSize.totalPairs,
      accuracy: Math.round(accuracy * 100) / 100,
    };
  }, [gameLogic.moves, gameLogic.matchedPairs, gameTime, startTime]);

  const handleGameStart = useCallback(() => {
    gameLogic.startGame();
    setGameTime(0);
    scoring.resetScore();
  }, [gameLogic.startGame, scoring.resetScore]);

  const handleGameReset = useCallback(() => {
    gameLogic.resetGame();
    setStartTime(null);
    setGameTime(0);
    scoring.resetScore();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [gameLogic.resetGame, scoring.resetScore]);

  const handleInitializeGame = useCallback((newLayout?: MemoryLayout, newTheme?: MemoryTheme) => {
    gameLogic.initializeGame(newLayout, newTheme);
    handleGameReset();
  }, [gameLogic.initializeGame, handleGameReset]);

  // Return the stable interface
  return {
    gameState: {
      layout: gameLogic.layout,
      theme: gameLogic.theme,
      cards: gameLogic.cards,
      isGameComplete: gameLogic.isGameComplete,
      matchedPairs: gameLogic.matchedPairs,
      moves: gameLogic.moves,
    },
    handleCardClick: gameLogic.handleCardFlip,
    initializeGame: handleInitializeGame,
    startGame: handleGameStart,
    resetGame: handleGameReset,
    getGameStats,
    isGameActive: gameLogic.isGameActive,
    disabled: gameLogic.disabled,
    gameInitialized: gameLogic.gameInitialized,
    
    // Backward compatibility properties
    cards: gameLogic.cards,
    moves: gameLogic.moves,
    gameTime,
    score: scoring.scoreData.finalScore,
    leaderboard: scoring.leaderboard,
    flipCard: gameLogic.handleCardFlip,
    gridSize: gameLogic.getGridSize(),
  };
}

// Export the scoring hook for components that need it
export { useMemoryGameScoring } from './useMemoryGameScoring';
