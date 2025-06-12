
import React, { useState, useEffect, useCallback } from 'react';
import { usePuzzleState } from './hooks/usePuzzleState';
import { PuzzleControls } from './components/PuzzleControls';
import { PuzzleBoard } from './components/PuzzleBoard';

interface CustomPuzzleEngineProps {
  imageUrl: string;
  rows: number;
  columns: number;
  showNumbers?: boolean;
  onComplete?: (timeElapsedSeconds: number) => void;
  onReset?: () => void;
}

const CustomPuzzleEngine: React.FC<CustomPuzzleEngineProps> = ({
  imageUrl,
  rows,
  columns,
  showNumbers = false,
  onComplete,
  onReset
}) => {
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const {
    puzzlePieces,
    isComplete,
    showGuideImage,
    toggleGuideImage,
    resetPuzzle,
    placePiece,
    isPieceCorrect,
    shufflePieces,
    useHint,
    hintsUsed,
    maxHints
  } = usePuzzleState(rows, columns, imageUrl, false);

  // Timer effect
  useEffect(() => {
    if (!isComplete) {
      const timer = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [startTime, isComplete]);

  // Reset timer when puzzle resets
  const handleReset = useCallback(() => {
    resetPuzzle();
    setStartTime(Date.now());
    setElapsed(0);
    onReset?.();
  }, [resetPuzzle, onReset]);

  // Handle completion
  useEffect(() => {
    if (isComplete) {
      onComplete?.(elapsed);
    }
  }, [isComplete, elapsed, onComplete]);

  // Handle piece drop
  const handlePieceDrop = useCallback((id: number, position: number) => {
    placePiece(id, position);
  }, [placePiece]);

  // Handle piece pickup
  const handlePiecePickup = useCallback((id: number) => {
    console.log('Piece picked up:', id);
  }, []);

  // Handle drag start
  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full">
      <PuzzleControls
        elapsed={elapsed}
        isComplete={isComplete}
        onReset={handleReset}
        showGuideImage={showGuideImage}
        onToggleGuideImage={toggleGuideImage}
        onShuffle={shufflePieces}
        onHint={useHint}
        hintsRemaining={maxHints}
      />
      
      <div className="relative w-full aspect-square bg-muted/10 rounded-lg border border-border overflow-hidden">
        <PuzzleBoard
          imageUrl={imageUrl}
          pieces={puzzlePieces}
          rows={rows}
          columns={columns}
          onPieceDrop={handlePieceDrop}
          onPiecePickup={handlePiecePickup}
          isPieceCorrect={isPieceCorrect}
          showGuideImage={showGuideImage}
          onDragStart={handleDragStart}
        />
      </div>

      {isComplete && (
        <div className="text-center p-4 bg-green-100 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <h2 className="text-xl font-bold text-green-800 dark:text-green-200 mb-2">
            🎉 Puzzle Complete!
          </h2>
          <p className="text-green-700 dark:text-green-300">
            Completed in {Math.floor(elapsed / 60)}:{(elapsed % 60).toString().padStart(2, '0')}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            Hints used: {hintsUsed}
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomPuzzleEngine;
