
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { usePuzzleTimer } from '@/components/puzzles/playground/engines/hooks/usePuzzleTimer';

interface PhaserMessagingProps {
  puzzleId: string;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setLoadError: (error: string | null) => void;
  setHasStarted: (hasStarted: boolean) => void;
  setIsComplete: (isComplete: boolean) => void;
  onMoveCount?: (count: number) => void;
}

interface PhaserMessageData {
  type: string;
  error?: string;
  stats?: {
    time: number;
    moves: number;
  };
}

export function usePhaserMessaging({
  puzzleId,
  isLoading,
  setIsLoading,
  setLoadError,
  setHasStarted,
  setIsComplete,
  onMoveCount
}: PhaserMessagingProps) {
  const { isAuthenticated } = useAuth();
  const [moveCount, setMoveCount] = useState(0);
  
  // Use our puzzle timer hook
  const {
    elapsed,
    start: startTimer,
    stop: stopTimer,
    reset: resetTimer,
    isRunning,
  } = usePuzzleTimer();

  useEffect(() => {
    const handlePhaserMessage = (event: MessageEvent) => {
      try {
        const data = event.data as PhaserMessageData;
        
        if (!data || typeof data !== 'object') return;
        
        console.log('Received message from Phaser:', data.type);
        
        switch(data.type) {
          case 'PHASER_PUZZLE_LOADING':
            console.log('Phaser puzzle loading');
            break;
          case 'PHASER_PUZZLE_LOADED':
            console.log('Phaser puzzle loaded');
            setIsLoading(false);
            setLoadError(null);
            break;
          case 'PHASER_PUZZLE_ERROR':
            console.error('Phaser puzzle error:', data.error);
            setIsLoading(false);
            setLoadError(data.error || 'Failed to load puzzle');
            break;
          case 'PHASER_PUZZLE_START':
            console.log('Phaser puzzle started');
            setHasStarted(true);
            startTimer();
            break;
          case 'PHASER_PUZZLE_MOVE':
            if (data.stats && data.stats.moves !== undefined) {
              setMoveCount(data.stats.moves);
              onMoveCount?.(data.stats.moves);
            }
            break;
          case 'PHASER_PUZZLE_COMPLETE':
            console.log('Phaser puzzle completed', data.stats);
            setIsComplete(true);
            stopTimer();
            // If we have completion stats and auth, we could send them to the server
            if (data.stats && isAuthenticated && puzzleId) {
              // Submit to leaderboard logic would go here
              console.log('Would submit score to leaderboard:', {
                puzzleId,
                time: elapsed || data.stats.time,
                moves: data.stats.moves
              });
            }
            break;
          case 'PHASER_PUZZLE_RESET':
            console.log('Phaser puzzle reset');
            setHasStarted(false);
            setIsComplete(false);
            setMoveCount(0);
            onMoveCount?.(0);
            resetTimer();
            break;
        }
      } catch (error) {
        console.error('Error handling Phaser message:', error);
      }
    };
    
    window.addEventListener('message', handlePhaserMessage);
    
    // Set a timeout to check if the iframe has loaded
    const loadingTimeout = setTimeout(() => {
      if (isLoading) {
        console.warn('Phaser puzzle loading timeout');
        setLoadError('Loading timeout. Please try again.');
      }
    }, 15000); // Extended from 10 to 15 seconds for slower connections
    
    return () => {
      window.removeEventListener('message', handlePhaserMessage);
      clearTimeout(loadingTimeout);
    };
  }, [puzzleId, elapsed, isAuthenticated, startTimer, stopTimer, resetTimer, isLoading, setIsLoading, setLoadError, setHasStarted, setIsComplete, onMoveCount]);

  return {
    elapsed,
    isRunning,
    moveCount,
  };
}
