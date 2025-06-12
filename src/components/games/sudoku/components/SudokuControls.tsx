
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCcw, RotateCw, RefreshCw, Lightbulb, Play } from 'lucide-react';
import { SudokuInstructions } from './SudokuInstructions';
import { SudokuDifficulty, SudokuSize } from '../types/sudokuTypes';

interface SudokuControlsProps {
  difficulty: SudokuDifficulty;
  size: SudokuSize;
  isActive: boolean;
  canUndo: boolean;
  canRedo: boolean;
  hintsUsed: number;
  maxHints: number;
  moves: number;
  timeElapsed: number;
  onUndo: () => void;
  onRedo: () => void;
  onHint: () => void;
  onReset: () => void;
  onNewGame: () => void;
}

export function SudokuControls({
  difficulty,
  size,
  isActive,
  canUndo,
  canRedo,
  hintsUsed,
  maxHints,
  moves,
  timeElapsed,
  onUndo,
  onRedo,
  onHint,
  onReset,
  onNewGame
}: SudokuControlsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-puzzle-white">Game Controls</CardTitle>
          <SudokuInstructions size={size} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Game Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center p-2 bg-gray-800 rounded">
            <div className="text-puzzle-aqua font-semibold">Time</div>
            <div className="text-puzzle-white">{formatTime(timeElapsed)}</div>
          </div>
          <div className="text-center p-2 bg-gray-800 rounded">
            <div className="text-puzzle-aqua font-semibold">Moves</div>
            <div className="text-puzzle-white">{moves}</div>
          </div>
        </div>

        <div className="text-center p-2 bg-gray-800 rounded">
          <div className="text-puzzle-aqua font-semibold">Difficulty</div>
          <div className="text-puzzle-white capitalize">{difficulty} ({size}×{size})</div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={onUndo}
              disabled={!canUndo || !isActive}
              variant="outline"
              size="sm"
              className="bg-gray-700 hover:bg-gray-600 border-gray-600 text-puzzle-white"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Undo
            </Button>

            <Button
              onClick={onRedo}
              disabled={!canRedo || !isActive}
              variant="outline"
              size="sm"
              className="bg-gray-700 hover:bg-gray-600 border-gray-600 text-puzzle-white"
            >
              <RotateCw className="w-4 h-4 mr-1" />
              Redo
            </Button>
          </div>

          <Button
            onClick={onHint}
            disabled={hintsUsed >= maxHints || !isActive}
            variant="outline"
            size="sm"
            className="w-full bg-yellow-700 hover:bg-yellow-600 border-yellow-600 text-white"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            Hint ({hintsUsed}/{maxHints})
          </Button>

          <Button
            onClick={onReset}
            variant="outline"
            size="sm"
            className="w-full bg-orange-700 hover:bg-orange-600 border-orange-600 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>

          <Button
            onClick={onNewGame}
            variant="outline"
            size="sm"
            className="w-full bg-green-700 hover:bg-green-600 border-green-600 text-white"
          >
            <Play className="w-4 h-4 mr-2" />
            New Game
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
