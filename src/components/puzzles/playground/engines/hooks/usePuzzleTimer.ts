import { useState, useCallback } from 'react';

export const usePuzzleTimer = () => {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setElapsed(0);
  }, []);

  const moveCount = useState<number>(0)[0];  // Add moveCount to track moves

  return {
    elapsed,
    start,
    stop,
    reset,
    isRunning,
    startTime,
    setElapsed,
    setStartTime,
    moveCount
  };
};
