
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BaseGameWrapper from '../BaseGameWrapper';
import ResponsiveGameContainer from '../ResponsiveGameContainer';
import { GameConfig, GameHooks } from '../types/GameTypes';

interface ExamplePuzzleGameProps {
  gameState?: string;
  onScoreUpdate?: (score: number) => void;
  onMoveUpdate?: (moves: number) => void;
  onComplete?: () => void;
  onError?: (error: string) => void;
  isActive?: boolean;
  session?: any;
}

function ExamplePuzzleGame({
  gameState = 'not_started',
  onScoreUpdate,
  onMoveUpdate,
  onComplete,
  onError,
  isActive = false,
  session
}: ExamplePuzzleGameProps) {
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Simulate game mechanics
  const makeMove = () => {
    if (!isActive || completed) return;
    
    const newMoves = moves + 1;
    const newScore = score + Math.floor(Math.random() * 100) + 50;
    
    setMoves(newMoves);
    setScore(newScore);
    
    onMoveUpdate?.(newMoves);
    onScoreUpdate?.(newScore);
    
    // Simulate completion after 10 moves
    if (newMoves >= 10) {
      setCompleted(true);
      onComplete?.();
    }
  };

  // Reset when game restarts
  useEffect(() => {
    if (gameState === 'not_started') {
      setScore(0);
      setMoves(0);
      setCompleted(false);
    }
  }, [gameState]);

  return (
    <Card className="bg-gray-800 border-gray-600 h-full">
      <CardContent className="p-6 h-full flex flex-col items-center justify-center">
        <div className="text-center space-y-6">
          <div className="text-6xl">🧩</div>
          <h2 className="text-2xl font-bold text-puzzle-white">Example Puzzle Game</h2>
          
          <div className="space-y-4">
            <div className="text-lg text-puzzle-aqua">
              Score: {score.toLocaleString()}
            </div>
            <div className="text-lg text-puzzle-white">
              Moves: {moves}
            </div>
            
            {completed && (
              <div className="text-xl font-bold text-puzzle-gold">
                🎉 Puzzle Complete!
              </div>
            )}
          </div>
          
          {isActive && !completed && (
            <Button 
              onClick={makeMove}
              size="lg"
              className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black font-semibold"
            >
              Make Move
            </Button>
          )}
          
          {!isActive && (
            <div className="text-gray-400">
              {gameState === 'not_started' ? 'Click Start Game to begin' : 'Game is paused'}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Example wrapper component showing how to use BaseGameWrapper
export function ExampleGameWithWrapper() {
  const gameConfig: GameConfig = {
    gameType: 'example-puzzle',
    requiresPayment: true,
    hasTimer: true,
    hasScore: true,
    hasMoves: true,
    timeLimit: 300, // 5 minutes
    entryFee: 10
  };

  const gameHooks: GameHooks = {
    onGameStart: () => console.log('Game started!'),
    onGameComplete: (result) => console.log('Game completed:', result),
    onScoreUpdate: (score) => console.log('Score updated:', score),
    onMoveUpdate: (moves) => console.log('Moves updated:', moves),
    onError: (error) => console.error('Game error:', error)
  };

  return (
    <ResponsiveGameContainer maxWidth="xl" aspectRatio="auto">
      <BaseGameWrapper config={gameConfig} hooks={gameHooks}>
        <ExamplePuzzleGame />
      </BaseGameWrapper>
    </ResponsiveGameContainer>
  );
}

export default ExamplePuzzleGame;
