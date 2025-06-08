
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Clock, Target, Star, RotateCcw, Home } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GameCompleteProps {
  score?: number;
  timeElapsed?: number;
  moves?: number;
  hintsUsed?: number;
  accuracy?: number;
  onPlayAgain?: () => void;
  onGoHome?: () => void;
  showConfetti?: boolean;
  className?: string;
}

export function GameComplete({
  score = 0,
  timeElapsed = 0,
  moves = 0,
  hintsUsed = 0,
  accuracy,
  onPlayAgain,
  onGoHome,
  showConfetti = true,
  className = ''
}: GameCompleteProps) {
  useEffect(() => {
    if (showConfetti) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [showConfetti]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-green-100">
            <Trophy className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <CardTitle className="text-2xl">🎉 Congratulations!</CardTitle>
        <p className="text-muted-foreground">You've completed the puzzle!</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Score Display */}
        <div className="text-center">
          <div className="text-3xl font-bold text-primary mb-2">
            {score.toLocaleString()}
          </div>
          <p className="text-sm text-muted-foreground">Final Score</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <Badge variant="outline" className="flex items-center gap-1 w-full justify-center">
              <Clock className="h-3 w-3" />
              {formatTime(timeElapsed)}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">Time</p>
          </div>

          <div className="text-center">
            <Badge variant="outline" className="flex items-center gap-1 w-full justify-center">
              <Target className="h-3 w-3" />
              {moves}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">Moves</p>
          </div>

          {hintsUsed > 0 && (
            <div className="text-center">
              <Badge variant="outline" className="flex items-center gap-1 w-full justify-center">
                <Star className="h-3 w-3" />
                {hintsUsed}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">Hints Used</p>
            </div>
          )}

          {accuracy !== undefined && (
            <div className="text-center">
              <Badge variant="outline" className="flex items-center gap-1 w-full justify-center">
                <Star className="h-3 w-3" />
                {accuracy.toFixed(1)}%
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">Accuracy</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {onPlayAgain && (
            <Button onClick={onPlayAgain} className="w-full">
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
          )}
          
          {onGoHome && (
            <Button onClick={onGoHome} variant="outline" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Return Home
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
