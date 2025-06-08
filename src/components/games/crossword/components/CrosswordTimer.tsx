
import React, { useState, useEffect } from 'react';
import { GameTimer } from '@/presentation/components/game';

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
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isPaused, isCompleted]);

  return (
    <GameTimer
      elapsedTime={elapsedTime}
      isRunning={!isPaused && !isCompleted}
      isPaused={isPaused}
      isCompleted={isCompleted}
    />
  );
}
