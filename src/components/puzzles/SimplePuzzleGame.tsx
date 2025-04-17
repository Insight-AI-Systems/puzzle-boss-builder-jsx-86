
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSimplePuzzlePieces } from './hooks/useSimplePuzzlePieces';
import { createSimplePieceHandlers } from './utils/simplePieceInteractionHandlers';
import SimplePuzzleGrid from './components/SimplePuzzleGrid';
import SimplePuzzleControls from './components/SimplePuzzleControls';
import SimpleDirectionalControls from './components/SimpleDirectionalControls';
import PuzzleStatusMessage from './components/PuzzleStatusMessage';

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

  const {
    handleDragStart,
    handleMove,
    handleDrop,
    handlePieceClick,
    handleDirectionalMove
  } = createSimplePieceHandlers(
    pieces,
    setPieces,
    draggedPiece,
    setDraggedPiece,
    setMoveCount,
    isSolved
  );

  return (
    <div className="flex flex-col items-center">
      <SimplePuzzleControls 
        moveCount={moveCount}
        onShuffle={handleShuffleClick}
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
        onDirectionalMove={(direction) => handleDirectionalMove(direction)}
      />
      
      <PuzzleStatusMessage 
        isSolved={isSolved}
        isLoading={false}
        isMobile={isMobile}
        moveCount={moveCount}
      />
    </div>
  );
};

export default SimplePuzzleGame;
