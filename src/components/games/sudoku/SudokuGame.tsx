import React, { useState, useEffect, useCallback } from 'react';
import { SudokuGrid } from './components/SudokuGrid';
import { SudokuNumberPad } from './components/SudokuNumberPad';
import { SudokuControls } from './components/SudokuControls';
import { useSudokuGame } from './hooks/useSudokuGame';
import { SudokuDifficulty, SudokuSize } from './types/sudokuTypes';
import { toast } from 'sonner';

interface SudokuGameProps {
  difficulty?: SudokuDifficulty;
  size?: SudokuSize;
  gameState?: any;
  isActive?: boolean;
  onComplete?: (stats: any) => void;
  onScoreUpdate?: (score: number) => void;
  onMoveUpdate?: (moves: number) => void;
}

export function SudokuGame({
  difficulty = 'medium',
  size = 6,
  gameState,
  isActive = true,
  onComplete,
  onScoreUpdate,
  onMoveUpdate
}: SudokuGameProps) {
  const {
    grid,
    initialGrid,
    selectedCell,
    selectedNumber,
    conflicts,
    moves,
    hintsUsed,
    timeElapsed,
    isComplete,
    canUndo,
    canRedo,
    maxHints,
    setSelectedCell,
    setSelectedNumber,
    makeMove,
    undo,
    redo,
    getHint,
    resetGame,
    newGame
  } = useSudokuGame(difficulty, size);

  const [localIsActive, setLocalIsActive] = useState(isActive);

  useEffect(() => {
    setLocalIsActive(isActive);
  }, [isActive]);

  useEffect(() => {
    if (isComplete && onComplete) {
      const stats = {
        moves,
        hintsUsed,
        timeElapsed,
        difficulty,
        size
      };
      onComplete(stats);
      setLocalIsActive(false);
      toast.success(`Puzzle completed in ${moves} moves!`);
    }
  }, [isComplete, moves, hintsUsed, timeElapsed, difficulty, size, onComplete]);

  useEffect(() => {
    if (onMoveUpdate) {
      onMoveUpdate(moves);
    }
  }, [moves, onMoveUpdate]);

  useEffect(() => {
    if (onScoreUpdate) {
      const baseScore = 1000;
      const movesPenalty = Math.max(0, moves - 50) * 2;
      const hintsPenalty = hintsUsed * 50;
      const score = Math.max(0, baseScore - movesPenalty - hintsPenalty);
      onScoreUpdate(score);
    }
  }, [moves, hintsUsed, onScoreUpdate]);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (!localIsActive) return;
    setSelectedCell([row, col]);
  }, [localIsActive, setSelectedCell]);

  const handleNumberSelect = useCallback((number: number) => {
    if (!localIsActive || !selectedCell) return;
    
    setSelectedNumber(number);
    makeMove(selectedCell[0], selectedCell[1], number);
  }, [localIsActive, selectedCell, setSelectedNumber, makeMove]);

  const handleClear = useCallback(() => {
    if (!localIsActive || !selectedCell) return;
    
    setSelectedNumber(null);
    makeMove(selectedCell[0], selectedCell[1], 0);
  }, [localIsActive, selectedCell, setSelectedNumber, makeMove]);

  // Don't render until grid is loaded
  if (!grid || !initialGrid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-puzzle-white mb-4">
              🧩 Sudoku Master 🧩
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Loading puzzle...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-puzzle-white mb-4">
            🧩 Sudoku Master 🧩
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Challenge your mind with classic number puzzles
          </p>
        </div>

        {/* Mobile Layout - Stack vertically with proper spacing */}
        <div className="block xl:hidden space-y-8 max-w-4xl mx-auto">
          {/* Game Grid */}
          <div className="w-full flex justify-center">
            <SudokuGrid
              grid={grid}
              initialGrid={initialGrid}
              selectedCell={selectedCell}
              conflicts={conflicts}
              size={size}
              onCellClick={handleCellClick}
              isActive={localIsActive}
            />
          </div>

          {/* Number Pad */}
          <div className="w-full max-w-md mx-auto">
            <SudokuNumberPad
              size={size}
              selectedNumber={selectedNumber}
              onNumberSelect={handleNumberSelect}
              onClear={handleClear}
              isActive={localIsActive}
            />
          </div>

          {/* Controls */}
          <div className="w-full max-w-md mx-auto">
            <SudokuControls
              difficulty={difficulty}
              size={size}
              isActive={localIsActive}
              canUndo={canUndo}
              canRedo={canRedo}
              hintsUsed={hintsUsed}
              maxHints={maxHints}
              moves={moves}
              timeElapsed={timeElapsed}
              onUndo={undo}
              onRedo={redo}
              onHint={getHint}
              onReset={resetGame}
              onNewGame={newGame}
            />
          </div>
        </div>

        {/* Desktop Layout - Side by side with increased spacing */}
        <div className="hidden xl:grid xl:grid-cols-5 gap-12 max-w-8xl mx-auto items-start">
          {/* Left Panel - Controls */}
          <div className="xl:col-span-1 w-full max-w-xs">
            <SudokuControls
              difficulty={difficulty}
              size={size}
              isActive={localIsActive}
              canUndo={canUndo}
              canRedo={canRedo}
              hintsUsed={hintsUsed}
              maxHints={maxHints}
              moves={moves}
              timeElapsed={timeElapsed}
              onUndo={undo}
              onRedo={redo}
              onHint={getHint}
              onReset={resetGame}
              onNewGame={newGame}
            />
          </div>

          {/* Center Panel - Game Grid */}
          <div className="xl:col-span-3 flex justify-center px-4">
            <div className="w-full max-w-2xl">
              <SudokuGrid
                grid={grid}
                initialGrid={initialGrid}
                selectedCell={selectedCell}
                conflicts={conflicts}
                size={size}
                onCellClick={handleCellClick}
                isActive={localIsActive}
              />
            </div>
          </div>

          {/* Right Panel - Number Pad */}
          <div className="xl:col-span-1 w-full max-w-xs">
            <SudokuNumberPad
              size={size}
              selectedNumber={selectedNumber}
              onNumberSelect={handleNumberSelect}
              onClear={handleClear}
              isActive={localIsActive}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
