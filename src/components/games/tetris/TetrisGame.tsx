
import React from 'react';
import { TetrisGrid } from './components/TetrisGrid';
import { TetrisControls } from './components/TetrisControls';
import { TetrisStats } from './components/TetrisStats';
import { TetrisHighScores } from './components/TetrisHighScores';
import { useTetrisGame } from './hooks/useTetrisGame';

export function TetrisGame() {
  const { gameState, controls, resetGame, highScores } = useTetrisGame();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-puzzle-white mb-4">
            🧱 Block Puzzle Pro 🧱
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Classic block-fitting puzzle with modern features
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Left Panel - Stats and Next/Hold */}
          <div className="order-2 lg:order-1">
            <TetrisStats
              stats={gameState.stats}
              nextBlock={gameState.nextBlock}
              holdBlock={gameState.holdBlock}
            />
          </div>

          {/* Center Panel - Game Grid */}
          <div className="order-1 lg:order-2 flex justify-center">
            <TetrisGrid gameState={gameState} cellSize={25} />
          </div>

          {/* Right Panel - Controls and High Scores */}
          <div className="order-3 space-y-6">
            <TetrisControls
              controls={controls}
              isPaused={gameState.paused}
              isGameOver={gameState.gameOver}
              onReset={resetGame}
            />
            <TetrisHighScores highScores={highScores} />
          </div>
        </div>
      </div>
    </div>
  );
}
