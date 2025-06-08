
import { useState, useEffect, useRef } from 'react';
import { GameState } from '../core/memoryGameCore';

export function useMemoryGameTimer(gameState: GameState) {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start timer when game begins
  useEffect(() => {
    if (gameState === 'playing' && !startTime) {
      setStartTime(Date.now());
    }
  }, [gameState, startTime]);

  // Update elapsed time
  useEffect(() => {
    if (gameState === 'playing' && startTime) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [gameState, startTime]);

  // Reset timer on game reset
  useEffect(() => {
    if (gameState === 'ready' || gameState === 'idle') {
      setStartTime(null);
      setElapsedTime(0);
    }
  }, [gameState]);

  return {
    elapsedTime,
    startTime
  };
}
