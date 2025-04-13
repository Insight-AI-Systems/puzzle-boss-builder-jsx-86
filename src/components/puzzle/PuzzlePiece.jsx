
import React, { memo, useCallback } from 'react';

// Memoize the PuzzlePiece component to prevent re-renders when other pieces change
const PuzzlePiece = memo(({ piece, puzzleImage, gridSize, setDraggedPiece, playSound, onDrop }) => {
  // Calculate positioning for puzzle pieces - memoize style calculations
  const pieceStyle = {
    width: `${100 / gridSize}%`,
    height: `${100 / gridSize}%`,
    top: `${piece.currentPosition.row * (100 / gridSize)}%`,
    left: `${piece.currentPosition.col * (100 / gridSize)}%`,
    backgroundImage: `url(${puzzleImage})`,
    backgroundSize: `${gridSize * 100}%`,
    backgroundPosition: `${-(piece.correctPosition.col * 100) / gridSize}% ${-(piece.correctPosition.row * 100) / gridSize}%`
  };

  // Memoize drag handler to prevent recreation on each render
  const handleDragStart = useCallback((e) => {
    setDraggedPiece(piece);
    playSound('pick');
    
    // Set ghost drag image (empty for better UX)
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
  }, [piece, playSound, setDraggedPiece]);

  return (
    <div
      className="absolute transition-all duration-200 cursor-move hover:brightness-110 hover:scale-[1.02] active:scale-105 active:z-10"
      style={pieceStyle}
      draggable
      onDragStart={handleDragStart}
      onDrop={onDrop}
    />
  );
});

// Display name for debugging
PuzzlePiece.displayName = 'PuzzlePiece';

export default PuzzlePiece;
