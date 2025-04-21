
import React, { useState, useEffect } from 'react';
import { PuzzleBoard } from './components/PuzzleBoard';
import { PuzzleControls } from './components/PuzzleControls';
import { useGameState } from './hooks/useGameState';
import { usePuzzleImagePreload } from '../hooks/usePuzzleImagePreload';
import { usePuzzleConfetti } from './hooks/usePuzzleConfetti';
import { usePuzzleTimer } from '../usePuzzleTimer';
import FirstMoveOverlay from '../FirstMoveOverlay';
import { PuzzleCompleteBanner } from '../components/PuzzleCompleteBanner';
import { PuzzleTimerDisplay } from '../components/PuzzleTimerDisplay';
import './styles/puzzle-boss.css';

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
  // Initialize game state with the puzzle configuration
  const {
    pieces,
    groups,
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
    movePiece,
    snapPieces,
    isPieceCorrect,
    pickUpPiece,
    dropPiece
  } = useGameState(rows, columns, imageUrl);

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
  const handleImageLoad = React.useCallback(() => {
    console.log('PuzzleBossEngine: Image loaded successfully:', imageUrl);
    setIsLoading(false);
    resetPuzzle();
    resetTimer();
    setElapsed(0);
    setHasStarted(false);
    setSolveTime(null);
  }, [setIsLoading, resetPuzzle, resetTimer, setElapsed, setHasStarted, setSolveTime, imageUrl]);

  const handleImageError = React.useCallback((error: unknown) => {
    console.error('PuzzleBossEngine: Error loading puzzle image:', error);
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
  const handleFirstMove = React.useCallback(() => {
    if (!hasStarted && !isComplete) {
      setHasStarted(true);
      startTimer();
      setStartTime(Date.now());
    }
  }, [hasStarted, isComplete, setHasStarted, startTimer, setStartTime]);

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
  const handleReset = React.useCallback(() => {
    resetPuzzle();
    resetTimer();
    setElapsed(0);
    setHasStarted(false);
    setSolveTime(null);
    setStartTime(null);
  }, [resetPuzzle, resetTimer, setElapsed, setHasStarted, setSolveTime, setStartTime]);

  return (
    <div className="puzzle-boss-container flex flex-col items-center justify-center h-full">
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
      <div className="puzzle-boss-board-container relative">
        {confettiContainer}
        <FirstMoveOverlay show={!hasStarted && !isLoading && !isComplete} onFirstMove={handleFirstMove} />
        
        {isLoading ? (
          <div className="puzzle-boss-loading flex items-center justify-center bg-background/50 z-20 absolute inset-0">
            <span className="ml-2">Loading puzzle...</span>
          </div>
        ) : (
          <PuzzleBoard
            imageUrl={imageUrl}
            pieces={pieces}
            rows={rows}
            columns={columns}
            onPieceDrop={dropPiece}
            onPiecePickup={pickUpPiece}
            isPieceCorrect={isPieceCorrect}
            showGuideImage={showGuideImage}
            onDragStart={handleFirstMove}
          />
        )}
      </div>

      {/* Completion Banner */}
      <PuzzleCompleteBanner solveTime={solveTime} />

      {/* Engine Info */}
      <div className="mt-4 text-sm text-muted-foreground">
        <p className="font-medium">Engine: Puzzle Boss Master</p>
        <p className="text-xs">Difficulty: {rows}x{columns}</p>
        <p className="text-xs">{showGuideImage ? 'Guide image enabled' : 'Guide image disabled'}</p>
      </div>
    </div>
  );
};

export default React.memo(PuzzleBossEngine);
