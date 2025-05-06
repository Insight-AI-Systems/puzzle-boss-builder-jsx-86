
import React, { useState, useEffect } from 'react';
import { usePhaserMessaging } from './hooks/usePhaserMessaging';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import PuzzleGameIframe from './components/PuzzleGameIframe';
import PuzzleHeader from './components/PuzzleHeader';
import PuzzleFooter from './components/PuzzleFooter';
import { usePuzzleTimer } from '../hooks/usePuzzleTimer';
import AuthenticatedUserCard from './components/auth/AuthenticatedUserCard';
import { useAuth } from '@/hooks/auth/useAuth';
import LeaderboardSection from './components/LeaderboardSection';
import './styles/phaser-puzzle.css';

interface PhaserPuzzleEngineProps {
  imageUrl: string;
  rows: number;
  columns: number;
  showNumbers?: boolean;
  puzzleId?: string;
  onError?: (error: string) => void;
}

const PhaserPuzzleEngine: React.FC<PhaserPuzzleEngineProps> = ({
  imageUrl,
  rows,
  columns,
  showNumbers = false,
  puzzleId = 'default',
  onError
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const { user, isAuthenticated } = useAuth();
  
  const timer = usePuzzleTimer();
  
  const handleIframeLoad = () => {
    console.log('Iframe loaded successfully');
    setIsLoading(false);
    setLoadError(null);
  };
  
  const handleIframeError = (error: string) => {
    console.error('Iframe error:', error);
    setIsLoading(false);
    setLoadError(error);
    if (onError) {
      onError(error);
    }
  };
  
  const { elapsed, isRunning } = usePhaserMessaging({
    puzzleId,
    isLoading,
    setIsLoading,
    setLoadError,
    setHasStarted,
    setIsComplete,
    onMoveCount: (count) => setMoveCount(count),
  });

  const handleRetry = () => window.location.reload();

  // Build the puzzle config to pass to the iframe
  const puzzleConfig = {
    imageUrl,
    rows,
    columns,
    showNumbers,
    puzzleId,
    gameMode: 'standard',
  };

  return (
    <div className="phaser-puzzle-container">
      <PuzzleHeader 
        timer={timer.displayTime || '00:00'} 
        isActive={isRunning} 
        moveCount={moveCount}
      />
      
      <div className="phaser-puzzle-game-container">
        {isLoading && <LoadingState />}
        
        {loadError && !isLoading && (
          <ErrorState errorMessage={loadError} onRetry={handleRetry} />
        )}
        
        <PuzzleGameIframe 
          config={puzzleConfig}
          isLoading={isLoading}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      </div>
      
      <div className="phaser-puzzle-sidebar">
        {isAuthenticated && user ? (
          <AuthenticatedUserCard user={user} />
        ) : (
          <div className="mt-4">
            <LeaderboardSection puzzleId={puzzleId} />
          </div>
        )}
      </div>
      
      <PuzzleFooter puzzleId={puzzleId} />
    </div>
  );
};

export default PhaserPuzzleEngine;
