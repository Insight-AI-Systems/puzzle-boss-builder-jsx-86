
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CrosswordGrid } from './components/CrosswordGrid';
import { CrosswordClues } from './components/CrosswordClues';
import { CrosswordControls } from './components/CrosswordControls';
import { CrosswordTimer } from './components/CrosswordTimer';
import { useCrosswordGame } from './hooks/useCrosswordGame';
import { CrosswordEngine, CrosswordState } from '@/business/engines/crossword';
import { GameConfig } from '@/business/models/GameState';
import { Loader2, AlertCircle, AlertTriangle } from 'lucide-react';

export function CrosswordGame() {
  const {
    gameState: hookGameState,
    selectCell,
    inputLetter,
    toggleDirection,
    getHint,
    savePuzzle,
    resetPuzzle,
    togglePause
  } = useCrosswordGame();

  const [crosswordEngine, setCrosswordEngine] = useState<CrosswordEngine | null>(null);
  const [engineState, setEngineState] = useState<CrosswordState | null>(null);

  // Initialize engine when puzzle loads
  useEffect(() => {
    if (hookGameState.puzzle && !crosswordEngine) {
      const initialState: CrosswordState = {
        id: hookGameState.puzzle.id,
        status: 'idle',
        startTime: null,
        endTime: null,
        score: 0,
        moves: 0,
        isComplete: false,
        puzzle: hookGameState.puzzle,
        progress: hookGameState.progress,
        selectedCell: null,
        selectedWord: null,
        selectedDirection: 'across',
        showHints: false,
        isPaused: false,
        gameStatus: 'loading'
      };

      const config: GameConfig = {
        gameType: 'crossword',
        hasTimer: true,
        hasScore: true,
        hasMoves: false,
        entryFee: 0,
        difficulty: hookGameState.puzzle.difficulty
      };

      const engine = new CrosswordEngine(initialState, config);
      
      // Listen to engine events
      engine.addEventListener((event) => {
        console.log('Crossword engine event:', event);
        setEngineState(engine.getState());
      });

      engine.initialize();
      setCrosswordEngine(engine);
      setEngineState(engine.getState());
    }
  }, [hookGameState.puzzle, crosswordEngine]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!crosswordEngine || !engineState || engineState.gameStatus !== 'playing' || engineState.isPaused) return;

      // Letter input
      if (/^[a-zA-Z]$/.test(event.key)) {
        event.preventDefault();
        crosswordEngine.makeMove({
          type: 'INPUT_LETTER',
          letter: event.key
        });
      }
      // Backspace/Delete
      else if (event.key === 'Backspace' || event.key === 'Delete') {
        event.preventDefault();
        crosswordEngine.makeMove({
          type: 'INPUT_LETTER',
          letter: ''
        });
      }
      // Tab to toggle direction
      else if (event.key === 'Tab') {
        event.preventDefault();
        crosswordEngine.makeMove({
          type: 'TOGGLE_DIRECTION'
        });
      }
      // Space for hint
      else if (event.key === ' ' && event.ctrlKey) {
        event.preventDefault();
        crosswordEngine.makeMove({
          type: 'GET_HINT'
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [crosswordEngine, engineState]);

  const handleCellClick = (row: number, col: number) => {
    if (!crosswordEngine) return;
    
    crosswordEngine.makeMove({
      type: 'SELECT_CELL',
      row,
      col
    });
  };

  const handleClueClick = (wordId: string, direction: 'across' | 'down') => {
    if (!engineState?.puzzle) return;

    const word = engineState.puzzle.words.find(w => w.id === wordId);
    if (word && crosswordEngine) {
      crosswordEngine.makeMove({
        type: 'SELECT_CELL',
        row: word.startRow,
        col: word.startCol
      });
    }
  };

  const handleTogglePause = () => {
    if (!crosswordEngine) return;
    
    if (engineState?.isPaused) {
      crosswordEngine.resume();
    } else {
      crosswordEngine.pause();
    }
  };

  const handleReset = () => {
    if (!crosswordEngine) return;
    crosswordEngine.reset();
  };

  const handleGetHint = () => {
    if (!crosswordEngine) return;
    crosswordEngine.makeMove({
      type: 'GET_HINT'
    });
  };

  const handleToggleDirection = () => {
    if (!crosswordEngine) return;
    crosswordEngine.makeMove({
      type: 'TOGGLE_DIRECTION'
    });
  };

  // Use engine state if available, otherwise fall back to hook state
  const gameState = engineState || hookGameState;

  if (gameState.gameStatus === 'loading' || !gameState.puzzle) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading crossword puzzle...</span>
        </div>
      </div>
    );
  }

  if (gameState.gameStatus === 'error') {
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
    <div className="w-full space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-puzzle-white">{gameState.puzzle.title}</CardTitle>
              <p className="text-puzzle-aqua">
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
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Crossword Grid */}
        <div className="xl:col-span-2">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-center overflow-auto">
                <div className="min-w-fit">
                  <CrosswordGrid
                    grid={gameState.puzzle.grid}
                    onCellClick={handleCellClick}
                    disabled={gameState.isPaused || gameState.gameStatus === 'completed'}
                  />
                </div>
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
            onTogglePause={handleTogglePause}
            onReset={handleReset}
            onGetHint={handleGetHint}
            onSave={savePuzzle}
            onToggleDirection={handleToggleDirection}
          />

          {/* Clues */}
          <Card>
            <CardHeader>
              <CardTitle className="text-puzzle-white">Clues</CardTitle>
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
