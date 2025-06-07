
import React, { useEffect, useRef } from 'react';
import { MemoryGameBoard } from './components/MemoryGameBoard';
import { MemoryGameControls } from './components/MemoryGameControls';
import { useMemoryGame } from './hooks/useMemoryGame';
import { useImagePreloader } from './hooks/useImagePreloader';
import { MemoryLayout, MemoryTheme, THEME_CONFIGS } from './types/memoryTypes';

// Import the CSS file directly to ensure it loads
import './styles/memory-cards.css';

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
  isActive = true, // Default to true instead of checking external prop
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

  // Debug current game state
  useEffect(() => {
    console.log('🎮 MemoryGame render state:', {
      gameInitialized,
      cardsLength: gameState.cards.length,
      disabled,
      isActive,
      selectedCards: gameState.selectedCards.length,
      layout: gameState.layout,
      theme: gameState.theme,
      isGameActive
    });

    // Log card states for debugging
    gameState.cards.forEach(card => {
      console.log(`🎴 Card ${card.id}:`, {
        isFlipped: card.isFlipped,
        isMatched: card.isMatched,
        value: card.value
      });
    });
  }, [gameInitialized, gameState, disabled, isActive, isGameActive]);

  // Handle layout changes
  const handleLayoutChange = (newLayout: MemoryLayout) => {
    console.log('🔄 Layout change triggered:', newLayout);
    initializeGame(newLayout, gameState.theme);
    gameCompletedRef.current = false;
  };

  // Handle theme changes
  const handleThemeChange = (newTheme: MemoryTheme) => {
    console.log('🎨 Theme change triggered:', newTheme);
    initializeGame(gameState.layout, newTheme);
    gameCompletedRef.current = false;
  };

  // Handle restart
  const handleRestart = () => {
    console.log('🔄 Restart triggered');
    initializeGame(gameState.layout, gameState.theme);
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

  // FIXED: Only disable cards when 2 are selected, NOT when game is inactive
  const cardsDisabled = disabled; // Remove the || !isActive condition

  console.log('🚨 CARDS DISABLED STATE:', cardsDisabled, 'disabled:', disabled, 'isActive:', isActive);

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
        disabled={cardsDisabled}
        layout={gameState.layout}
        theme={gameState.theme}
      />
    </div>
  );
}
