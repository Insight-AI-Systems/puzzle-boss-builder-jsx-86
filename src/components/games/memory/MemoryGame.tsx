
import React, { useEffect, useRef, useState } from 'react';
import { MemoryGameBoard } from './components/MemoryGameBoard';
import { MemoryGameControls } from './components/MemoryGameControls';
import { MemoryScoreDisplay } from './components/MemoryScoreDisplay';
import { MemoryLeaderboard } from './components/MemoryLeaderboard';
import { MemoryCelebration } from './components/MemoryCelebration';
import { useMemoryGame } from './hooks/useMemoryGame';
import { useMemoryGameScoring } from './hooks/useMemoryGameScoring';
import { useImagePreloader } from './hooks/useImagePreloader';
import { MemoryLayout, MemoryTheme, THEME_CONFIGS } from './types/memoryTypes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  isActive = true,
  onComplete,
  onScoreUpdate,
  onMoveUpdate
}: MemoryGameProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [activeTab, setActiveTab] = useState('game');

  const {
    gameState,
    handleCardClick,
    initializeGame,
    getGameStats,
    isGameActive,
    disabled,
    gameInitialized
  } = useMemoryGame(layout, theme);

  const {
    scoreData,
    leaderboard,
    personalBests,
    updateScore,
    submitToLeaderboard,
    resetScore
  } = useMemoryGameScoring(gameState.layout);

  const themeItems = THEME_CONFIGS[gameState.theme]?.items || [];
  const { loadedImages, loading: imagesLoading } = useImagePreloader(themeItems);

  const stats = getGameStats();
  const gameCompletedRef = useRef(false);

  // Update scoring in real-time
  useEffect(() => {
    if (gameInitialized && isGameActive) {
      const newScoreData = updateScore(gameState.matchedPairs, gameState.moves, stats.timeElapsed);
      
      if (onScoreUpdate && newScoreData.finalScore !== scoreData.finalScore) {
        onScoreUpdate(newScoreData.finalScore);
      }
    }
  }, [gameState.matchedPairs, gameState.moves, stats.timeElapsed, gameInitialized, isGameActive]);

  const handleLayoutChange = (newLayout: MemoryLayout) => {
    console.log('🔄 Layout change triggered:', newLayout);
    initializeGame(newLayout, gameState.theme);
    resetScore();
    gameCompletedRef.current = false;
    setShowCelebration(false);
  };

  const handleThemeChange = (newTheme: MemoryTheme) => {
    console.log('🎨 Theme change triggered:', newTheme);
    initializeGame(gameState.layout, newTheme);
    resetScore();
    gameCompletedRef.current = false;
    setShowCelebration(false);
  };

  const handleRestart = () => {
    console.log('🔄 Restart triggered');
    initializeGame(gameState.layout, gameState.theme);
    resetScore();
    gameCompletedRef.current = false;
    setShowCelebration(false);
  };

  useEffect(() => {
    if (onMoveUpdate && gameInitialized) {
      onMoveUpdate(gameState.moves);
    }
  }, [gameState.moves, onMoveUpdate, gameInitialized]);

  useEffect(() => {
    if (gameState.isGameComplete && onComplete && !gameCompletedRef.current) {
      gameCompletedRef.current = true;
      
      setShowCelebration(true);
      
      const leaderboardEntry = submitToLeaderboard(scoreData, 'Anonymous Player');
      
      const finalStats = {
        ...scoreData,
        completed: true,
        score: scoreData.finalScore,
        gameType: `memory-${gameState.layout}-${gameState.theme}`,
        difficulty: gameState.layout,
        leaderboardPosition: leaderboard.findIndex(entry => entry.id === leaderboardEntry.id) + 1
      };
      
      console.log('Game completed with stats:', finalStats);
      
      setTimeout(() => {
        onComplete(finalStats);
      }, 3000);
    }
  }, [gameState.isGameComplete, onComplete, scoreData, submitToLeaderboard]);

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

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="game">Game</TabsTrigger>
          <TabsTrigger value="score">Score Details</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="game" className="space-y-4">
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

          <MemoryScoreDisplay
            scoreData={scoreData}
            isGameActive={isGameActive}
          />
          
          <MemoryGameBoard
            cards={gameState.cards}
            onCardClick={handleCardClick}
            disabled={disabled}
            layout={gameState.layout}
            theme={gameState.theme}
          />
        </TabsContent>

        <TabsContent value="score">
          <MemoryScoreDisplay
            scoreData={scoreData}
            isGameActive={isGameActive}
            showDetailed={true}
          />
        </TabsContent>

        <TabsContent value="leaderboard">
          <MemoryLeaderboard
            leaderboard={leaderboard}
            layout={gameState.layout}
            personalBests={personalBests}
          />
        </TabsContent>
      </Tabs>

      <MemoryCelebration
        scoreData={scoreData}
        show={showCelebration}
        onComplete={() => setShowCelebration(false)}
      />
    </div>
  );
}
