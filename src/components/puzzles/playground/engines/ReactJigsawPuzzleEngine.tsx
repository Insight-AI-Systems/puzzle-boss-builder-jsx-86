// Splitting file into smaller components/hooks for readability and maintainability.
// Do not change functionality or UI.

import React, { useState } from 'react';
import { JigsawPuzzle } from 'react-jigsaw-puzzle/lib';
import 'react-jigsaw-puzzle/lib/jigsaw-puzzle.css';
import StagingArea from './StagingArea';
import FirstMoveOverlay from './FirstMoveOverlay';
import { usePuzzleTimer } from './usePuzzleTimer';
import { usePuzzleImagePreload } from './hooks/usePuzzleImagePreload';
import { PuzzleTimerDisplay } from './components/PuzzleTimerDisplay';
import { PuzzleControlsBar } from './components/PuzzleControlsBar';
import { PuzzleCompleteBanner } from './components/PuzzleCompleteBanner';
import { getPuzzleGhostStyles } from './components/usePuzzleGhostStyles';
import { Image as ImageIcon } from 'lucide-react';

interface ReactJigsawPuzzleEngineProps {
  imageUrl: string;
  rows: number;
  columns: number;
}

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

  // Preload image & handle reset
  usePuzzleImagePreload({
    imageUrl,
    onLoad: () => {
      setLoading(false);
      setElapsed(0);
      setHasStarted(false);
      setCompleted(false);
      setSolveTime(null);
      const total = rows * columns;
      setPieces(Array.from({ length: total }).map((_, i) => ({ id: i, inPuzzle: false })));
    },
    onError: (error) => {
      console.error('Error loading puzzle image:', error);
      setLoading(false);
    }
  });

  // Puzzle solve event
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

  // Timer start
  const handleStartIfFirstMove = () => {
    if (!hasStarted) {
      setHasStarted(true);
      start();
      setStartTime(Date.now());
    }
  };

  // Reset puzzle
  const handleReset = () => {
    setResetKey(rk => rk + 1);
  };

  const styles = getPuzzleGhostStyles(imageUrl);
  const stagedPieces = pieces.filter(p => !p.inPuzzle);
  const showFirstMoveOverlay = !hasStarted && !loading && !completed;

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex items-center gap-3 mb-3 w-full justify-between max-w-xl">
        <PuzzleTimerDisplay seconds={elapsed} />
        <PuzzleControlsBar onReset={handleReset} />
      </div>
      {/* Puzzle + ghost overlay */}
      <div style={styles.wrapper} className="relative">
        {!loading && (
          <div style={styles.ghost} aria-hidden="true" />
        )}
        <FirstMoveOverlay show={showFirstMoveOverlay} onFirstMove={handleStartIfFirstMove} />
        <div style={styles.puzzle}>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-20">
              {/* Loader2 handled in parent, avoid duplication */}
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
      <StagingArea 
        stagedPieces={stagedPieces} 
        imageUrl={imageUrl}
        rows={rows}
        columns={columns}
      />
      <PuzzleCompleteBanner solveTime={solveTime} />
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
