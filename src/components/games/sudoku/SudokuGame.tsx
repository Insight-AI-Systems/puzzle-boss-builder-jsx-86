import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Lightbulb, Undo, Redo, RotateCcw, CheckCircle } from 'lucide-react';
import { SudokuGrid } from './components/SudokuGrid';
import { SudokuNumberPad } from './components/SudokuNumberPad';
import { useSudokuGame } from './hooks/useSudokuGame';
import { SudokuDifficulty, SudokuSize } from './types/sudokuTypes';

interface SudokuGameProps {
  difficulty?: SudokuDifficulty;
  size?: SudokuSize;
  onComplete?: (stats: { moves: number; time: number; hintsUsed: number }) => void;
  onScoreUpdate?: (score: number) => void;
  onMoveUpdate?: (moves: number) => void;
  isActive?: boolean;
  gameState?: string;
}

export function SudokuGame({
  difficulty = 'medium',
  size = 6,
  onComplete,
  onScoreUpdate,
  onMoveUpdate,
  isActive = true,
  gameState = 'playing'
}: SudokuGameProps) {
  const {
    grid,
    initialGrid,
    selectedCell,
    conflicts,
    moves,
    hintsUsed,
    maxHints,
    undoStack,
    redoStack,
    isComplete,
    generateNewPuzzle,
    selectCell,
    setNumber,
    clearCell,
    getHint,
    undo,
    redo,
    resetPuzzle,
    checkSolution
  } = useSudokuGame(difficulty, size);

  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  // Handle game completion
  useEffect(() => {
    if (isComplete && onComplete) {
      const timeElapsed = Math.floor(Date.now() / 1000); // Simplified time tracking
      onComplete({
        moves,
        time: timeElapsed,
        hintsUsed
      });
      
      toast({
        title: "🎉 Sudoku Completed!",
        description: `Solved in ${moves} moves with ${hintsUsed} hints!`
      });
    }
  }, [isComplete, moves, hintsUsed, onComplete]);

  // Update parent components with moves
  useEffect(() => {
    onMoveUpdate?.(moves);
  }, [moves, onMoveUpdate]);

  // Update score based on performance
  useEffect(() => {
    const baseScore = size * size * 10;
    const hintPenalty = hintsUsed * 50;
    const score = Math.max(0, baseScore - hintPenalty + (isComplete ? 500 : 0));
    onScoreUpdate?.(score);
  }, [moves, hintsUsed, isComplete, size, onScoreUpdate]);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (!isActive || gameState !== 'playing') return;
    selectCell(row, col);
  }, [isActive, gameState, selectCell]);

  const handleNumberInput = useCallback((number: number) => {
    if (!isActive || gameState !== 'playing' || !selectedCell) return;
    
    setSelectedNumber(number);
    const [row, col] = selectedCell;
    
    // Don't allow modifying initial puzzle cells
    if (initialGrid[row][col] !== 0) {
      toast({
        title: "Invalid Move",
        description: "Cannot modify initial puzzle numbers",
        variant: "destructive"
      });
      return;
    }
    
    setNumber(row, col, number);
  }, [isActive, gameState, selectedCell, initialGrid, setNumber]);

  const handleClearCell = useCallback(() => {
    if (!isActive || gameState !== 'playing' || !selectedCell) return;
    
    const [row, col] = selectedCell;
    if (initialGrid[row][col] !== 0) return;
    
    clearCell(row, col);
    setSelectedNumber(null);
  }, [isActive, gameState, selectedCell, initialGrid, clearCell]);

  const handleHint = useCallback(() => {
    if (!isActive || gameState !== 'playing' || hintsUsed >= maxHints) {
      toast({
        title: "No Hints Available",
        description: `You've used all ${maxHints} hints for this difficulty`,
        variant: "destructive"
      });
      return;
    }
    
    getHint();
    toast({
      title: "Hint Used",
      description: `${maxHints - hintsUsed - 1} hints remaining`
    });
  }, [isActive, gameState, hintsUsed, maxHints, getHint]);

  const difficultyColors = {
    easy: 'bg-green-500',
    medium: 'bg-orange-500',
    hard: 'bg-red-500',
    expert: 'bg-purple-500'
  };

  if (!grid) {
    return (
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-6 text-center">
          <div className="text-puzzle-white">Generating Sudoku puzzle...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 space-y-4 sm:space-y-6">
      {/* Game Header */}
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <Badge className={`${difficultyColors[difficulty]} text-white text-sm sm:text-base`}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} {size}×{size}
              </Badge>
              {isComplete && (
                <Badge className="bg-puzzle-gold text-puzzle-black">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Complete!
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm sm:text-base text-puzzle-white">
              <span>Moves: {moves}</span>
              <span>Hints: {hintsUsed}/{maxHints}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game Controls */}
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              onClick={handleHint}
              disabled={!isActive || hintsUsed >= maxHints || isComplete}
              className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black text-xs sm:text-sm"
              size="sm"
            >
              <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Hint ({maxHints - hintsUsed})
            </Button>
            
            <Button
              onClick={undo}
              disabled={!isActive || undoStack.length === 0}
              variant="outline"
              className="border-gray-600 text-gray-300 text-xs sm:text-sm"
              size="sm"
            >
              <Undo className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Undo
            </Button>
            
            <Button
              onClick={redo}
              disabled={!isActive || redoStack.length === 0}
              variant="outline"
              className="border-gray-600 text-gray-300 text-xs sm:text-sm"
              size="sm"
            >
              <Redo className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Redo
            </Button>
            
            <Button
              onClick={resetPuzzle}
              disabled={!isActive}
              variant="outline"
              className="border-gray-600 text-gray-300 text-xs sm:text-sm"
              size="sm"
            >
              <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Reset
            </Button>
            
            <Button
              onClick={generateNewPuzzle}
              disabled={!isActive}
              className="bg-puzzle-gold hover:bg-puzzle-gold/80 text-puzzle-black text-xs sm:text-sm"
              size="sm"
            >
              New Puzzle
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Game Board - Improved layout */}
      <div className="flex flex-col xl:flex-row gap-4 sm:gap-6 items-start justify-center">
        <div className="flex-1 max-w-full">
          <SudokuGrid
            grid={grid}
            initialGrid={initialGrid}
            selectedCell={selectedCell}
            conflicts={conflicts}
            size={size}
            onCellClick={handleCellClick}
            isActive={isActive && !isComplete}
          />
        </div>
        
        <div className="w-full xl:w-auto xl:min-w-[280px]">
          <SudokuNumberPad
            size={size}
            selectedNumber={selectedNumber}
            onNumberSelect={handleNumberInput}
            onClear={handleClearCell}
            isActive={isActive && !isComplete}
          />
        </div>
      </div>
    </div>
  );
}
