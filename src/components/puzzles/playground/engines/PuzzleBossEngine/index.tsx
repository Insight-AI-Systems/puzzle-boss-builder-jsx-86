
import React, { useCallback } from 'react';
import { useGameState } from './hooks/useGameState';
import StagingArea from './components/StagingArea';
import AssemblyArea from './components/AssemblyArea';

interface PuzzleBossEngineProps {
  imageUrl: string;
  rows: number;
  columns: number;
}

const PuzzleBossEngine: React.FC<PuzzleBossEngineProps> = ({
  imageUrl,
  rows,
  columns
}) => {
  const {
    allPieces,
    stagedPieces,
    setStagedPieces,
    assembly,
    setAssembly,
    isComplete,
    isLoading,
    setIsLoading,
    hasStarted,
    setHasStarted,
    showGuideImage,
    toggleGuideImage,
    solveTime,
    setSolveTime,
    resetPuzzle,
    placePiece,
    removePieceFromAssembly,
    shufflePieces,
    isPieceCorrect
  } = useGameState(rows, columns, imageUrl);

  // Drag from staging
  const handleStagingDragStart = useCallback((pieceId: number) => {
    if (!hasStarted) {
      setHasStarted(true);
    }
  }, [hasStarted, setHasStarted]);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {/* Timer, Controls, etc could be added here */}
      <StagingArea
        pieces={allPieces}
        stagedPieceIds={stagedPieces}
        imageUrl={imageUrl}
        rows={rows}
        columns={columns}
        onPieceDragStart={handleStagingDragStart}
      />
      <div className="mt-2 mb-2 text-muted-foreground font-medium">Drag pieces from the staging area onto the board grid below.</div>
      <AssemblyArea
        pieces={allPieces}
        assembly={assembly}
        imageUrl={imageUrl}
        rows={rows}
        columns={columns}
        onPieceDrop={placePiece}
        onPieceRemove={removePieceFromAssembly}
      />
      {/* Completion Banner, Timer, HUD, etc. */}
      {isComplete && (
        <div className="mt-4 text-puzzle-gold font-bold animate-pulse">
          Puzzle Complete!
        </div>
      )}
    </div>
  );
};

export default PuzzleBossEngine;
