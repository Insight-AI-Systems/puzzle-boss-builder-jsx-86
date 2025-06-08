
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CrosswordGrid } from './components/CrosswordGrid';
import { CrosswordClues } from './components/CrosswordClues';
import { CrosswordTimer } from './components/CrosswordTimer';
import { useCrosswordEngine } from './hooks/useCrosswordEngine';
import { useGameContext } from '@/shared/contexts/GameContext';
import { GameErrorBoundary } from '@/infrastructure/errors/GameErrorBoundary';

export function CrosswordGame() {
  const { gameState, isLoading, error, handleCellClick, handleLetterInput, handleToggleDirection, handleTogglePause, handleReset, handleGetHint } = useCrosswordEngine();
  const { currentGame, updateGameState } = useGameContext();

  React.useEffect(() => {
    if (currentGame?.status !== 'playing') {
      updateGameState('crossword-1', {
        status: 'playing',
        score: gameState.score,
        timeElapsed: 0
      });
    }
  }, [gameState.score, currentGame, updateGameState]);

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Error loading crossword: {error}</p>
            <Button onClick={handleReset} className="mt-4">Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <GameErrorBoundary gameType="crossword" onGameRestart={handleReset}>
      <div className="w-full max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Daily Crossword</span>
              <div className="flex items-center gap-4">
                <CrosswordTimer />
                <div className="text-sm">
                  Score: {gameState.score} | Hints: {gameState.hintsUsed}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleTogglePause}>
                    {currentGame?.status === 'paused' ? 'Resume' : 'Pause'}
                  </Button>
                  <Button variant="outline" onClick={handleGetHint}>
                    Hint
                  </Button>
                  <Button variant="outline" onClick={handleReset}>
                    Reset
                  </Button>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <CrosswordGrid
                  grid={gameState.grid}
                  selectedCell={gameState.selectedCell}
                  onCellClick={handleCellClick}
                  onCellInput={handleLetterInput}
                />
              </div>
              <div>
                {currentGame?.status === 'completed' && (
                  <div className="mb-4 p-4 bg-green-100 border border-green-300 rounded-lg">
                    <h3 className="font-bold text-green-800">Congratulations!</h3>
                    <p className="text-green-700">You completed the crossword!</p>
                  </div>
                )}
                
                {currentGame?.status === 'completed' && (
                  <div className="mb-4 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
                    <h3 className="font-bold text-yellow-800">Game Paused</h3>
                    <p className="text-yellow-700">Click Resume to continue.</p>
                  </div>
                )}

                <CrosswordClues
                  clues={gameState.clues}
                  selectedWord={gameState.selectedWord}
                  selectedDirection={gameState.selectedDirection}
                  onClueClick={() => {}}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </GameErrorBoundary>
  );
}
