
import React, { useState, useEffect } from 'react';
import { JigsawPuzzle } from 'react-jigsaw-puzzle/lib';
import 'react-jigsaw-puzzle/lib/jigsaw-puzzle.css';
import { Loader2, Clock, RefreshCcw, Image as ImageIcon } from 'lucide-react';
import StagingArea from './StagingArea';
import FirstMoveOverlay from './FirstMoveOverlay';
import { usePuzzleTimer } from './usePuzzleTimer';

interface ReactJigsawPuzzleEngineProps {
  imageUrl: string;
  rows: number;
  columns: number;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

type StagedPiece = { id: number; inPuzzle: boolean };

const ReactJigsawPuzzleEngine: React.FC<ReactJigsawPuzzleEngineProps> = ({
  imageUrl, rows, columns
}) => {
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [solveTime, setSolveTime] = useState<number | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [pieces, setPieces] = useState<StagedPiece[]>([]);

  const {
    elapsed, start, stop, reset, isRunning,
    startTime, setElapsed, setStartTime
  } = usePuzzleTimer();

  // Preload image and reset puzzle
  useEffect(() => {
    setLoading(true);
    setCompleted(false);
    setSolveTime(null);
    setHasStarted(false);
    reset();
    const img = new window.Image();
    img.src = imageUrl;
    img.onload = () => {
      setLoading(false);
      setElapsed(0);
      setHasStarted(false);
      const total = rows * columns;
      setPieces(Array.from({ length: total }).map((_, i) => ({ id: i, inPuzzle: false })));
    };
    img.onerror = (error) => {
      console.error('Error loading puzzle image:', error);
      setLoading(false);
    };
    return () => {
      img.onload = null;
      img.onerror = null;
      reset();
    };
  }, [imageUrl, rows, columns, resetKey, reset, setElapsed]);

  // Handle puzzle solve event
  const handleOnChange = (isSolved: boolean) => {
    if (isSolved && !completed) {
      setCompleted(true);
      const endTime = Date.now();
      if (startTime) {
        setSolveTime((endTime - startTime) / 1000);
        setElapsed(Math.floor((endTime - startTime) / 1000));
      }
      stop();
      setPieces(p => p.map(piece => ({ ...piece, inPuzzle: true })));
    }
  };

  // Start timer on first move/drag
  const handleStartIfFirstMove = () => {
    if (!hasStarted) {
      setHasStarted(true);
      start();
      setStartTime(Date.now());
    }
  };

  // Puzzle reset
  const handleReset = () => {
    setResetKey(rk => rk + 1);
  };

  const customStyles: {
    wrapper: React.CSSProperties;
    ghost: React.CSSProperties;
    puzzle: React.CSSProperties;
  } = {
    wrapper: {
      position: 'relative',
      width: '100%',
      maxWidth: '700px',
      aspectRatio: '1 / 1',
      margin: '0 auto',
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    },
    ghost: {
      position: 'absolute',
      inset: 0,
      zIndex: 1,
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: 0.18,
      pointerEvents: 'none' as React.CSSProperties['pointerEvents'],
      transition: 'opacity 0.2s'
    },
    puzzle: {
      position: 'relative',
      zIndex: 2,
    }
  };

  const stagedPieces = pieces.filter(p => !p.inPuzzle);
  const showFirstMoveOverlay = !hasStarted && !loading && !completed;

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex items-center gap-3 mb-3 w-full justify-between max-w-xl">
        <div className="flex items-center gap-1 text-sm rounded px-2 py-1">
          <Clock className="h-4 w-4 mr-1 text-primary/80" />
          <span className="font-mono tabular-nums">{formatTime(elapsed)}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="inline-flex items-center px-3 py-1 rounded-md bg-muted hover:bg-accent text-xs font-medium border border-input shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
            type="button"
            aria-label="Reset Puzzle"
            tabIndex={0}
          >
            <RefreshCcw className="h-4 w-4 mr-1" />
            Reset
          </button>
        </div>
      </div>
      {/* Puzzle + ghost overlay */}
      <div style={customStyles.wrapper} className="relative">
        {!loading && (
          <div style={customStyles.ghost} aria-hidden="true" />
        )}
        {/* Timer start overlay */}
        <FirstMoveOverlay show={showFirstMoveOverlay} onFirstMove={handleStartIfFirstMove} />
        <div style={customStyles.puzzle}>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading puzzle...</span>
            </div>
          )}
          <JigsawPuzzle
            key={resetKey}
            imageSrc={imageUrl}
            rows={rows}
            columns={columns}
            onSolved={() => handleOnChange(true)}
          />
        </div>
      </div>
      {/* Staging area for unused pieces */}
      <StagingArea stagedPieces={stagedPieces} />

      {completed && (
        <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-md text-center">
          🎉 Puzzle completed in {solveTime?.toFixed(2)} seconds!
        </div>
      )}
      <div className="mt-4 text-sm text-muted-foreground">
        <p className="font-medium flex items-center gap-1">
          <ImageIcon className="h-4 w-4" /> Ghost (preview) enabled
        </p>
        <p className="font-medium">Engine: React Jigsaw Puzzle</p>
        <p className="text-xs">Difficulty: {rows}x{columns}</p>
      </div>
    </div>
  );
};

export default ReactJigsawPuzzleEngine;
