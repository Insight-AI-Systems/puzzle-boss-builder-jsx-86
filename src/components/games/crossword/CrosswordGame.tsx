
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CrosswordGrid } from './components/CrosswordGrid';
import { CrosswordClues } from './components/CrosswordClues';
import { CrosswordControls } from './components/CrosswordControls';
import { CrosswordTimer } from './components/CrosswordTimer';
import { useCrosswordEngine } from './hooks/useCrosswordEngine';
import { usePayment } from '@/components/games/hooks/usePayment';
import { useGameRepository } from './hooks/useGameRepository';
import { Loader2, AlertCircle } from 'lucide-react';

export function CrosswordGame() {
  const {
    gameState,
    isLoading,
    error,
    handleCellClick,
    handleLetterInput,
    handleToggleDirection,
    handleTogglePause,
    handleReset,
    handleGetHint
  } = useCrosswordEngine();

  const { paymentStatus, isVerifying } = usePayment();
  const { saveProgress } = useGameRepository();

  const hasAccess = paymentStatus === 'verified' || paymentStatus === 'free';

  // Auto-save progress
  useEffect(() => {
    if (gameState.puzzle && gameState.progress && hasAccess) {
      const saveTimer = setInterval(() => {
        saveProgress(gameState.puzzle!.id, gameState.progress!);
      }, 30000);

      return () => clearInterval(saveTimer);
    }
  }, [gameState.puzzle, gameState.progress, hasAccess, saveProgress]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!gameState.puzzle || gameState.isPaused) return;

      if (/^[a-zA-Z]$/.test(event.key)) {
        event.preventDefault();
        handleLetterInput(event.key);
      } else if (event.key === 'Backspace' || event.key === 'Delete') {
        event.preventDefault();
        handleLetterInput('');
      } else if (event.key === 'Tab') {
        event.preventDefault();
        handleToggleDirection();
      } else if (event.key === ' ' && event.ctrlKey) {
        event.preventDefault();
        handleGetHint();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.puzzle, gameState.isPaused, handleLetterInput, handleToggleDirection, handleGetHint]);

  if (isVerifying || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading crossword puzzle...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!hasAccess) {
    return (
      <Alert>
        <AlertDescription>Payment verification required to play this game.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-puzzle-white">{gameState.puzzle?.title}</CardTitle>
              <p className="text-puzzle-aqua">
                Difficulty: {gameState.puzzle?.difficulty} • {gameState.puzzle?.date}
              </p>
            </div>
            {gameState.progress && (
              <CrosswordTimer
                startTime={gameState.progress.startTime}
                isPaused={gameState.isPaused}
                isCompleted={gameState.progress.isCompleted}
              />
            )}
          </div>
        </CardHeader>
      </Card>

      {gameState.gameStatus === 'completed' && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            🎉 Congratulations! You've completed the crossword puzzle!
            {gameState.progress && ` Hints used: ${gameState.progress.hintsUsed}`}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-center overflow-auto">
                <div className="min-w-fit">
                  {gameState.puzzle && (
                    <CrosswordGrid
                      grid={gameState.puzzle.grid}
                      onCellClick={handleCellClick}
                      disabled={gameState.isPaused || gameState.gameStatus === 'completed'}
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <CrosswordControls
            isPaused={gameState.isPaused}
            isCompleted={gameState.gameStatus === 'completed'}
            hintsUsed={gameState.progress?.hintsUsed || 0}
            selectedDirection={gameState.selectedDirection}
            onTogglePause={handleTogglePause}
            onReset={handleReset}
            onGetHint={handleGetHint}
            onSave={() => gameState.puzzle && gameState.progress && saveProgress(gameState.puzzle.id, gameState.progress)}
            onToggleDirection={handleToggleDirection}
          />

          <Card>
            <CardHeader>
              <CardTitle className="text-puzzle-white">Clues</CardTitle>
            </CardHeader>
            <CardContent className="max-h-96 overflow-y-auto">
              {gameState.puzzle && (
                <CrosswordClues
                  clues={gameState.puzzle.clues}
                  selectedWord={gameState.selectedWord}
                  selectedDirection={gameState.selectedDirection}
                  onClueClick={(wordId, direction) => {
                    const word = gameState.puzzle!.words.find(w => w.id === wordId);
                    if (word) {
                      handleCellClick(word.startRow, word.startCol);
                    }
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
