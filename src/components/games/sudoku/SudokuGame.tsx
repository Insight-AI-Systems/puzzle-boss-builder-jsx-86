
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Left Panel - Controls */}
          <div className="order-2 lg:order-1">
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
          <div className="order-1 lg:order-2">
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

          {/* Right Panel - Number Pad */}
          <div className="order-3">
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
