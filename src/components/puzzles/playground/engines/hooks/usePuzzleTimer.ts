
import { useState, useEffect, useRef, useCallback } from 'react';

export function usePuzzleTimer() {
  const [elapsed, setElapsed] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const start = useCallback(() => {
    if (!isRunning) {
      startTimeRef.current = Date.now() - (elapsed * 1000);
      setIsRunning(true);
    }
  }, [isRunning, elapsed]);

  const stop = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isRunning]);

  const reset = useCallback(() => {
    stop();
    setElapsed(0);
    startTimeRef.current = null;
  }, [stop]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const newElapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
          setElapsed(newElapsed);
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  // Format time for display
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const displayTime = formatTime(elapsed);

  return {
    elapsed,
    displayTime,
    isRunning,
    start,
    stop,
    reset,
    formatTime
  };
}
