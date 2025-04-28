
import React, { useState, useEffect, useRef } from 'react';
import { usePuzzleState } from '../hooks/usePuzzleState';
import PuzzlePiece from './PuzzlePiece';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { useTimer } from '../hooks/useTimer';
import { PuzzleTimer } from './PuzzleTimer';
import { useToast } from '@/hooks/use-toast';
import { ToastProvider } from '@/components/providers/ToastProvider';

interface PuzzleBoardProps {
  imageUrl: string;
  rows?: number;
  columns?: number;
}

const PuzzleBoard: React.FC<PuzzleBoardProps> = ({
  imageUrl,
  rows = 3,
  columns = 3,
}) => {
  const [boardSize, setBoardSize] = useState({ width: 600, height: 600 });
  const boardRef = useRef<HTMLDivElement>(null);
  const {
    pieces,
    isComplete,
    moves,
    startDragging,
    movePiece,
    endDragging,
    resetPuzzle,
    getElapsedTime
  } = usePuzzleState(rows, columns);

  const { elapsed, start, stop, reset } = useTimer();
  const [hasStarted, setHasStarted] = useState(false);

  const handleFirstMove = () => {
    if (!hasStarted) {
      setHasStarted(true);
      start();
    }
  };

  useEffect(() => {
    if (isComplete) {
      stop();
    }
  }, [isComplete, stop]);

  const handleReset = () => {
    reset();
    resetPuzzle();
    setHasStarted(false);
  };

  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const updateBoardSize = () => {
      if (boardRef.current) {
        const container = boardRef.current.parentElement;
        if (container) {
          // More responsive sizing based on screen width
          const screenWidth = window.innerWidth;
          let maxWidth;
          
          if (screenWidth < 640) { // sm
            maxWidth = Math.min(screenWidth - 32, 400); // Smaller on mobile
          } else if (screenWidth < 768) { // md
            maxWidth = Math.min(screenWidth - 48, 500);
          } else {
            maxWidth = Math.min(container.clientWidth - 32, 600);
          }
          
          const aspectRatio = 1;
          setBoardSize({
            width: maxWidth,
            height: maxWidth * aspectRatio
          });
        }
      }
    };

    updateBoardSize();
    window.addEventListener('resize', updateBoardSize);
    return () => window.removeEventListener('resize', updateBoardSize);
  }, []);

  useEffect(() => {
    if (isComplete) return;

    const timer = setInterval(() => {
      setElapsedTime(getElapsedTime());
    }, 1000);

    return () => clearInterval(timer);
  }, [isComplete, getElapsedTime]);

  const completionPercentage = (pieces.filter(piece => piece.isCorrect).length / pieces.length) * 100;

  const handleDragEnd = (id: string, position: number) => {
    endDragging(id);
    
    const boardRect = boardRef.current?.getBoundingClientRect();
    if (boardRect) {
      movePiece(id, position);
      
      if (!hasStarted) {
        handleFirstMove();
      }
    }
  };

  const stagingAreaPieces = pieces.filter(p => p.position === -1);
  const boardPieces = pieces.filter(p => p.position >= 0);

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-2 sm:p-4">
      <div className="w-full flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 space-y-4 sm:space-y-0">
        <div className="flex flex-col w-full sm:w-2/3">
          <div className="flex justify-between mb-2">
            <span className="text-xs sm:text-sm font-medium">Progress: {Math.round(completionPercentage)}%</span>
            <span className="text-xs sm:text-sm font-medium">Moves: {moves}</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <PuzzleTimer seconds={elapsed} />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReset}
            className="flex items-center text-xs sm:text-sm"
          >
            <ArrowPathIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {isComplete && (
        <div className="w-full bg-green-100 border border-green-300 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 flex items-center">
          <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mr-2" />
          <span className="text-green-800 font-medium text-sm sm:text-base">
            Puzzle completed in {moves} moves and {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}!
          </span>
        </div>
      )}

      <div 
        ref={boardRef}
        className="relative bg-gray-100 rounded-lg shadow-inner border border-gray-300 touch-none"
        style={{ 
          width: boardSize.width, 
          height: boardSize.height,
          backgroundImage: isComplete ? `url(${imageUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {!isComplete && boardPieces.map(piece => (
          <div 
            key={piece.id} 
            className="absolute touch-none" 
            style={{ 
              top: `${Math.floor(piece.position / columns) * (boardSize.height / rows)}px`,
              left: `${(piece.position % columns) * (boardSize.width / columns)}px`,
              width: `${boardSize.width / columns}px`,
              height: `${boardSize.height / rows}px`
            }}
          >
            <PuzzlePiece
              piece={piece}
              rows={rows}
              columns={columns}
              containerWidth={boardSize.width}
              containerHeight={boardSize.height}
              imageUrl={imageUrl}
              onDragStart={startDragging}
              onDragEnd={handleDragEnd}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200 w-full overflow-x-auto">
        <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Pieces</h3>
        <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
          {stagingAreaPieces.map(piece => (
            <div key={piece.id} className="relative">
              <PuzzlePiece
                piece={piece}
                rows={rows}
                columns={columns}
                containerWidth={boardSize.width}
                containerHeight={boardSize.height}
                imageUrl={imageUrl}
                onDragStart={startDragging}
                onDragEnd={handleDragEnd}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PuzzleBoard;
