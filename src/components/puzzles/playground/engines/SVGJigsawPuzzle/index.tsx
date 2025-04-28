
import React, { useState, useEffect } from 'react';
import { PuzzleBoard } from './components/PuzzleBoard';
import { PuzzleControls } from './components/PuzzleControls';
import { usePuzzleState } from './hooks/usePuzzleState';
import { useTimer } from '@/hooks/useTimer';
import { usePuzzleImagePreload } from '../hooks/usePuzzleImagePreload';
import { useToast } from '@/hooks/use-toast';
import './styles/svg-jigsaw.css';

interface SVGJigsawPuzzleProps {
  imageUrl: string;
  rows: number;
  columns: number;
  showNumbers?: boolean;
}

const SVGJigsawPuzzle: React.FC<SVGJigsawPuzzleProps> = ({
  imageUrl,
  rows = 3,
  columns = 3,
  showNumbers = false
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const { toast } = useToast();

  // Set up puzzle state
  const {
    pieces,
    isComplete,
    resetPuzzle,
    placePiece,
    isPieceCorrect,
    stagingPieces,
    boardPieces,
    movePieceToStaging,
    showGhost,
    toggleGhost,
    percentComplete
  } = usePuzzleState(rows, columns, imageUrl);

  // Set up timer
  const {
    elapsed,
    start: startTimer,
    stop: stopTimer,
    reset: resetTimer
  } = useTimer();

  // Handle first interaction to start timer
  const handleFirstInteraction = () => {
    if (!hasStarted && !isComplete) {
      startTimer();
      setHasStarted(true);
    }
  };

  // Handle puzzle completion
  useEffect(() => {
    if (isComplete && hasStarted) {
      stopTimer();
      toast({
        title: "Puzzle Completed! 🎉",
        description: `You solved it in ${Math.floor(elapsed / 60)}:${(elapsed % 60).toString().padStart(2, '0')}!`,
        variant: "default",
      });
    }
  }, [isComplete, hasStarted, elapsed, stopTimer, toast]);

  // Handle puzzle reset
  const handleReset = () => {
    resetPuzzle();
    resetTimer();
    setHasStarted(false);
  };

  // Preload image
  const { isLoaded } = usePuzzleImagePreload({
    imageUrl,
    onLoad: () => {
      setIsLoading(false);
    },
    onError: (error) => {
      console.error('Error loading puzzle image:', error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to load puzzle image.",
        variant: "destructive",
      });
    }
  });

  return (
    <div className="svg-jigsaw-puzzle w-full max-w-4xl mx-auto">
      {/* Controls section */}
      <PuzzleControls 
        elapsed={elapsed}
        isComplete={isComplete}
        onReset={handleReset}
        showGhost={showGhost}
        toggleGhost={toggleGhost}
        percentComplete={percentComplete}
      />

      <div className="mt-4 mb-4 relative">
        {isLoading ? (
          <div className="p-8 flex items-center justify-center bg-muted/20 rounded-lg min-h-[300px]">
            <p className="text-muted-foreground">Loading puzzle...</p>
          </div>
        ) : (
          <PuzzleBoard
            imageUrl={imageUrl}
            rows={rows}
            columns={columns}
            boardPieces={boardPieces}
            stagingPieces={stagingPieces}
            onPiecePlaced={placePiece}
            onPieceRemoved={movePieceToStaging}
            isPieceCorrect={isPieceCorrect}
            showGhost={showGhost}
            showNumbers={showNumbers}
            onFirstInteraction={handleFirstInteraction}
            isComplete={isComplete}
          />
        )}
      </div>

      {isComplete && (
        <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-lg text-center">
          <h3 className="text-green-800 font-bold text-xl">Puzzle Completed!</h3>
          <p className="text-green-700">Time: {Math.floor(elapsed / 60)}:{(elapsed % 60).toString().padStart(2, '0')}</p>
        </div>
      )}
    </div>
  );
};

export default SVGJigsawPuzzle;
