
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CrosswordGrid } from './components/CrosswordGrid';
import { CrosswordClues } from './components/CrosswordClues';
import { CrosswordControls } from './components/CrosswordControls';
import { CrosswordTimer } from './components/CrosswordTimer';
import { useCrosswordGame } from './hooks/useCrosswordGame';
import { Loader2, AlertCircle } from 'lucide-react';

export function CrosswordGame() {
  const {
    gameState,
    selectCell,
    inputLetter,
    toggleDirection,
    getHint,
    savePuzzle,
    resetPuzzle,
    togglePause
  } = useCrosswordGame();

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameState.gameStatus !== 'playing' || gameState.isPaused) return;

      // Letter input
      if (/^[a-zA-Z]$/.test(event.key)) {
        event.preventDefault();
        inputLetter(event.key);
      }
      // Backspace/Delete
      else if (event.key === 'Backspace' || event.key === 'Delete') {
        event.preventDefault();
        inputLetter('');
      }
      // Tab to toggle direction
      else if (event.key === 'Tab') {
        event.preventDefault();
        toggleDirection();
      }
      // Space for hint
      else if (event.key === ' ' && event.ctrlKey) {
        event.preventDefault();
        getHint();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.gameStatus, gameState.isPaused, inputLetter, toggleDirection, getHint]);

  const handleClueClick = (wordId: string, direction: 'across' | 'down') => {
    if (!gameState.puzzle) return;

    const word = gameState.puzzle.words.find(w => w.id === wordId);
    if (word) {
      selectCell(word.startRow, word.startCol);
    }
  };

  if (gameState.gameStatus === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading crossword puzzle...</span>
        </div>
      </div>
    );
  }

  if (gameState.gameStatus === 'error' || !gameState.puzzle) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load crossword puzzle. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{gameState.puzzle.title}</CardTitle>
              <p className="text-muted-foreground">
                Difficulty: {gameState.puzzle.difficulty} • {gameState.puzzle.date}
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

      {/* Game Completed Message */}
      {gameState.gameStatus === 'completed' && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            🎉 Congratulations! You've completed the crossword puzzle!
            {gameState.progress && ` Hints used: ${gameState.progress.hintsUsed}`}
          </AlertDescription>
        </Alert>
      )}

      {/* Main Game Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Crossword Grid */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-center">
                <CrosswordGrid
                  grid={gameState.puzzle.grid}
                  onCellClick={selectCell}
                  disabled={gameState.isPaused || gameState.gameStatus === 'completed'}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls and Clues */}
        <div className="space-y-6">
          {/* Controls */}
          <CrosswordControls
            isPaused={gameState.isPaused}
            isCompleted={gameState.gameStatus === 'completed'}
            hintsUsed={gameState.progress?.hintsUsed || 0}
            selectedDirection={gameState.selectedDirection}
            onTogglePause={togglePause}
            onReset={resetPuzzle}
            onGetHint={getHint}
            onSave={savePuzzle}
            onToggleDirection={toggleDirection}
          />

          {/* Clues */}
          <Card>
            <CardHeader>
              <CardTitle>Clues</CardTitle>
            </CardHeader>
            <CardContent className="max-h-96 overflow-y-auto">
              <CrosswordClues
                clues={gameState.puzzle.clues}
                selectedWord={gameState.selectedWord}
                selectedDirection={gameState.selectedDirection}
                onClueClick={handleClueClick}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
