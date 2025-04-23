
import React, { useState, useEffect, useRef } from 'react';
import { PuzzlePiece } from '../hooks/usePuzzleState';
import { PuzzleTile } from './PuzzleTile';

interface PuzzleBoardProps {
  imageUrl: string;
  pieces: PuzzlePiece[];
  rows: number;
  columns: number;
  onPieceDrop: (id: number, position: number) => void;
  isPieceCorrect: (id: number) => boolean;
  showGuideImage: boolean;
  onDragStart: () => void;
  draggedPiece: number | null;
  setDraggedPiece: (id: number | null) => void;
}

export const PuzzleBoard: React.FC<PuzzleBoardProps> = React.memo(({
  imageUrl,
  pieces,
  rows,
  columns,
  onPieceDrop,
  isPieceCorrect,
  showGuideImage,
  onDragStart,
  draggedPiece,
  setDraggedPiece
}) => {
  const [highlightedPosition, setHighlightedPosition] = useState<number | null>(null);
  const prevImageUrl = useRef(imageUrl);
  
  // Reset highlighted position when image changes
  useEffect(() => {
    if (prevImageUrl.current !== imageUrl) {
      setHighlightedPosition(null);
      prevImageUrl.current = imageUrl;
    }
  }, [imageUrl]);
  
  // Set up grid dimensions
  const containerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    gap: '1px',
    width: '100%',
    maxWidth: '500px',
    aspectRatio: '1/1',
    position: 'relative',
    background: '#333',
    border: '2px solid #444',
    borderRadius: '8px',
    overflow: 'hidden'
  };
  
  // Log showGuideImage changes for debugging
  useEffect(() => {
    console.log('PuzzleBoard - showGuideImage changed to:', showGuideImage);
  }, [showGuideImage]);
  
  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    e.preventDefault();
    setHighlightedPosition(position);
  };
  
  // Handle drag leave
  const handleDragLeave = () => {
    setHighlightedPosition(null);
  };
  
  // Handle drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    e.preventDefault();
    setHighlightedPosition(null);
    
    const pieceId = e.dataTransfer.getData('puzzle-piece-id');
    if (pieceId) {
      onPieceDrop(parseInt(pieceId), position);
    }
  };
  
  // Set up position to piece mapping
  const positionMap = pieces.reduce((map, piece) => {
    map[piece.position] = piece;
    return map;
  }, {} as Record<number, PuzzlePiece>);
  
  // Create grid cells
  const cells = [];
  for (let i = 0; i < rows * columns; i++) {
    const piece = positionMap[i];
    
    cells.push(
      <div
        key={`cell-${i}`}
        className={`puzzle-cell ${highlightedPosition === i ? 'highlight' : ''}`}
        onDragOver={(e) => handleDragOver(e, i)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, i)}
        style={{
          position: 'relative',
        }}
      >
        {piece && (
          <PuzzleTile
            piece={piece}
            imageUrl={imageUrl}
            rows={rows}
            columns={columns}
            isCorrect={isPieceCorrect(piece.id)}
            isDragging={draggedPiece === piece.id}
            onDragStart={(e) => {
              onDragStart();
              e.dataTransfer.setData('puzzle-piece-id', piece.id.toString());
              setDraggedPiece(piece.id);
            }}
            onDragEnd={() => setDraggedPiece(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="puzzle-board-wrapper relative">
      <div style={containerStyle} className="puzzle-board">
        {showGuideImage && (
          <div 
            className="absolute inset-0 z-0 pointer-events-none"
            style={{ 
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.3,
            }}
            aria-hidden="true"
          ></div>
        )}
        {cells}
      </div>
    </div>
  );
});

PuzzleBoard.displayName = 'PuzzleBoard';
