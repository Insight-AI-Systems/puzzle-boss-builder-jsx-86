
import { useState, useEffect, useCallback } from 'react';

export function useTriviaTimer() {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  const startTimer = useCallback((timeLimit: number) => {
    setTimeRemaining(timeLimit);
  }, []);

  const resetTimer = useCallback(() => {
    setTimeRemaining(0);
  }, []);

  return {
    timeRemaining,
    setTimeRemaining,
    startTimer,
    resetTimer,
  };
}
