
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
}

const CustomPuzzleEngine: React.FC<CustomPuzzleEngineProps> = ({
  imageUrl,
  rows,
  columns,
  showGuideImage: initialShowGuideImage = true
}) => {
  // Initialize puzzle state and timer
  const {
    puzzlePieces,
    shufflePieces,
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
    setDraggedPiece
  } = usePuzzleState(rows, columns, imageUrl, initialShowGuideImage);

  // Set up timer
  const {
    elapsed,
    start: startTimer,
    stop: stopTimer,
    reset: resetTimer,
    startTime,
    setStartTime,
    setElapsed
  } = usePuzzleTimer();

  // Handle image loading with stable callback
  const handleImageLoad = useCallback(() => {
    console.log('Image loaded successfully:', imageUrl);
    setIsLoading(false);
    resetPuzzle();
    resetTimer();
    setElapsed(0);
    setHasStarted(false);
    setSolveTime(null);
  }, [setIsLoading, resetPuzzle, resetTimer, setElapsed, setHasStarted, setSolveTime, imageUrl]);

  const handleImageError = useCallback((error: unknown) => {
    console.error('Error loading puzzle image:', error);
    setIsLoading(false);
  }, [setIsLoading]);

  // Handle image loading
  usePuzzleImagePreload({
    imageUrl,
    onLoad: handleImageLoad,
    onError: handleImageError
  });

  // Set up confetti for puzzle completion
  const { confettiContainer, triggerConfetti } = usePuzzleConfetti();

  // Start the puzzle on first interaction
  const handleFirstMove = useCallback(() => {
    if (!hasStarted && !isComplete) {
      setHasStarted(true);
      startTimer();
      setStartTime(Date.now());
    }
  }, [hasStarted, isComplete, setHasStarted, startTimer, setStartTime]);

  // Handle puzzle completion - now stops the timer
  React.useEffect(() => {
    if (isComplete && hasStarted) {
      stopTimer();
      const endTime = Date.now();
      if (startTime) {
        const totalTime = (endTime - startTime) / 1000;
        setSolveTime(totalTime);
        setElapsed(Math.floor(totalTime));
        triggerConfetti();
      }
    }
  }, [isComplete, hasStarted, stopTimer, startTime, setSolveTime, setElapsed, triggerConfetti]);

  // Handle puzzle reset with memoized callback
  const handleReset = useCallback(() => {
    resetPuzzle();
    resetTimer();
    setElapsed(0);
    setHasStarted(false);
    setSolveTime(null);
    setStartTime(null);
  }, [resetPuzzle, resetTimer, setElapsed, setHasStarted, setSolveTime, setStartTime]);

  // Handle piece drop with memoized callback
  const handlePieceDrop = useCallback((id: number, position: number) => {
    handleFirstMove();
    placePiece(id, position);
  }, [handleFirstMove, placePiece]);

  return (
    <div className="custom-puzzle-container flex flex-col items-center justify-center h-full">
      {/* Timer & Controls */}
      <div className="flex items-center gap-3 mb-3 w-full justify-between max-w-xl">
        <PuzzleTimerDisplay seconds={elapsed} />
        <PuzzleControls 
          onReset={handleReset}
          onToggleGuide={toggleGuideImage}
          showGuideImage={showGuideImage}
        />
      </div>

      {/* Puzzle Board */}
      <div className="custom-puzzle-board-container relative">
        {confettiContainer}
        <FirstMoveOverlay show={!hasStarted && !isLoading && !isComplete} onFirstMove={handleFirstMove} />
        
        {isLoading ? (
          <div className="custom-puzzle-loading flex items-center justify-center bg-background/50 z-20 absolute inset-0">
            <span className="ml-2">Loading puzzle...</span>
          </div>
        ) : (
          <PuzzleBoard
            imageUrl={imageUrl}
            pieces={puzzlePieces}
            rows={rows}
            columns={columns}
            onPieceDrop={handlePieceDrop}
            isPieceCorrect={isPieceCorrect}
            showGuideImage={showGuideImage}
            onDragStart={handleFirstMove}
            draggedPiece={draggedPiece}
            setDraggedPiece={setDraggedPiece}
          />
        )}
      </div>

      {/* Completion Banner */}
      <PuzzleCompleteBanner solveTime={solveTime} />
    </div>
  );
};

export default React.memo(CustomPuzzleEngine);
