
import React from 'react';
import PuzzleGrid from './components/PuzzleGrid';
import DirectionalControls from './components/DirectionalControls';
import PuzzleStatusMessage from './components/PuzzleStatusMessage';

const ImagePuzzleContainer = ({
  pieces,
  difficulty,
  isSolved,
  isLoading,
  containerSize,
  gridEvents,
  getPieceStyle,
  isTouchDevice,
  isMobile,
  draggedPiece,
  moveCount,
}) => (
  <>
    <PuzzleGrid
      pieces={pieces}
      difficulty={difficulty}
      isSolved={isSolved}
      isLoading={isLoading}
      containerSize={containerSize}
      onDragStart={gridEvents.handleGridDragStart}
      onMove={gridEvents.handleGridMove}
      onDrop={gridEvents.handleGridDrop}
      onPieceClick={gridEvents.handleGridPieceClick}
      getPieceStyle={getPieceStyle}
      isTouchDevice={isTouchDevice}
      isMobile={isMobile}
    />

    {(isTouchDevice || draggedPiece) && !isSolved && !isLoading && (
      <DirectionalControls 
        draggedPiece={draggedPiece}
        onDirectionalMove={gridEvents.handleDirectionalMove}
        isMobile={isMobile}
      />
    )}

    <PuzzleStatusMessage
      isSolved={isSolved}
      isLoading={isLoading}
      isMobile={isMobile}
      moveCount={moveCount}
      isTouchDevice={isTouchDevice}
    />
  </>
);

export default ImagePuzzleContainer;
