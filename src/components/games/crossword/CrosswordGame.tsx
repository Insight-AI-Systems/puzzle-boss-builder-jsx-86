
import React from 'react';
import { CrosswordGrid } from './components/CrosswordGrid';
import { CrosswordClues } from './components/CrosswordClues';
import { useCrosswordEngine } from './hooks/useCrosswordEngine';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pause, Play, RotateCcw, Lightbulb, Clock } from 'lucide-react';

export function CrosswordGame() {
  console.log('🎯 CrosswordGame: Component rendering...');
  
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

  console.log('📊 CrosswordGame: Received state:', { 
    isLoading, 
    hasError: !!error, 
    hasGrid: !!gameState.grid,
    gridLength: gameState.grid?.length,
    hasClues: !!gameState.clues 
  });

  if (isLoading) {
    console.log('⏳ CrosswordGame: Showing loading state');
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-puzzle-aqua mx-auto mb-4"></div>
          <p className="text-gray-600">Loading crossword puzzle...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('❌ CrosswordGame: Showing error state:', error);
    return (
      <div className="text-center p-8">
        <div className="text-red-500 text-lg mb-4">Failed to load crossword</div>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (!gameState.grid || gameState.grid.length === 0) {
    console.warn('⚠️ CrosswordGame: No grid data in game state');
    return (
      <div className="text-center p-8">
        <div className="text-gray-500 text-lg mb-4">No puzzle data available</div>
        <Button onClick={() => window.location.reload()}>
          Reload
        </Button>
      </div>
    );
  }

  console.log('✅ CrosswordGame: Rendering game with valid state');

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Game Controls */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Daily Crossword</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-mono text-sm">00:00</span>
                </div>
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
              Score: {gameState.score} | Hints Used: {gameState.hintsUsed} | Direction: {gameState.selectedDirection}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleToggleDirection}
              className="mb-4"
            >
              Toggle Direction ({gameState.selectedDirection})
            </Button>
          </CardContent>
        </Card>

        {/* Crossword Grid */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <CrosswordGrid
              grid={gameState.grid}
              selectedCell={gameState.selectedCell}
              onCellClick={handleCellClick}
              onCellInput={handleLetterInput}
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
              selectedDirection={gameState.selectedDirection}
              onClueClick={(clueId) => console.log('🔍 CrosswordGame: Clue clicked:', clueId)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
