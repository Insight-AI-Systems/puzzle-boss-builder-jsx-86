
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface CrosswordTimerProps {
  startTime: number;
  isPaused: boolean;
  isCompleted: boolean;
}

export function CrosswordTimer({ startTime, isPaused, isCompleted }: CrosswordTimerProps) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (isPaused || isCompleted) return;

    const interval = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isPaused, isCompleted]);

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
    }
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-bold">
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
        </div>
      </CardContent>
    </Card>
  );
}
