
import React, { useEffect, useRef } from 'react';
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
    disabled,
    gameInitialized
  } = useMemoryGame(layout, theme);

  const stats = getGameStats();
  const lastMoves = useRef(gameState.moves);
  const lastMatchedPairs = useRef(gameState.matchedPairs);
  const gameCompletedRef = useRef(false);

  // Handle layout changes
  const handleLayoutChange = (newLayout: MemoryLayout) => {
    initializeGame(newLayout, gameState.theme);
    gameCompletedRef.current = false;
  };

  // Handle theme changes
  const handleThemeChange = (newTheme: MemoryTheme) => {
    initializeGame(gameState.layout, newTheme);
    gameCompletedRef.current = false;
  };

  // Handle restart
  const handleRestart = () => {
    initializeGame();
    gameCompletedRef.current = false;
  };

  // Update external score only when matched pairs change
  useEffect(() => {
    if (onScoreUpdate && gameInitialized && lastMatchedPairs.current !== gameState.matchedPairs) {
      const score = Math.round(gameState.matchedPairs * 100 * (stats.accuracy / 100));
      onScoreUpdate(score);
      lastMatchedPairs.current = gameState.matchedPairs;
    }
  }, [gameState.matchedPairs, stats.accuracy, onScoreUpdate, gameInitialized]);

  // Update external moves only when moves change
  useEffect(() => {
    if (onMoveUpdate && gameInitialized && lastMoves.current !== gameState.moves) {
      onMoveUpdate(gameState.moves);
      lastMoves.current = gameState.moves;
    }
  }, [gameState.moves, onMoveUpdate, gameInitialized]);

  // Handle game completion only once
  useEffect(() => {
    if (gameState.isGameComplete && onComplete && !gameCompletedRef.current) {
      gameCompletedRef.current = true;
      const finalStats = {
        ...stats,
        completed: true,
        score: Math.round(gameState.matchedPairs * 100 * (stats.accuracy / 100))
      };
      onComplete(finalStats);
    }
  }, [gameState.isGameComplete, onComplete, stats, gameState.matchedPairs]);

  if (!gameInitialized) {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-4 flex items-center justify-center min-h-[400px]">
        <div className="text-puzzle-white">Initializing game...</div>
      </div>
    );
  }

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
