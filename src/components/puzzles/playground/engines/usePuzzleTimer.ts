
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
      setStartTime(Date.now());
    }
  };

  const stop = () => {
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const reset = () => {
    setIsRunning(false);
    setElapsed(0);
    setStartTime(null);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    if (isRunning && startTime !== null) {
      timerRef.current = window.setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 250);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
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
