
import React, { useState, useRef } from 'react';

interface PuzzlePiece {
  id: number;
  position: number;
  originalPosition: number;
  isDragging: boolean;
  isHinted?: boolean;
}

interface PuzzleBoardProps {
  imageUrl: string;
  pieces: PuzzlePiece[];
  rows: number;
  columns: number;
  onPieceDrop: (id: number, position: number) => void;
  onPiecePickup: (id: number) => void;
  isPieceCorrect: (id: number) => boolean;
  showGuideImage: boolean;
  onDragStart: () => void;
}

export const PuzzleBoard: React.FC<PuzzleBoardProps> = ({
  imageUrl,
  pieces,
  rows,
  columns,
  onPieceDrop,
  onPiecePickup,
  isPieceCorrect,
  showGuideImage,
  onDragStart
}) => {
  const [draggedPieceId, setDraggedPieceId] = useState<number | null>(null);
  const [highlightedPosition, setHighlightedPosition] = useState<number | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  
  // Set up board styles
  const boardStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden'
  };
  
  // Handle drag start
  const handlePieceDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
    onDragStart();
    e.dataTransfer.setData('puzzle-piece-id', id.toString());
    setDraggedPieceId(id);
    onPiecePickup(id);
  };
  
  // Handle drag end
  const handlePieceDragEnd = () => {
    setDraggedPieceId(null);
    setHighlightedPosition(null);
  };
  
  // Handle drag over cell
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    e.preventDefault();
    setHighlightedPosition(position);
  };
  
  // Handle drop on cell
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    e.preventDefault();
    const pieceId = Number(e.dataTransfer.getData('puzzle-piece-id'));
    if (!isNaN(pieceId)) {
      onPieceDrop(pieceId, position);
    }
    setHighlightedPosition(null);
    setDraggedPieceId(null);
  };
  
  // Create board cells
  const renderCells = () => {
    const cells = [];
    for (let i = 0; i < rows * columns; i++) {
      cells.push(
        <div
          key={`cell-${i}`}
          className={`puzzle-cell ${highlightedPosition === i ? 'highlight' : ''}`}
          style={{
            border: '1px dashed rgba(255,255,255,0.1)',
            position: 'relative',
            backgroundColor: highlightedPosition === i ? 'rgba(255,255,255,0.05)' : 'transparent'
          }}
          onDragOver={(e) => handleDragOver(e, i)}
          onDrop={(e) => handleDrop(e, i)}
        />
      );
    }
    return cells;
  };
  
  // Render pieces
  const renderPieces = () => {
    return pieces.map(piece => {
      const isCorrect = isPieceCorrect(piece.id);
      const isDragging = draggedPieceId === piece.id;
      const isHinted = piece.isHinted;
      
      // Calculate position on the board
      const row = Math.floor(piece.position / columns);
      const col = piece.position % columns;
      
      // Calculate background position based on original position
      const bgRow = Math.floor(piece.originalPosition / columns);
      const bgCol = piece.originalPosition % columns;
      
      // Calculate using percentages for better scaling
      const xPercent = (bgCol * 100) / (columns - 1);
      const yPercent = (bgRow * 100) / (rows - 1);
      
      const pieceStyle: React.CSSProperties = {
        width: `calc(100% / ${columns})`,
        height: `calc(100% / ${rows})`,
        position: 'absolute',
        top: `calc(${row} * 100% / ${rows})`,
        left: `calc(${col} * 100% / ${columns})`,
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: `${columns * 100}% ${rows * 100}%`,
        backgroundPosition: `${xPercent}% ${yPercent}%`,
        transform: isDragging ? 'scale(1.05)' : 'scale(1)',
        boxShadow: isDragging ? '0 5px 15px rgba(0,0,0,0.3)' : isHinted ? '0 0 10px 3px rgba(255, 215, 0, 0.8)' : 'none',
        zIndex: isDragging ? 10 : 1,
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        border: isCorrect ? '2px solid rgba(0, 255, 0, 0.6)' : isHinted ? '2px solid rgba(255, 215, 0, 0.8)' : '1px solid rgba(255, 255, 255, 0.1)',
        animation: isHinted ? 'pulse 1s infinite' : 'none'
      };
      
      return (
        <div
          key={`piece-${piece.id}`}
          className={`puzzle-piece ${isCorrect ? 'correct' : ''} ${isDragging ? 'dragging' : ''} ${isHinted ? 'hinted' : ''}`}
          style={pieceStyle}
          draggable={true}
          onDragStart={(e) => handlePieceDragStart(e, piece.id)}
          onDragEnd={handlePieceDragEnd}
        />
      );
    });
  };
  
  return (
    <div className="puzzle-board" style={boardStyle} ref={boardRef}>
      {showGuideImage && (
        <img 
          src={imageUrl} 
          alt="Puzzle guide" 
          className="puzzle-guide-image"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            opacity: 0.3,
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
      )}
      {renderCells()}
      {renderPieces()}
    </div>
  );
};

PuzzleBoard.displayName = 'PuzzleBoard';
