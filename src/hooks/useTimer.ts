
import { useState, useEffect, useRef, useCallback } from 'react';

export interface TimerState {
  isRunning: boolean;
  elapsed: number;
  startTime: number | null;
}

export function useTimer(initialElapsed: number = 0) {
  const [state, setState] = useState<TimerState>({
    isRunning: false,
    elapsed: initialElapsed,
    startTime: null
  });
  
  const timerRef = useRef<number | null>(null);

  const start = useCallback(() => {
    if (!state.isRunning) {
      setState(prev => ({
        ...prev,
        isRunning: true,
        startTime: Date.now() - prev.elapsed * 1000
      }));
    }
  }, [state.isRunning]);

  const stop = useCallback(() => {
    if (state.isRunning) {
      setState(prev => ({ ...prev, isRunning: false }));
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [state.isRunning]);

  const reset = useCallback(() => {
    stop();
    setState({
      isRunning: false,
      elapsed: 0,
      startTime: null
    });
  }, [stop]);

  const pause = useCallback(() => {
    stop();
  }, [stop]);

  const setElapsed = useCallback((newElapsed: number) => {
    setState(prev => ({
      ...prev,
      elapsed: newElapsed
    }));
  }, []);

  useEffect(() => {
    if (state.isRunning && state.startTime !== null) {
      timerRef.current = window.setInterval(() => {
        setState(prev => ({
          ...prev,
          elapsed: Math.floor((Date.now() - (prev.startTime || 0)) / 1000)
        }));
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [state.isRunning, state.startTime]);

  return {
    ...state,
    start,
    stop,
    pause,
    reset,
    setElapsed
  };
}
