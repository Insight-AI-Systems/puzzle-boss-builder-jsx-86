
import React, { useState } from 'react';
import { usePhaserMessaging } from './hooks/usePhaserMessaging';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import PuzzleGameIframe from './components/PuzzleGameIframe';
import PuzzleHeader from './components/PuzzleHeader';
import PuzzleFooter from './components/PuzzleFooter';
import './styles/phaser-puzzle.css';

interface PhaserPuzzleEngineProps {
  imageUrl: string;
  rows: number;
  columns: number;
  showNumbers?: boolean;
  puzzleId?: string;
}

const PhaserPuzzleEngine: React.FC<PhaserPuzzleEngineProps> = ({
  imageUrl,
  rows,
  columns,
  showNumbers = false,
  puzzleId = 'default'
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const { elapsed, isRunning } = usePhaserMessaging({
    puzzleId,
    isLoading,
    setIsLoading,
    setLoadError,
    setHasStarted,
    setIsComplete
  });

  // Build the puzzle config to pass to the iframe
  const puzzleConfig = {
    imageUrl,
    rows,
    columns,
    showNumbers,
    puzzleId,
    gameMode: 'standard',
  };

  const handleRetry = () => window.location.reload();

  return (
    <div className="phaser-puzzle-container">
      <PuzzleHeader />
      
      <div className="phaser-puzzle-game-container">
        {isLoading && <LoadingState />}
        
        {loadError && !isLoading && (
          <ErrorState errorMessage={loadError} onRetry={handleRetry} />
        )}
        
        <PuzzleGameIframe 
          config={puzzleConfig}
          isLoading={isLoading}
        />
      </div>
      
      <PuzzleFooter puzzleId={puzzleId} />
    </div>
  );
};

export default PhaserPuzzleEngine;
