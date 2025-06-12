
import React, { useEffect } from 'react';
import { Trophy, RotateCcw, Grid3X3, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import confetti from 'canvas-confetti';
import { SudokuDifficulty, SudokuSize } from '../types/sudokuTypes';

interface SudokuCelebrationProps {
  moves: number;
  hintsUsed: number;
  timeElapsed: number;
  difficulty: SudokuDifficulty;
  size: SudokuSize;
  onPlayAgain: () => void;
  onMorePuzzles: () => void;
  onExit: () => void;
}

export function SudokuCelebration({
  moves,
  hintsUsed,
  timeElapsed,
  difficulty,
  size,
  onPlayAgain,
  onMorePuzzles,
  onExit
}: SudokuCelebrationProps) {
  useEffect(() => {
    // Trigger confetti animation
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const calculateScore = () => {
    const baseScore = 1000;
    const movesPenalty = Math.max(0, moves - 50) * 2;
    const hintsPenalty = hintsUsed * 50;
    const timePenalty = Math.max(0, timeElapsed - 300) * 1; // Penalty after 5 minutes
    return Math.max(0, baseScore - movesPenalty - hintsPenalty - timePenalty);
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-orange-500';
      case 'expert': return 'text-red-500';
      default: return 'text-blue-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-to-br from-purple-900/95 to-blue-900/95 border-gold-500/50 shadow-2xl animate-scale-in">
        <CardContent className="p-8 text-center space-y-6">
          {/* Trophy Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <Trophy className="w-16 h-16 text-yellow-400 animate-pulse" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping" />
            </div>
          </div>

          {/* Congratulations Text */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white">
              🎉 Puzzle Complete! 🎉
            </h2>
            <p className="text-lg text-gray-300">
              Excellent work solving the {size}×{size} {' '}
              <span className={`font-semibold ${getDifficultyColor()}`}>
                {difficulty}
              </span> puzzle!
            </p>
          </div>

          {/* Stats Display */}
          <div className="bg-black/30 rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-white font-semibold">Time</div>
                <div className="text-blue-400 text-lg">{formatTime(timeElapsed)}</div>
              </div>
              <div className="text-center">
                <div className="text-white font-semibold">Moves</div>
                <div className="text-green-400 text-lg">{moves}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-white font-semibold">Hints Used</div>
                <div className="text-orange-400 text-lg">{hintsUsed}</div>
              </div>
              <div className="text-center">
                <div className="text-white font-semibold">Score</div>
                <div className="text-yellow-400 text-lg font-bold">{calculateScore()}</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={onPlayAgain}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3"
              size="lg"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Play Again
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={onMorePuzzles}
                variant="outline"
                className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
              >
                <Grid3X3 className="w-4 h-4 mr-2" />
                More Puzzles
              </Button>
              
              <Button
                onClick={onExit}
                variant="outline"
                className="border-gray-500/50 text-gray-400 hover:bg-gray-500/20"
              >
                <Home className="w-4 h-4 mr-2" />
                Exit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
