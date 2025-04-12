
import React from 'react';

const PuzzlePiece = ({ piece, puzzleImage, gridSize, draggedPiece, setDraggedPiece, playSound, onDrop }) => {
  // Calculate positioning for puzzle pieces
  const getPieceStyle = () => {
    const pieceWidth = 100 / gridSize;
    const pieceHeight = 100 / gridSize;
    
    // Correct background position to show the right part of the image
    const backgroundX = -(piece.correctPosition.col * 100) / gridSize;
    const backgroundY = -(piece.correctPosition.row * 100) / gridSize;
    
    return {
      width: `${pieceWidth}%`,
      height: `${pieceHeight}%`,
      top: `${piece.currentPosition.row * pieceHeight}%`,
      left: `${piece.currentPosition.col * pieceWidth}%`,
      backgroundImage: `url(${puzzleImage})`,
      backgroundSize: `${gridSize * 100}%`,
      backgroundPosition: `${backgroundX}% ${backgroundY}%`
    };
  };

  // Handle dragging piece
  const handleDragStart = (e) => {
    setDraggedPiece(piece);
    playSound('pick');
    
    // Set ghost drag image (empty for better UX)
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
  };

  return (
    <div
      className="absolute transition-all duration-200 cursor-move hover:brightness-110 hover:scale-[1.02] active:scale-105 active:z-10"
      style={getPieceStyle()}
      draggable
      onDragStart={handleDragStart}
      onDrop={(e) => onDrop(e, piece.currentPosition.row, piece.currentPosition.col)}
    />
  );
};

export default PuzzlePiece;
