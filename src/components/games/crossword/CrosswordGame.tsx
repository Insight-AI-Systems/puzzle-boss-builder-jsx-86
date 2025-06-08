
import React from 'react';
import { CrosswordGrid } from './components/CrosswordGrid';
import { CrosswordClues } from './components/CrosswordClues';
import { CrosswordTimer } from './components/CrosswordTimer';
import { useCrosswordEngine } from './hooks/useCrosswordEngine';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pause, Play, RotateCcw, Lightbulb } from 'lucide-react';

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

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading crossword...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Game Controls */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Crossword Puzzle</span>
              <div className="flex items-center gap-4">
                <CrosswordTimer 
                  startTime={Date.now()}
                  isPaused={false}
                  isCompleted={gameState.isComplete}
                />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleTogglePause}>
                    <Pause className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleGetHint}>
                    <Lightbulb className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 mb-4">
              Score: {gameState.score} | Hints Used: {gameState.hintsUsed}
            </div>
          </CardContent>
        </Card>

        {/* Crossword Grid */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <CrosswordGrid
              grid={gameState.grid}
              selectedCell={gameState.selectedCell}
              onCellClick={handleCellClick}
            />
          </CardContent>
        </Card>

        {/* Clues */}
        <Card>
          <CardHeader>
            <CardTitle>Clues</CardTitle>
          </CardHeader>
          <CardContent>
            <CrosswordClues
              clues={gameState.clues}
              onClueClick={(clueId) => console.log('Clue clicked:', clueId)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
