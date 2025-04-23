
import { useState, useRef, useEffect } from "react";

type TimerHook = {
  elapsed: number;
  start: () => void;
  stop: () => void;
  reset: () => void;
  isRunning: boolean;
  startTime: number | null;
  setElapsed: React.Dispatch<React.SetStateAction<number>>;
  setStartTime: React.Dispatch<React.SetStateAction<number | null>>;
};

export function usePuzzleTimer(): TimerHook {
  const [elapsed, setElapsed] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  const start = () => {
    if (!isRunning) {
      setIsRunning(true);
      setStartTime(prev => prev || Date.now() - (elapsed * 1000)); // Account for existing elapsed time
    }
  };

  const stop = () => {
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const reset = () => {
    setIsRunning(false);
    setElapsed(0);
    setStartTime(null);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (isRunning && startTime !== null) {
      timerRef.current = window.setInterval(() => {
        const currentElapsed = Math.floor((Date.now() - startTime) / 1000);
        setElapsed(currentElapsed);
      }, 100); // Update more frequently for better accuracy
    } else if (!isRunning && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, startTime]);

  return {
    elapsed,
    start,
    stop,
    reset,
    isRunning,
    startTime,
    setElapsed,
    setStartTime
  };
}
