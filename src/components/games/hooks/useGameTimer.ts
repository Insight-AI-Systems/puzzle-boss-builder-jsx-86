
import { useState, useEffect, useRef, useCallback } from 'react';

export interface GameTimerState {
  timeElapsed: number;
  isRunning: boolean;
  isPaused: boolean;
  formattedTime: string;
  milliseconds: number;
}

export function useGameTimer(timeLimit?: number) {
  const [timeElapsed, setTimeElapsed] = useState(0); // in milliseconds
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [pausedTime, setPausedTime] = useState(0);
  const timerRef = useRef<number | null>(null);

  const formatTime = useCallback((milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const start = useCallback(() => {
    if (!isRunning && !isPaused) {
      setStartTime(Date.now());
      setIsRunning(true);
    } else if (isPaused) {
      setStartTime(Date.now() - pausedTime);
      setIsPaused(false);
      setIsRunning(true);
    }
  }, [isRunning, isPaused, pausedTime]);

  const pause = useCallback(() => {
    if (isRunning && !isPaused) {
      setIsPaused(true);
      setIsRunning(false);
      setPausedTime(timeElapsed);
    }
  }, [isRunning, isPaused, timeElapsed]);

  const resume = useCallback(() => {
    if (isPaused) {
      start();
    }
  }, [isPaused, start]);

  const stop = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    if (timerRef.current) {
      cancelAnimationFrame(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    stop();
    setTimeElapsed(0);
    setStartTime(null);
    setPausedTime(0);
  }, [stop]);

  useEffect(() => {
    if (isRunning && startTime && !isPaused) {
      const updateTimer = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        setTimeElapsed(elapsed);
        
        if (timeLimit && elapsed >= timeLimit * 1000) {
          stop();
          return;
        }
        
        timerRef.current = requestAnimationFrame(updateTimer);
      };
      
      timerRef.current = requestAnimationFrame(updateTimer);
    }

    return () => {
      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current);
      }
    };
  }, [isRunning, startTime, isPaused, timeLimit, stop]);

  const milliseconds = Math.floor(timeElapsed % 1000);
  const formattedTime = formatTime(timeElapsed);
  const timeRemaining = timeLimit ? Math.max(0, (timeLimit * 1000) - timeElapsed) : 0;

  return {
    timeElapsed,
    isRunning,
    isPaused,
    formattedTime,
    milliseconds,
    timeRemaining,
    start,
    pause,
    resume,
    stop,
    reset
  };
}
