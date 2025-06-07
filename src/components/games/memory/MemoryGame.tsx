
import React, { useEffect, useRef } from 'react';
import { MemoryGameBoard } from './components/MemoryGameBoard';
import { MemoryGameControls } from './components/MemoryGameControls';
import { useMemoryGame } from './hooks/useMemoryGame';
import { useImagePreloader } from './hooks/useImagePreloader';
import { MemoryLayout, MemoryTheme, THEME_CONFIGS } from './types/memoryTypes';

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

  // Preload images for the current theme
  const themeItems = THEME_CONFIGS[gameState.theme]?.items || [];
  const { loadedImages, loading: imagesLoading } = useImagePreloader(themeItems);

  const stats = getGameStats();
  const lastMoves = useRef(0);
  const lastMatchedPairs = useRef(0);
  const gameCompletedRef = useRef(false);

  // Handle layout changes
  const handleLayoutChange = (newLayout: MemoryLayout) => {
    console.log('Layout changed to:', newLayout);
    initializeGame(newLayout, gameState.theme);
    gameCompletedRef.current = false;
  };

  // Handle theme changes
  const handleThemeChange = (newTheme: MemoryTheme) => {
    console.log('Theme changed to:', newTheme);
    initializeGame(gameState.layout, newTheme);
    gameCompletedRef.current = false;
  };

  // Handle restart
  const handleRestart = () => {
    console.log('Game restarted');
    initializeGame();
    gameCompletedRef.current = false;
  };

  // Update external score only when matched pairs change
  useEffect(() => {
    if (onScoreUpdate && gameInitialized && lastMatchedPairs.current !== gameState.matchedPairs) {
      const score = Math.round(gameState.matchedPairs * 100 * (stats.accuracy / 100));
      console.log('Score updated:', score);
      onScoreUpdate(score);
      lastMatchedPairs.current = gameState.matchedPairs;
    }
  }, [gameState.matchedPairs, stats.accuracy, onScoreUpdate, gameInitialized]);

  // Update external moves only when moves change
  useEffect(() => {
    if (onMoveUpdate && gameInitialized && lastMoves.current !== gameState.moves) {
      console.log('Moves updated:', gameState.moves);
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
      console.log('Game completed with stats:', finalStats);
      onComplete(finalStats);
    }
  }, [gameState.isGameComplete, onComplete, stats, gameState.matchedPairs]);

  if (!gameInitialized || gameState.cards.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-4 flex items-center justify-center min-h-[400px]">
        <div className="text-puzzle-white">Initializing game...</div>
      </div>
    );
  }

  if (imagesLoading && gameState.theme === 'animals') {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-4 flex items-center justify-center min-h-[400px]">
        <div className="text-puzzle-white">Loading images...</div>
      </div>
    );
  }

  console.log('Rendering memory game', { 
    initialized: gameInitialized, 
    cardsCount: gameState.cards.length,
    layout: gameState.layout,
    theme: gameState.theme,
    imagesLoaded: loadedImages.size
  });

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
