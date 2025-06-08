
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export interface CrosswordTimerProps {
  startTime: number;
  isPaused: boolean;
  isCompleted: boolean;
  onTimeUpdate?: (timeElapsed: number) => void;
}

export function CrosswordTimer({ startTime, isPaused, isCompleted, onTimeUpdate }: CrosswordTimerProps) {
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    if (isCompleted || isPaused) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setTimeElapsed(elapsed);
      onTimeUpdate?.(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isPaused, isCompleted, onTimeUpdate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2">
      <Clock className="h-4 w-4" />
      <span className="font-mono text-sm">
        {formatTime(timeElapsed)}
      </span>
    </div>
  );
}
