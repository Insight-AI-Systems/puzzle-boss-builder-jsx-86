
import React, { useCallback } from 'react';
import { PuzzleBoard } from './components/PuzzleBoard';
import { PuzzleControls } from './components/PuzzleControls';
import { usePuzzleState } from './hooks/usePuzzleState';
import { usePuzzleConfetti } from './hooks/usePuzzleConfetti';
import { usePuzzleTimer } from '../usePuzzleTimer';
import { usePuzzleImagePreload } from '../hooks/usePuzzleImagePreload';
import FirstMoveOverlay from '../FirstMoveOverlay';
import { PuzzleCompleteBanner } from '../components/PuzzleCompleteBanner';
import { PuzzleTimerDisplay } from '../components/PuzzleTimerDisplay';
import './styles/custom-puzzle.css';

interface CustomPuzzleEngineProps {
  imageUrl: string;
  rows: number;
  columns: number;
  showGuideImage?: boolean;
  onComplete?: (solveTime: number) => void;
}

const CustomPuzzleEngine: React.FC<CustomPuzzleEngineProps> = ({
  imageUrl,
  rows,
  columns,
  showGuideImage: initialShowGuideImage = true,
  onComplete
}) => {
  // Initialize puzzle state and timer
  const {
    puzzlePieces,
    placePiece,
    isComplete,
    isPieceCorrect,
    resetPuzzle,
    isLoading,
    setIsLoading,
    hasStarted,
    setHasStarted,
    toggleGuideImage,
    showGuideImage,
    solveTime,
    setSolveTime,
    draggedPiece,
    setDraggedPiece,
    shufflePieces
  } = usePuzzleState(rows, columns, imageUrl, initialShowGuideImage);

  // Initialize timer
  const {
    elapsed,
    isRunning,
    start: startTimer,
    stop: stopTimer,
    reset: resetTimer
  } = usePuzzleTimer();

  // Trigger confetti effect on puzzle completion
  usePuzzleConfetti(isComplete);

  // Preload puzzle image
  usePuzzleImagePreload({
    imageUrl,
    onLoad: () => {
      setIsLoading(false);
    },
    onError: (error) => {
      console.error("Error loading puzzle image:", error);
      setIsLoading(false);
    }
  });

  // Handle first piece drag/move
  const handleFirstMove = useCallback(() => {
    if (!hasStarted) {
      setHasStarted(true);
      startTimer();
    }
  }, [hasStarted, setHasStarted, startTimer]);

  // Handle puzzle completion
  React.useEffect(() => {
    if (isComplete && !solveTime) {
      stopTimer();
      const completionTime = elapsed;
      console.log(`Puzzle completed in ${completionTime} seconds!`);
      setSolveTime(completionTime);
      
      if (onComplete) {
        onComplete(completionTime);
      }
    }
  }, [isComplete, solveTime, elapsed, stopTimer, setSolveTime, onComplete]);

  // Handle puzzle reset
  const handleReset = useCallback(() => {
    resetPuzzle();
    resetTimer();
  }, [resetPuzzle, resetTimer]);

  // Log showGuideImage value for debugging
  React.useEffect(() => {
    console.log("CustomPuzzleEngine - showGuideImage:", showGuideImage);
  }, [showGuideImage]);

  return (
    <div className="custom-puzzle-engine">
      <div className="puzzle-controls-container flex justify-between items-center mb-3">
        <PuzzleTimerDisplay seconds={elapsed} />
        <PuzzleControls
          onReset={handleReset}
          onToggleGuide={toggleGuideImage}
          showGuideImage={showGuideImage}
        />
      </div>

      <div className="puzzle-board-container relative">
        {!hasStarted && !isComplete && !isLoading && (
          <FirstMoveOverlay show={true} onFirstMove={handleFirstMove} />
        )}
        
        <PuzzleBoard
          imageUrl={imageUrl}
          pieces={puzzlePieces}
          rows={rows}
          columns={columns}
          onPieceDrop={placePiece}
          isPieceCorrect={isPieceCorrect}
          showGuideImage={showGuideImage}
          onDragStart={handleFirstMove}
          draggedPiece={draggedPiece}
          setDraggedPiece={setDraggedPiece}
        />
        
        {isComplete && solveTime !== null && (
          <PuzzleCompleteBanner solveTime={solveTime} />
        )}
      </div>
    </div>
  );
};

export default CustomPuzzleEngine;
