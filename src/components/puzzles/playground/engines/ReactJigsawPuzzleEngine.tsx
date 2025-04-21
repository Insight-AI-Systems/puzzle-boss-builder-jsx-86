
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

  // Now we track two states: staged and placed
  const [stagedPieces, setStagedPieces] = useState<number[]>([]);
  const [placedPieces, setPlacedPieces] = useState<(number | null)[]>([]); // grid; null for empty spot

  const {
    elapsed, start, stop, reset, isRunning,
    startTime, setElapsed, setStartTime
  } = usePuzzleTimer();

  // Preload image & handle reset; reset pieces to staged only
  usePuzzleImagePreload({
    imageUrl,
    onLoad: () => {
      setLoading(false);
      setElapsed(0);
      setHasStarted(false);
      setCompleted(false);
      setSolveTime(null);

      const total = rows * columns;
      setStagedPieces(Array.from({ length: total }, (_, i) => i));
      setPlacedPieces(Array.from({ length: total }, () => null));
    },
    onError: (error) => {
      console.error('Error loading puzzle image:', error);
      setLoading(false);
    }
  });

  // Puzzle solve event
  const handleOnChange = () => {
    const isSolved = placedPieces.every((id, idx) => id === idx);
    if (isSolved && !completed) {
      setCompleted(true);
      const endTime = Date.now();
      if (startTime) {
        setSolveTime((endTime - startTime) / 1000);
        setElapsed(Math.floor((endTime - startTime) / 1000));
      }
      stop();
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

  // Reset puzzle: moves all pieces back to staging area, empties placed area
  const handleReset = () => {
    setResetKey(rk => rk + 1);
    const total = rows * columns;
    setStagedPieces(Array.from({ length: total }, (_, i) => i));
    setPlacedPieces(Array.from({ length: total }, () => null));
    setCompleted(false);
    setHasStarted(false);
    setElapsed(0);
    setStartTime(null);
    setSolveTime(null);
  };

  // Drag handlers
  const handlePieceDrop = (pieceId: number, targetIdx: number) => {
    if (placedPieces[targetIdx] !== null) return;
    handleStartIfFirstMove();
    setPlacedPieces(prev => {
      const np = [...prev];
      np[targetIdx] = pieceId;
      return np;
    });
    setStagedPieces(prev => prev.filter(id => id !== pieceId));
    setTimeout(handleOnChange, 0);
  };

  const handleRemoveFromAssembly = (pieceIdx: number) => {
    const pieceId = placedPieces[pieceIdx];
    if (pieceId === null) return;
    setPlacedPieces(prev => {
      const np = [...prev];
      np[pieceIdx] = null;
      return np;
    });
    setStagedPieces(prev => [...prev, pieceId]);
  };

  const styles = getPuzzleGhostStyles(imageUrl);
  const showFirstMoveOverlay = !hasStarted && !loading && !completed;

  // Utility to get piece image style for assembly slots
  function getPieceStyle(pieceId: number) {
    const row = Math.floor(pieceId / columns);
    const col = pieceId % columns;
    return {
      width: PIECE_SIZE,
      height: PIECE_SIZE,
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: `${columns * 100}% ${rows * 100}%`,
      backgroundPosition: `${(col * 100) / (columns - 1)}% ${(row * 100) / (rows - 1)}%`,
      backgroundRepeat: "no-repeat",
      borderRadius: "0.4rem",
      border: "1px solid rgba(0,0,0,0.15)",
      boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
      cursor: "grab"
    } as React.CSSProperties;
  }

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
          {/* Assembly Area: grid for placed pieces, empty spots are droppable and visually minimal */}
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${columns}, ${PIECE_SIZE}px)`,
              gridTemplateRows: `repeat(${rows}, ${PIECE_SIZE}px)`,
              minHeight: rows * PIECE_SIZE,
              minWidth: columns * PIECE_SIZE
            }}
          >
            {placedPieces.map((pieceId, idx) => (
              <div
                key={idx}
                className={`relative w-16 h-16 rounded transition-all duration-150 flex items-center justify-center
                  ${
                    pieceId === null
                      ? "border border-dashed border-black/20 bg-transparent opacity-80"
                      : ""
                  }`}
                onDragOver={e => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                }}
                onDrop={e => {
                  const dropId = Number(e.dataTransfer.getData("piece-id"));
                  handlePieceDrop(dropId, idx);
                }}
              >
                {pieceId !== null && (
                  <div
                    draggable
                    onDragStart={e => {
                      e.dataTransfer.setData("from-assembly", "true");
                      e.dataTransfer.setData("piece-idx", idx.toString());
                    }}
                    className="absolute inset-0"
                    style={getPieceStyle(pieceId)}
                    onDoubleClick={() => handleRemoveFromAssembly(idx)}
                    title="Double click to return to staging area"
                  />
                )}
              </div>
            ))}
          </div>
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
          // Find first empty spot
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

