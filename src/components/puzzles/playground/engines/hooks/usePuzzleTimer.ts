
import { useState, useEffect, useRef, useCallback } from 'react';

export function usePuzzleTimer() {
  const [elapsed, setElapsed] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    if (!isRunning) {
      const now = Date.now();
      setStartTime(now - (elapsed * 1000));
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
    setStartTime(null);
  }, [stop]);

  useEffect(() => {
    if (isRunning && startTime !== null) {
      timerRef.current = setInterval(() => {
        const newElapsed = Math.floor((Date.now() - startTime) / 1000);
        setElapsed(newElapsed);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, startTime]);

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
    formatTime,
    startTime,
    setElapsed,
    setStartTime
  };
}
