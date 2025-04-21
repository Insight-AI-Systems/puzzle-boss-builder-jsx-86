
import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import StagingArea from './StagingArea';
import FirstMoveOverlay from './FirstMoveOverlay';
import { usePuzzleTimer } from './usePuzzleTimer';
import { usePuzzleImagePreload } from './hooks/usePuzzleImagePreload';
import { PuzzleTimerDisplay } from './components/PuzzleTimerDisplay';
import { PuzzleControlsBar } from './components/PuzzleControlsBar';
import { PuzzleCompleteBanner } from './components/PuzzleCompleteBanner';
import { getPuzzleGhostStyles } from './components/usePuzzleGhostStyles';
import AssemblyArea from './components/AssemblyArea';
import { usePuzzleState } from './utils/puzzleStateUtils';
import { createPuzzleHandlers } from './utils/puzzleHandlers';

// Types
interface ReactJigsawPuzzleEngineProps {
  imageUrl: string;
  rows: number;
  columns: number;
}

const PIECE_SIZE = 64;

const ReactJigsawPuzzleEngine: React.FC<ReactJigsawPuzzleEngineProps> = ({
  imageUrl, rows, columns
}) => {
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [solveTime, setSolveTime] = useState<number | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  // Puzzle state
  const {
    stagedPieces, 
    setStagedPieces,
    placedPieces, 
    setPlacedPieces,
    resetPuzzleState
  } = usePuzzleState(rows, columns);

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
      resetPuzzleState();
    },
    onError: (error) => {
      console.error('Error loading puzzle image:', error);
      setLoading(false);
    }
  });

  // Create handlers
  const {
    handlePieceDrop,
    handleRemoveFromAssembly,
    handleStartIfFirstMove,
    handleReset,
    handleOnChange
  } = createPuzzleHandlers(
    placedPieces,
    setPlacedPieces,
    stagedPieces,
    setStagedPieces,
    hasStarted,
    setHasStarted,
    completed,
    setCompleted,
    start,
    stop,
    reset,
    startTime,
    setStartTime,
    setElapsed,
    setSolveTime,
    rows,
    columns
  );

  const styles = getPuzzleGhostStyles(imageUrl);
  const showFirstMoveOverlay = !hasStarted && !loading && !completed;

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {/* Timer & controls bar */}
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
              <span className="ml-2">Loading puzzle...</span>
            </div>
          )}
          
          {/* Assembly Area */}
          <AssemblyArea
            placedPieces={placedPieces}
            rows={rows}
            columns={columns}
            imageUrl={imageUrl}
            onPieceDrop={handlePieceDrop}
            onPieceRemove={handleRemoveFromAssembly}
            pieceSize={PIECE_SIZE}
          />
        </div>
      </div>

      {/* Staging area: all unused pieces using their image portion */}
      <StagingArea
        stagedPieces={stagedPieces}
        imageUrl={imageUrl}
        rows={rows}
        columns={columns}
        onPieceDragStart={pieceId => (e: React.DragEvent<HTMLDivElement>) => {
          e.dataTransfer.setData("piece-id", pieceId.toString());
          e.dataTransfer.setData("from-assembly", "false");
        }}
        onPieceDoubleClick={pieceId => {
          const emptyIdx = placedPieces.findIndex(x => x === null);
          if (emptyIdx !== -1) handlePieceDrop(pieceId, emptyIdx);
        }}
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
