import React, { useState, useEffect, useRef } from 'react';
import { usePuzzleState } from '../hooks/usePuzzleState';
import { usePuzzleSaveState } from '../hooks/usePuzzleSaveState';
import { ResumeGameDialog } from './puzzles/ResumeGameDialog';
import { GameProgress } from './puzzles/components/GameProgress';
import { StagingArea } from './puzzles/components/StagingArea';
import { usePuzzleBoardSize } from './puzzles/hooks/usePuzzleBoardSize';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useTimer } from '../hooks/useTimer';
import { useToast } from '@/hooks/use-toast';
import PuzzlePiece from './PuzzlePiece';

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
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const autoSaveIntervalRef = useRef<number>();
  const boardRef = useRef<HTMLDivElement>(null);
  const [draggedPieceId, setDraggedPieceId] = useState<string | null>(null);
  
  const {
    pieces,
    isComplete,
    moves,
    startDragging,
    movePiece,
    endDragging,
    resetPuzzle,
    getElapsedTime,
    loadSavedState
  } = usePuzzleState(rows, columns);

  const { elapsed, start, stop, reset, setElapsed } = useTimer();
  const [hasStarted, setHasStarted] = useState(false);
  const boardSize = usePuzzleBoardSize(boardRef);

  const { hasSavedState, saveState, loadState, clearSavedState } = usePuzzleSaveState(imageUrl);

  useEffect(() => {
    if (hasSavedState) {
      setShowResumeDialog(true);
    }
  }, [hasSavedState]);

  const handleResume = () => {
    const savedState = loadState();
    if (savedState) {
      loadSavedState(savedState);
      setElapsed(savedState.timeSpent || 0);
      setHasStarted(true);
      start();
    }
    setShowResumeDialog(false);
  };

  const handleNewGame = () => {
    clearSavedState();
    resetPuzzle();
    reset();
    setHasStarted(false);
    setShowResumeDialog(false);
  };

  useEffect(() => {
    if (hasStarted && !isComplete) {
      autoSaveIntervalRef.current = window.setInterval(() => {
        saveState({
          pieces,
          isComplete,
          moves,
          timeSpent: elapsed,
          startTime: null,
          endTime: null
        });
      }, 5000);
    }

    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [hasStarted, isComplete, pieces, moves, elapsed, saveState]);

  useEffect(() => {
    if (isComplete) {
      clearSavedState();
    }
  }, [isComplete, clearSavedState]);

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

  const handleBoardKeyDown = (e: React.KeyboardEvent) => {
    if (!draggedPieceId) return;
    
    const currentPiece = pieces.find(p => p.id === draggedPieceId);
    if (!currentPiece) return;
    
    const currentPosition = currentPiece.position;
    let newPosition = currentPosition;

    switch(e.key) {
      case 'ArrowLeft':
        if (currentPosition % columns > 0) {
          newPosition = currentPosition - 1;
        }
        break;
      case 'ArrowRight':
        if (currentPosition % columns < columns - 1) {
          newPosition = currentPosition + 1;
        }
        break;
      case 'ArrowUp':
        if (currentPosition >= columns) {
          newPosition = currentPosition - columns;
        }
        break;
      case 'ArrowDown':
        if (currentPosition < (rows * columns) - columns) {
          newPosition = currentPosition + columns;
        }
        break;
      case 'Enter':
      case ' ':
        movePiece(draggedPieceId, currentPosition);
        setDraggedPieceId(null);
        break;
      case 'Escape':
        setDraggedPieceId(null);
        break;
      default:
        return;
    }
    
    if (newPosition !== currentPosition) {
      movePiece(draggedPieceId, newPosition);
    }
  };

  const completionPercentage = (pieces.filter(piece => piece.isCorrect).length / pieces.length) * 100;
  const stagingAreaPieces = pieces.filter(p => p.position === -1);
  const boardPieces = pieces.filter(p => p.position >= 0);

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-2 sm:p-4">
      <ResumeGameDialog
        open={showResumeDialog}
        onResume={handleResume}
        onNewGame={handleNewGame}
      />
      
      <GameProgress 
        completionPercentage={completionPercentage}
        moves={moves}
        elapsed={elapsed}
        onReset={handleReset}
      />

      {isComplete && (
        <div className="w-full bg-green-100 border border-green-300 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 flex items-center">
          <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mr-2" />
          <span className="text-green-800 font-medium text-sm sm:text-base">
            Puzzle completed in {moves} moves and {Math.floor(getElapsedTime() / 60)}:{(getElapsedTime() % 60).toString().padStart(2, '0')}!
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
        role="grid"
        aria-label="Puzzle Board"
        onKeyDown={handleBoardKeyDown}
        tabIndex={-1}
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
            role="gridcell"
            aria-colindex={(piece.position % columns) + 1}
            aria-rowindex={Math.floor(piece.position / columns) + 1}
            data-position={piece.position}
          >
            <PuzzlePiece
              piece={piece}
              rows={rows}
              columns={columns}
              containerWidth={boardSize.width}
              containerHeight={boardSize.height}
              imageUrl={imageUrl}
              onDragStart={(id) => {
                startDragging(id);
                setDraggedPieceId(id);
              }}
              onDragEnd={(id, position) => {
                endDragging(id);
                movePiece(id, position);
                setDraggedPieceId(null);
                if (!hasStarted) {
                  setHasStarted(true);
                  start();
                }
              }}
            />
          </div>
        ))}
      </div>

      <StagingArea
        pieces={stagingAreaPieces}
        rows={rows}
        columns={columns}
        containerWidth={boardSize.width}
        containerHeight={boardSize.height}
        imageUrl={imageUrl}
        onDragStart={(id) => {
          startDragging(id);
          setDraggedPieceId(id);
        }}
        onDragEnd={(id, position) => {
          endDragging(id);
          movePiece(id, position);
          setDraggedPieceId(null);
          if (!hasStarted) {
            setHasStarted(true);
            start();
          }
        }}
      />
    </div>
  );
};

export default PuzzleBoard;
