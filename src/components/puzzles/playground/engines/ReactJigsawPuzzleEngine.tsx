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

type AssemblyPiece = {
  id: number;
  isLocked: boolean;
};

const ReactJigsawPuzzleEngine: React.FC<ReactJigsawPuzzleEngineProps> = ({
  imageUrl, rows, columns
}) => {
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [solveTime, setSolveTime] = useState<number | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  // Staging area pieces: only those NOT placed
  const [stagedPieces, setStagedPieces] = useState<number[]>([]);
  // Assembly area: each slot is {id: pieceId, isLocked} or null for empty
  const [placedPieces, setPlacedPieces] = useState<(AssemblyPiece | null)[]>([]);

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
    const allLocked = placedPieces.every((entry, idx) => entry && entry.isLocked && entry.id === idx);
    if (allLocked && !completed) {
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

    const fromAssemblyIdx = placedPieces.findIndex(
      (entry, idx) => entry && entry.id === pieceId && !entry.isLocked
    );
    const isFromAssembly = fromAssemblyIdx !== -1;

    handleStartIfFirstMove();

    setPlacedPieces(prev => {
      let np = [...prev];
      if (isFromAssembly) {
        np[fromAssemblyIdx] = null;
      }
      const shouldLock = pieceId === targetIdx;
      np[targetIdx] = { id: pieceId, isLocked: shouldLock };
      return np;
    });

    setStagedPieces(prev => prev.filter(id => id !== pieceId));

    if (isFromAssembly) {
    } else if (pieceId !== targetIdx) {
      setStagedPieces(prev => prev.filter(id => id !== pieceId));
    }

    setTimeout(handleOnChange, 0);
  };

  const handleRemoveFromAssembly = (pieceIdx: number) => {
    const slot = placedPieces[pieceIdx];
    if (!slot || slot.isLocked) return;
    setPlacedPieces(prev => {
      const np = [...prev];
      np[pieceIdx] = null;
      return np;
    });
    setStagedPieces(prev => [...prev, slot.id]);
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
          {/* Assembly Area */}
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${columns}, ${PIECE_SIZE}px)`,
              gridTemplateRows: `repeat(${rows}, ${PIECE_SIZE}px)`,
              minHeight: rows * PIECE_SIZE,
              minWidth: columns * PIECE_SIZE
            }}
          >
            {placedPieces.map((entry, idx) => (
              <div
                key={idx}
                className={`relative w-16 h-16 rounded transition-all duration-150 flex items-center justify-center
                  ${
                    !entry
                      ? "border border-dashed border-black/20 bg-transparent opacity-80"
                      : entry.isLocked
                        ? "border border-solid border-green-400 ring-2 ring-green-200"
                        : "border border-solid border-black/30 bg-white"
                  }`}
                onDragOver={e => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                }}
                onDrop={e => {
                  const dropId = Number(e.dataTransfer.getData("piece-id"));
                  const fromAssembly = e.dataTransfer.getData("from-assembly") === "true";
                  if (!placedPieces[idx]) {
                    if (fromAssembly) {
                      const fromIdx = placedPieces.findIndex(
                        (x, i) => x && x.id === dropId && !x.isLocked
                      );
                      if (fromIdx !== -1) {
                        handlePieceDrop(dropId, idx);
                      }
                    } else {
                      handlePieceDrop(dropId, idx);
                    }
                  }
                }}
              >
                {entry && (
                  <div
                    draggable={!entry.isLocked}
                    onDragStart={e => {
                      if (entry.isLocked) return;
                      e.dataTransfer.setData("from-assembly", "true");
                      e.dataTransfer.setData("piece-id", entry.id.toString());
                    }}
                    className="absolute inset-0"
                    style={{
                      ...getPieceStyle(entry.id),
                      opacity: entry.isLocked ? 1 : 0.93,
                      cursor: entry.isLocked ? "default" : "grab",
                      pointerEvents: entry.isLocked ? "none" : "auto"
                    }}
                    onDoubleClick={() => handleRemoveFromAssembly(idx)}
                    title={
                      entry.isLocked
                        ? "Piece locked in correct position"
                        : "Double click to return to staging area"
                    }
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
