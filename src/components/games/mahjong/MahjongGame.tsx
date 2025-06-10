
import React from 'react';
import { MahjongBoard } from './components/MahjongBoard';
import { MahjongControls } from './components/MahjongControls';
import { useMahjongGame } from './hooks/useMahjongGame';
import { GameTimer } from '@/components/games/components/GameTimer';
import { Button } from '@/components/ui/button';

interface MahjongGameProps {
  difficulty?: 'rookie' | 'pro' | 'master';
  onGameComplete?: (score: number, time: number) => void;
}

export const MahjongGame: React.FC<MahjongGameProps> = ({ 
  difficulty = 'rookie',
  onGameComplete
}) => {
  const {
    gameState,
    hintTiles,
    handleTileClick,
    showHint,
    shuffleTiles,
    newGame,
    canShuffle,
    hintsRemaining
  } = useMahjongGame(difficulty);

  React.useEffect(() => {
    if (gameState.isComplete && onGameComplete) {
      onGameComplete(gameState.score, gameState.timeElapsed);
    }
  }, [gameState.isComplete, gameState.score, gameState.timeElapsed, onGameComplete]);

  if (gameState.isComplete) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-puzzle-aqua mb-2">🎉 Congratulations!</h2>
          <p className="text-puzzle-white text-lg">You completed the Mahjong puzzle!</p>
          <div className="mt-4 space-y-2 text-puzzle-white">
            <p>Final Score: <span className="text-puzzle-aqua font-bold">{gameState.score}</span></p>
            <p>Time: <span className="text-puzzle-aqua font-bold">{Math.floor(gameState.timeElapsed / 60)}:{(gameState.timeElapsed % 60).toString().padStart(2, '0')}</span></p>
            <p>Moves: <span className="text-puzzle-aqua font-bold">{gameState.moves}</span></p>
          </div>
        </div>
        <Button onClick={newGame} className="bg-puzzle-aqua hover:bg-puzzle-aqua/80">
          Play Again
        </Button>
      </div>
    );
  }

  if (gameState.isGameOver) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-2">Game Over</h2>
          <p className="text-puzzle-white">No more moves available!</p>
          <p className="text-puzzle-white mt-2">Try shuffling the tiles or start a new game.</p>
        </div>
        <div className="flex gap-4">
          <Button onClick={shuffleTiles} variant="outline" className="border-puzzle-aqua text-puzzle-aqua">
            Shuffle Tiles
          </Button>
          <Button onClick={newGame} className="bg-puzzle-aqua hover:bg-puzzle-aqua/80">
            New Game
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-puzzle-white">
          Mahjong Solitaire - {gameState.layout} ({difficulty})
        </h1>
        <GameTimer timeElapsed={gameState.timeElapsed} />
      </div>

      <MahjongControls
        onNewGame={newGame}
        onHint={showHint}
        onShuffle={shuffleTiles}
        canShuffle={canShuffle}
        hintsRemaining={hintsRemaining}
        score={gameState.score}
        moves={gameState.moves}
      />

      <MahjongBoard
        tiles={gameState.tiles}
        onTileClick={handleTileClick}
        hintTiles={hintTiles}
      />

      <div className="text-center text-puzzle-white/60 text-sm">
        Select matching tiles to remove them. Match all tiles to win!
      </div>
    </div>
  );
};
