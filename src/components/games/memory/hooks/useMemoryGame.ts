
import { useCallback } from 'react';
import { MemoryLayout, MemoryTheme, LAYOUT_CONFIGS } from '../types/memoryTypes';
import { MemoryGameHookInterface } from '../interfaces/memoryGameInterfaces';
import { useMemoryGameState } from './useMemoryGameState';
import { useMemoryGameTimer } from './useMemoryGameTimer';

export function useMemoryGame(
  layout: MemoryLayout,
  theme: MemoryTheme
): MemoryGameHookInterface {
  const { 
    layout: currentLayout, 
    theme: currentTheme, 
    gameState, 
    isProcessingMatch,
    actions 
  } = useMemoryGameState(layout, theme);
  
  const { elapsedTime } = useMemoryGameTimer(gameState.state);

  const getGameStats = useCallback(() => {
    const config = LAYOUT_CONFIGS[currentLayout];
    const totalPairs = config.totalCards / 2;
    const matchedPairs = gameState.matchedPairs.length / 2;
    const accuracy = gameState.moves > 0 ? (matchedPairs / gameState.moves) * 100 : 0;
    
    return {
      moves: gameState.moves,
      timeElapsed: elapsedTime,
      matchedPairs: Math.floor(matchedPairs),
      totalPairs,
      accuracy: Math.round(accuracy * 100) / 100,
    };
  }, [gameState.moves, gameState.matchedPairs.length, elapsedTime, currentLayout]);

  const getGridSize = useCallback(() => {
    const config = LAYOUT_CONFIGS[currentLayout];
    return {
      rows: config.rows,
      cols: config.cols,
      totalPairs: config.totalCards / 2
    };
  }, [currentLayout]);

  // Return the stable interface
  return {
    gameState: {
      layout: currentLayout,
      theme: currentTheme,
      cards: gameState.cards,
      isGameComplete: gameState.state === 'completed',
      matchedPairs: Math.floor(gameState.matchedPairs.length / 2),
      moves: gameState.moves,
    },
    handleCardClick: actions.handleCardClick,
    initializeGame: actions.initialize,
    startGame: actions.start,
    resetGame: actions.reset,
    getGameStats,
    isGameActive: gameState.state === 'playing',
    disabled: isProcessingMatch || gameState.state !== 'playing',
    gameInitialized: gameState.state !== 'idle',
    
    // Backward compatibility properties
    cards: gameState.cards,
    moves: gameState.moves,
    gameTime: Math.floor(elapsedTime / 1000),
    score: 0, // Will be handled by scoring hook
    leaderboard: [],
    flipCard: actions.handleCardClick,
    gridSize: getGridSize(),
  };
}

// Re-export the scoring hook
export { useMemoryGameScoring } from './useMemoryGameScoring';
