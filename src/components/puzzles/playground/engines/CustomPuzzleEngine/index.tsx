
import React from 'react';
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
}

const CustomPuzzleEngine: React.FC<CustomPuzzleEngineProps> = ({
  imageUrl,
  rows,
  columns
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
  } = usePuzzleState(rows, columns, imageUrl);

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

  // Handle image loading
  usePuzzleImagePreload({
    imageUrl,
    onLoad: () => {
      console.log('Image loaded successfully:', imageUrl);
      setIsLoading(false);
      resetPuzzle();
      resetTimer();
      setElapsed(0);
      setHasStarted(false);
      setSolveTime(null);
    },
    onError: (error) => {
      console.error('Error loading puzzle image:', error);
      setIsLoading(false);
    }
  });

  // Set up confetti for puzzle completion
  const { confettiContainer, triggerConfetti } = usePuzzleConfetti();

  // Start the puzzle on first interaction
  const handleFirstMove = () => {
    if (!hasStarted && !isComplete) {
      setHasStarted(true);
      startTimer();
      setStartTime(Date.now());
    }
  };

  // Handle puzzle completion
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

  // Handle puzzle reset
  const handleReset = () => {
    resetPuzzle();
    resetTimer();
    setElapsed(0);
    setHasStarted(false);
    setSolveTime(null);
    setStartTime(null);
  };

  return (
    <div className="custom-puzzle-container flex flex-col items-center justify-center h-full">
      {/* Timer & Controls */}
      <div className="flex items-center gap-3 mb-3 w-full justify-between max-w-xl">
        <PuzzleTimerDisplay seconds={elapsed} />
        <PuzzleControls 
          onReset={handleReset}
          onToggleGuide={() => toggleGuideImage()}
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
            onPieceDrop={(id, position) => {
              handleFirstMove();
              placePiece(id, position);
            }}
            isPieceCorrect={isPieceCorrect}
            showGuideImage={showGuideImage}
            onDragStart={() => handleFirstMove()}
            draggedPiece={draggedPiece}
            setDraggedPiece={setDraggedPiece}
          />
        )}
      </div>

      {/* Completion Banner */}
      <PuzzleCompleteBanner solveTime={solveTime} />

      {/* Engine Info */}
      <div className="mt-4 text-sm text-muted-foreground">
        <p className="font-medium">Engine: Custom Lovable Puzzle</p>
        <p className="text-xs">Difficulty: {rows}x{columns}</p>
        <p className="text-xs">{showGuideImage ? 'Guide image enabled' : 'Guide image disabled'}</p>
      </div>
    </div>
  );
};

export default CustomPuzzleEngine;
