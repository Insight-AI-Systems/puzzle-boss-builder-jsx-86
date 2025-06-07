
import React, { useEffect } from 'react';
import { MemoryGameBoard } from './components/MemoryGameBoard';
import { MemoryGameControls } from './components/MemoryGameControls';
import { useMemoryGame } from './hooks/useMemoryGame';
import { MemoryLayout, MemoryTheme } from './types/memoryTypes';

interface MemoryGameProps {
  layout?: MemoryLayout;
  theme?: MemoryTheme;
  gameState?: string;
  isActive?: boolean;
  onComplete?: (stats: any) => void;
  onScoreUpdate?: (score: number) => void;
  onMoveUpdate?: (moves: number) => void;
}

export function MemoryGame({
  layout = '3x4',
  theme = 'animals',
  gameState: externalGameState,
  isActive = true,
  onComplete,
  onScoreUpdate,
  onMoveUpdate
}: MemoryGameProps) {
  const {
    gameState,
    handleCardClick,
    initializeGame,
    getGameStats,
    isGameActive,
    disabled
  } = useMemoryGame(layout, theme);

  const stats = getGameStats();

  // Handle layout changes
  const handleLayoutChange = (newLayout: MemoryLayout) => {
    initializeGame(newLayout, gameState.theme);
  };

  // Handle theme changes
  const handleThemeChange = (newTheme: MemoryTheme) => {
    initializeGame(gameState.layout, newTheme);
  };

  // Handle restart
  const handleRestart = () => {
    initializeGame();
  };

  // Update external score and moves
  useEffect(() => {
    if (onScoreUpdate) {
      // Score based on matched pairs and accuracy
      const score = Math.round(gameState.matchedPairs * 100 * (stats.accuracy / 100));
      onScoreUpdate(score);
    }
  }, [gameState.matchedPairs, stats.accuracy, onScoreUpdate]);

  useEffect(() => {
    if (onMoveUpdate) {
      onMoveUpdate(gameState.moves);
    }
  }, [gameState.moves, onMoveUpdate]);

  // Handle game completion
  useEffect(() => {
    if (gameState.isGameComplete && onComplete) {
      const finalStats = {
        ...stats,
        completed: true,
        score: Math.round(gameState.matchedPairs * 100 * (stats.accuracy / 100))
      };
      onComplete(finalStats);
    }
  }, [gameState.isGameComplete, onComplete, stats, gameState.matchedPairs]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      <MemoryGameControls
        moves={stats.moves}
        timeElapsed={stats.timeElapsed}
        matchedPairs={stats.matchedPairs}
        totalPairs={stats.totalPairs}
        accuracy={stats.accuracy}
        layout={gameState.layout}
        theme={gameState.theme}
        isGameActive={isGameActive}
        onLayoutChange={handleLayoutChange}
        onThemeChange={handleThemeChange}
        onRestart={handleRestart}
      />
      
      <MemoryGameBoard
        cards={gameState.cards}
        onCardClick={handleCardClick}
        disabled={disabled || !isActive}
        layout={gameState.layout}
        theme={gameState.theme}
      />
    </div>
  );
}
