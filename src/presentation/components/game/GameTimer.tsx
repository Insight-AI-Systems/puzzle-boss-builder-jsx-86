
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface GameTimerProps {
  elapsedTime: number; // in milliseconds or seconds
  isRunning?: boolean;
  isPaused?: boolean;
  isCompleted?: boolean;
  showMilliseconds?: boolean;
  className?: string;
}

export function GameTimer({ 
  elapsedTime, 
  isRunning = false, 
  isPaused = false, 
  isCompleted = false,
  showMilliseconds = false,
  className = '' 
}: GameTimerProps) {
  const formatTime = (time: number): string => {
    const totalSeconds = showMilliseconds ? Math.floor(time / 1000) : time;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = showMilliseconds ? Math.floor((time % 1000) / 10) : 0;

    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    if (showMilliseconds) {
      return `${timeString}.${milliseconds.toString().padStart(2, '0')}`;
    }
    
    return timeString;
  };

  return (
    <Card className={`inline-flex ${className}`}>
      <CardContent className="flex items-center gap-2 p-4">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <div className="flex items-center gap-2">
          <span className="font-mono text-lg font-bold tabular-nums">
            {formatTime(elapsedTime)}
          </span>
          {isPaused && (
            <Badge variant="secondary">Paused</Badge>
          )}
          {isCompleted && (
            <Badge variant="default" className="bg-green-600">
              Completed!
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
