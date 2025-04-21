
import React, { useState, useEffect, useRef } from 'react';
import { JigsawPuzzle } from 'react-jigsaw-puzzle/lib';
import 'react-jigsaw-puzzle/lib/jigsaw-puzzle.css';
import { Image as ImageIcon } from 'lucide-react';
import { PuzzleTimerDisplay } from './components/PuzzleTimerDisplay';
import { PuzzleControlsBar } from './components/PuzzleControlsBar';
import { PuzzleCompleteBanner } from './components/PuzzleCompleteBanner';
import { usePuzzleTimer } from './usePuzzleTimer';
import { usePuzzleImagePreload } from './hooks/usePuzzleImagePreload';
import FirstMoveOverlay from './FirstMoveOverlay';

// Types
interface ReactJigsawPuzzleEngine2Props {
  imageUrl: string;
  rows: number;
  columns: number;
}

const ReactJigsawPuzzleEngine2: React.FC<ReactJigsawPuzzleEngine2Props> = ({
  imageUrl, rows, columns
}) => {
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [solveTime, setSolveTime] = useState<number | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [showBorder, setShowBorder] = useState(true);
  const [key, setKey] = useState(Date.now());
  const puzzleContainerRef = useRef<HTMLDivElement>(null);

  // Timer state
  const {
    elapsed, start, stop, reset, isRunning,
    startTime, setElapsed, setStartTime
  } = usePuzzleTimer();

  // Preload image & reset
  usePuzzleImagePreload({
    imageUrl,
    onLoad: () => {
      setLoading(false);
      setElapsed(0);
      setHasStarted(false);
      setCompleted(false);
      setSolveTime(null);
    },
    onError: (error) => {
      console.error('Error loading puzzle image:', error);
      setLoading(false);
    }
  });

  // Function to start the timer on first interaction
  const handleStartIfFirstMove = () => {
    if (!hasStarted && !completed) {
      setHasStarted(true);
      start();
      setStartTime(Date.now());
    }
  };

  // Handle puzzle completion
  const handlePuzzleComplete = () => {
    if (!completed) {
      setCompleted(true);
      const endTime = Date.now();
      if (startTime) {
        const totalTime = (endTime - startTime) / 1000;
        setSolveTime(totalTime);
        setElapsed(Math.floor(totalTime));
      }
      stop();
    }
  };

  // Reset the puzzle
  const handleReset = () => {
    setKey(Date.now()); // Force re-render of puzzle component
    setElapsed(0);
    setHasStarted(false);
    setCompleted(false);
    setSolveTime(null);
    reset();
    setStartTime(null);
  };

  // Toggle border
  const handleToggleBorder = () => {
    setShowBorder(prev => !prev);
  };

  // Set up event listeners for keyboard accessibility
  useEffect(() => {
    const container = puzzleContainerRef.current;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasStarted && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight' || 
          e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        handleStartIfFirstMove();
      }
    };
    
    if (container) {
      container.addEventListener('keydown', handleKeyDown);
      return () => {
        container.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [hasStarted, completed]);

  const showFirstMoveOverlay = !hasStarted && !loading && !completed;

  // Calculate dimensions
  const puzzleContainerStyle: React.CSSProperties = {
    maxWidth: '100%',
    height: 'auto',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 auto',
    minHeight: '300px',
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {/* Timer & controls bar */}
      <div className="flex items-center gap-3 mb-3 w-full justify-between max-w-xl">
        <PuzzleTimerDisplay seconds={elapsed} />
        <div className="flex gap-2">
          <PuzzleControlsBar onReset={handleReset} />
          <button
            onClick={handleToggleBorder}
            className="inline-flex items-center px-3 py-1 rounded-md bg-muted hover:bg-accent text-xs font-medium border border-input shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
            type="button"
            aria-label="Toggle Border"
            tabIndex={0}
          >
            {showBorder ? 'Hide Border' : 'Show Border'}
          </button>
        </div>
      </div>

      {/* Puzzle container */}
      <div 
        ref={puzzleContainerRef}
        style={puzzleContainerStyle}
        tabIndex={0}
        className="focus:outline-1 focus:outline-primary relative"
      >
        <FirstMoveOverlay show={showFirstMoveOverlay} onFirstMove={handleStartIfFirstMove} />
        
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-20">
            <span className="ml-2">Loading puzzle...</span>
          </div>
        ) : (
          <div 
            style={{ position: 'relative', width: '100%', maxWidth: '500px' }} 
            onClick={handleStartIfFirstMove}
            className={!showBorder ? 'no-border' : ''}
          >
            <JigsawPuzzle
              key={key}
              imageSrc={imageUrl}
              rows={rows}
              columns={columns}
              onSolved={handlePuzzleComplete}
            />
          </div>
        )}
      </div>

      {/* Completion banner */}
      <PuzzleCompleteBanner solveTime={solveTime} />

      <div className="mt-4 text-sm text-muted-foreground">
        <p className="font-medium flex items-center gap-1">
          <ImageIcon className="h-4 w-4" /> 
          {showBorder ? 'Border enabled' : 'Border disabled'}
        </p>
        <p className="font-medium">Engine: React Jigsaw Puzzle (External)</p>
        <p className="text-xs">Difficulty: {rows}x{columns}</p>
      </div>
    </div>
  );
};

export default ReactJigsawPuzzleEngine2;
