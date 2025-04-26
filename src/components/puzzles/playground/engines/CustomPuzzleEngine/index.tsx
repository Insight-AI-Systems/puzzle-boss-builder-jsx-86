
import React, { useCallback, useEffect, useState } from 'react';
import { PuzzleBoard } from './components/PuzzleBoard';
import { PuzzleControls } from './components/PuzzleControls';
import { usePuzzleState } from './hooks/usePuzzleState';
import { usePuzzleConfetti } from './hooks/usePuzzleConfetti';
import { usePuzzleTimer } from '../hooks/usePuzzleTimer';
import { usePuzzleImagePreload } from '../hooks/usePuzzleImagePreload';
import FirstMoveOverlay from '../FirstMoveOverlay';
import { PuzzleCompleteBanner } from '../components/PuzzleCompleteBanner';
import { PuzzleTimerDisplay } from '../components/PuzzleTimerDisplay';
import { Loader2 } from 'lucide-react';
import './styles/custom-puzzle.css';

interface CustomPuzzleEngineProps {
  imageUrl: string;
  rows: number;
  columns: number;
  showGuideImage?: boolean;
  showNumbers?: boolean;
  onComplete?: (solveTime: number) => void;
  onReset?: () => void;
}

const CustomPuzzleEngine: React.FC<CustomPuzzleEngineProps> = ({
  imageUrl,
  rows,
  columns,
  showGuideImage: initialShowGuideImage = true,
  showNumbers = true,
  onComplete,
  onReset
}) => {
  const [draggedPiece, setDraggedPiece] = useState<number | null>(null);
  const [solveTime, setSolveTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  
  useEffect(() => {
    console.log("CustomPuzzleEngine initialized with:", { 
      imageUrl, rows, columns, showNumbers
    });
  }, [imageUrl, rows, columns, showNumbers]);
  
  const {
    puzzlePieces,
    placePiece,
    isComplete,
    isPieceCorrect,
    resetPuzzle,
    toggleGuideImage,
    showGuideImage,
    shufflePieces
  } = usePuzzleState(rows, columns, imageUrl, initialShowGuideImage);

  const {
    elapsed,
    isRunning,
    start: startTimer,
    stop: stopTimer,
    reset: resetTimer
  } = usePuzzleTimer();

  const { isLoaded } = usePuzzleImagePreload({
    imageUrl,
    onLoad: () => {
      console.log("Image loaded successfully in CustomPuzzleEngine:", imageUrl);
      setIsLoading(false);
    },
    onError: (error) => {
      console.error("Error loading puzzle image:", error);
      setIsLoading(false);
    }
  });

  usePuzzleConfetti(isComplete);

  const handleFirstMove = useCallback(() => {
    if (!hasStarted) {
      console.log("First move detected, starting game");
      setHasStarted(true);
      startTimer();
    }
  }, [hasStarted, startTimer]);

  useEffect(() => {
    if (isComplete && !solveTime) {
      console.log("Puzzle completed, stopping timer");
      stopTimer();
      const completionTime = elapsed;
      console.log(`Puzzle completed in ${completionTime} seconds!`);
      setSolveTime(completionTime);
      
      if (onComplete) {
        onComplete(completionTime);
      }
    }
  }, [isComplete, solveTime, elapsed, stopTimer, onComplete]);

  const handleReset = useCallback(() => {
    console.log("Resetting puzzle");
    resetPuzzle();
    resetTimer();
    setSolveTime(null);
    setHasStarted(false);
    
    if (onReset) {
      onReset();
    }
  }, [resetPuzzle, resetTimer, onReset]);

  console.log("CustomPuzzleEngine rendering with:", { 
    imageUrl, rows, columns, puzzlePiecesCount: puzzlePieces.length 
  });

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
          showNumbers={showNumbers}
          onDragStart={handleFirstMove}
          draggedPiece={draggedPiece}
          setDraggedPiece={setDraggedPiece}
        />
        
        {isComplete && solveTime !== null && (
          <PuzzleCompleteBanner solveTime={solveTime} />
        )}
        
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 rounded-md">
            <div className="text-center">
              <Loader2 className="animate-spin h-8 w-8 mx-auto text-puzzle-aqua" />
              <p className="mt-2 text-puzzle-white">Loading puzzle...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomPuzzleEngine;
