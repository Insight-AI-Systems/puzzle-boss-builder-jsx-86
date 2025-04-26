
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
import { useToast } from '@/hooks/use-toast';
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
  const [imageLoadError, setImageLoadError] = useState<string | null>(null);
  const { toast } = useToast();
  
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
      setImageLoadError(null);
    },
    onError: (error) => {
      console.error("Error loading puzzle image:", error);
      setImageLoadError(error.message);
      setIsLoading(false);
      
      toast({
        title: "Error loading puzzle image",
        description: "There was a problem loading the puzzle image. Try refreshing the page or use a different puzzle.",
        variant: "destructive"
      });
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
        {!hasStarted && !isComplete && !isLoading && !imageLoadError && (
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
        
        {imageLoadError && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 rounded-md">
            <div className="text-center p-4">
              <p className="text-red-400 font-medium">Failed to load puzzle image</p>
              <button 
                className="mt-4 bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-white px-3 py-2 rounded"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomPuzzleEngine;
