
import React, { useState, useCallback, useEffect } from 'react';
import { PuzzleBoard } from './components/PuzzleBoard';
import { PuzzleControls } from './components/PuzzleControls';
import { usePuzzleState } from './hooks/usePuzzleState';
import { usePuzzleTimer } from '../hooks/usePuzzleTimer';
import { usePuzzleImagePreload } from '../hooks/usePuzzleImagePreload';

interface CustomPuzzleEngineProps {
  imageUrl: string;
  rows: number;
  columns: number;
  showNumbers?: boolean;
}

const CustomPuzzleEngine: React.FC<CustomPuzzleEngineProps> = ({
  imageUrl,
  rows,
  columns,
  showNumbers = true // Default to showing numbers
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [draggedPiece, setDraggedPiece] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const {
    puzzlePieces,
    setPuzzlePieces,
    isComplete: puzzleIsComplete,
    showGuideImage,
    toggleGuideImage,
    resetPuzzle,
    placePiece,
    isPieceCorrect,
    shufflePieces
  } = usePuzzleState(rows, columns, imageUrl, false);

  const {
    elapsed,
    start: startTimer,
    stop: stopTimer,
    reset: resetTimer
  } = usePuzzleTimer();

  // When puzzle is completed
  useEffect(() => {
    if (puzzleIsComplete && !isComplete) {
      stopTimer();
      setIsComplete(true);
    }
  }, [puzzleIsComplete, stopTimer, isComplete]);

  // Handle first move
  const handleDragStart = useCallback(() => {
    startTimer();
  }, [startTimer]);

  // Handle image loading
  const { isLoaded } = usePuzzleImagePreload({
    imageUrl,
    onLoad: () => {
      setIsLoading(false);
    },
    onError: (error) => {
      console.error('Error loading puzzle image:', error);
      setIsLoading(false);
    }
  });

  // Handle reset
  const handleReset = useCallback(() => {
    resetPuzzle();
    resetTimer();
    setIsComplete(false);
  }, [resetPuzzle, resetTimer]);

  return (
    <div className="custom-puzzle-engine w-full max-w-3xl mx-auto">
      <PuzzleControls
        elapsed={elapsed}
        isComplete={isComplete}
        onReset={handleReset}
        showGuideImage={showGuideImage}
        onToggleGuideImage={toggleGuideImage}
        onShuffle={shufflePieces}
      />

      <div className="mt-4 mb-4 text-center">
        {isLoading ? (
          <div className="p-8 flex items-center justify-center">
            <p>Loading puzzle...</p>
          </div>
        ) : (
          <PuzzleBoard
            imageUrl={imageUrl}
            pieces={puzzlePieces}
            rows={rows}
            columns={columns}
            onPieceDrop={placePiece}
            isPieceCorrect={isPieceCorrect}
            showGuideImage={showGuideImage}
            showNumbers={showNumbers}
            onDragStart={handleDragStart}
            draggedPiece={draggedPiece}
            setDraggedPiece={setDraggedPiece}
          />
        )}
      </div>

      {isComplete && (
        <div className="mt-4 p-4 bg-puzzle-gold/10 border border-puzzle-gold rounded-lg text-center">
          <h3 className="text-puzzle-gold font-bold text-xl">Puzzle Completed!</h3>
          <p className="text-puzzle-gold/80">Time: {Math.floor(elapsed / 60)}:{(elapsed % 60).toString().padStart(2, '0')}</p>
        </div>
      )}
    </div>
  );
};

export default CustomPuzzleEngine;
