
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer, Play, Pause, RotateCcw, Eye } from 'lucide-react';

interface WordSearchControlsProps {
  timeElapsed: number;
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onHint: () => void;
  hintsUsed: number;
  isGameComplete: boolean;
}

export function WordSearchControls({
  timeElapsed,
  isPaused,
  onPause,
  onResume,
  onReset,
  onHint,
  hintsUsed,
  isGameComplete
}: WordSearchControlsProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Timer className="w-4 h-4" />
          {formatTime(timeElapsed)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          onClick={isPaused ? onResume : onPause}
          variant="outline"
          className="w-full"
          disabled={isGameComplete}
        >
          {isPaused ? (
            <>
              <Play className="w-4 h-4 mr-2" />
              Resume
            </>
          ) : (
            <>
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </>
          )}
        </Button>
        
        <Button
          onClick={onReset}
          variant="outline"
          className="w-full"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          New Game
        </Button>

        <Button
          onClick={onHint}
          variant="outline"
          className="w-full"
          disabled={isGameComplete}
        >
          <Eye className="w-4 h-4 mr-2" />
          Hint ({hintsUsed} used)
        </Button>
      </CardContent>
    </Card>
  );
}
