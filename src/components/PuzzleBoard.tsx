
import React, { useState, useEffect, useRef } from 'react';
import { usePuzzleState } from '../hooks/usePuzzleState';
import PuzzlePiece from './PuzzlePiece';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { useTimer } from '../hooks/useTimer';
import { PuzzleTimer } from './PuzzleTimer';

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
  
  // Track if the game has started
  const [hasStarted, setHasStarted] = useState(false);
  
  // Start timer on first move
  const handleFirstMove = () => {
    if (!hasStarted) {
      setHasStarted(true);
      start();
    }
  };

  // Stop timer on completion
  useEffect(() => {
    if (isComplete) {
      stop();
    }
  }, [isComplete, stop]);

  // Reset timer when puzzle is reset
  const handleReset = () => {
    reset();
    resetPuzzle();
    setHasStarted(false);
  };

  const [elapsedTime, setElapsedTime] = useState(0);

  // Update the board size based on container size
  useEffect(() => {
    const updateBoardSize = () => {
      if (boardRef.current) {
        const container = boardRef.current.parentElement;
        if (container) {
          const maxWidth = Math.min(container.clientWidth - 32, 600);
          const aspectRatio = 1; // Square puzzle for simplicity
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

  // Timer effect
  useEffect(() => {
    if (isComplete) return;

    const timer = setInterval(() => {
      setElapsedTime(getElapsedTime());
    }, 1000);

    return () => clearInterval(timer);
  }, [isComplete, getElapsedTime]);

  // Calculate completion percentage
  const completionPercentage = (pieces.filter(piece => piece.isCorrect).length / pieces.length) * 100;

  // Handle drag end and snapping logic
  const handleDragEnd = (id: string, position: number) => {
    endDragging(id);
    
    // For now, just placing the piece where user dropped it
    // In a real implementation, you'd check grid positions and snap
    const boardRect = boardRef.current?.getBoundingClientRect();
    if (boardRect) {
      // Simple snap to grid logic could be implemented here
      // For now, we're assuming the drop position is valid
      movePiece(id, position);
      
      // Start timer on first move
      if (!hasStarted) {
        handleFirstMove();
      }
    }
  };

  const stagingAreaPieces = pieces.filter(p => p.position === -1);
  const boardPieces = pieces.filter(p => p.position >= 0);

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4">
      {/* Status and Controls */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex flex-col w-full sm:w-2/3">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Progress: {Math.round(completionPercentage)}%</span>
            <span className="text-sm font-medium">Moves: {moves}</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>
        
        <div className="flex items-center space-x-4">
          <PuzzleTimer seconds={elapsed} />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReset}
            className="flex items-center"
          >
            <ArrowPathIcon className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Game Completed Message */}
      {isComplete && (
        <div className="w-full bg-green-100 border border-green-300 rounded-lg p-4 mb-6 flex items-center">
          <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
          <span className="text-green-800 font-medium">
            Puzzle completed in {moves} moves and {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}!
          </span>
        </div>
      )}

      {/* Puzzle Board and Pieces */}
      <div 
        ref={boardRef}
        className="relative bg-gray-100 rounded-lg shadow-inner border border-gray-300"
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
            className="absolute" 
            style={{ 
              top: `${Math.floor(piece.position / columns) * (boardSize.height / rows)}px`,
              left: `${(piece.position % columns) * (boardSize.width / columns)}px`
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

      {/* Staging Area */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 w-full overflow-x-auto">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Pieces</h3>
        <div className="flex flex-wrap gap-2 justify-center">
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
