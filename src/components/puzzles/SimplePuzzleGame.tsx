
import React, { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSimplePuzzlePieces } from './hooks/useSimplePuzzlePieces';
import { usePuzzleState } from './hooks/usePuzzleState';
import { createPieceHandlers } from './utils/pieceInteractionHandlers';
import SimplePuzzleGrid from './components/SimplePuzzleGrid';
import SimplePuzzleControls from './components/SimplePuzzleControls';
import SimpleDirectionalControls from './components/SimpleDirectionalControls';
import PuzzleStatusMessage from './components/PuzzleStatusMessage';
import PuzzleStateDisplay from './components/PuzzleStateDisplay';
import { difficultyConfig } from './types/puzzle-types';

const SimplePuzzleGame: React.FC = () => {
  const isMobile = useIsMobile();
  const {
    pieces,
    setPieces,
    draggedPiece,
    setDraggedPiece,
    moveCount,
    setMoveCount,
    isSolved,
    handleShuffleClick
  } = useSimplePuzzlePieces();
  
  // New puzzle state management
  const puzzleState = usePuzzleState('3x3');
  
  const {
    handleDragStart,
    handleMove,
    handleDrop,
    handlePieceClick,
    handleDirectionalMove
  } = createPieceHandlers(
    pieces,
    setPieces,
    draggedPiece,
    setDraggedPiece,
    (count) => {
      setMoveCount(count);
      puzzleState.incrementMoves();
    },
    isSolved
  );
  
  // Start a new puzzle when shuffling
  const handleNewGame = () => {
    handleShuffleClick();
    puzzleState.startNewPuzzle(puzzleState.difficulty);
  };
  
  // Handle difficulty change
  const handleDifficultyChange = (difficulty: typeof puzzleState.difficulty) => {
    puzzleState.changeDifficulty(difficulty);
    // We don't automatically start a new game here to let user decide
  };
  
  // Check for puzzle completion
  useEffect(() => {
    if (isSolved && !puzzleState.isComplete) {
      const gridSize = difficultyConfig[puzzleState.difficulty].gridSize;
      puzzleState.checkCompletion(gridSize * gridSize, gridSize * gridSize);
    }
  }, [isSolved, puzzleState]);
  
  // Update correct pieces count
  useEffect(() => {
    if (!isSolved) {
      const correctCount = pieces.filter((piece, index) => {
        const pieceNumber = parseInt(piece.id.split('-')[1]);
        return pieceNumber === index;
      }).length;
      puzzleState.updateCorrectPieces(correctCount);
    }
  }, [pieces, isSolved, puzzleState]);
  
  // Total pieces based on difficulty
  const totalPieces = difficultyConfig[puzzleState.difficulty].gridSize ** 2;

  return (
    <div className="flex flex-col items-center">
      {/* New puzzle state display */}
      <PuzzleStateDisplay 
        state={{
          ...puzzleState,
          isComplete: isSolved // Use isSolved for completion status
        }}
        totalPieces={totalPieces}
        onNewGame={handleNewGame}
        onDifficultyChange={handleDifficultyChange}
        onTogglePause={puzzleState.togglePause}
      />
      
      <SimplePuzzleControls 
        moveCount={moveCount}
        onShuffle={handleNewGame}
      />
      
      <SimplePuzzleGrid 
        pieces={pieces}
        isSolved={isSolved}
        isMobile={isMobile}
        onDragStart={handleDragStart}
        onMove={handleMove}
        onDrop={handleDrop}
        onPieceClick={handlePieceClick}
      />
      
      <SimpleDirectionalControls 
        draggedPiece={draggedPiece}
        isSolved={isSolved}
        isMobile={isMobile}
        onDirectionalMove={(direction) => handleDirectionalMove(direction, 3)}
      />
      
      <PuzzleStatusMessage 
        isSolved={isSolved}
        isLoading={false}
        isMobile={!!isMobile}
        moveCount={moveCount}
      />
    </div>
  );
};

export default SimplePuzzleGame;
