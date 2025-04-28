
import React, { useRef, useEffect } from 'react';
import { type PuzzlePiece as PuzzlePieceType } from '../hooks/usePuzzleState';
import { generatePiecePath } from '../utils/piecePathGenerator';

interface PuzzlePieceProps {
  piece: PuzzlePieceType;
  imageUrl: string;
  rows: number;
  columns: number;
  isCorrect: boolean;
  isDragging: boolean;
  onDragStart: () => void;
  onTouchStart: () => void;
  onDragEnd: () => void;
  onDoubleClick: () => void;
  showNumber: boolean;
  width: number;
  height: number;
}

export const PuzzlePiece: React.FC<PuzzlePieceProps> = ({
  piece,
  imageUrl,
  rows,
  columns,
  isCorrect,
  isDragging,
  onDragStart,
  onTouchStart,
  onDragEnd,
  onDoubleClick,
  showNumber,
  width,
  height
}) => {
  const pieceRef = useRef<HTMLDivElement>(null);
  
  // Original position in the puzzle (for background position)
  const row = Math.floor(piece.originalPosition / columns);
  const col = piece.originalPosition % columns;
  
  // Generate SVG path for the piece shape
  const piecePath = generatePiecePath(piece.originalPosition, rows, columns, width, height);
  
  // Calculate the background position to show the correct part of the image
  const backgroundPositionX = -(col * width);
  const backgroundPositionY = -(row * height);
  
  // Handle touch events for mobile drag and drop
  useEffect(() => {
    const pieceElement = pieceRef.current;
    if (!pieceElement) return;
    
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      onTouchStart();
      
      // Add custom event listeners for touch handling
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd, { passive: false });
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      // Touch move handling could be added here if needed
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      onDragEnd();
      
      // Get touch position
      const touch = e.changedTouches[0];
      const elementsAtPoint = document.elementsFromPoint(touch.clientX, touch.clientY);
      
      // Find a cell element under the touch point
      const cellElement = elementsAtPoint.find(el => el.classList.contains('puzzle-cell'));
      if (cellElement && cellElement.getAttribute('data-position')) {
        const position = parseInt(cellElement.getAttribute('data-position') || '-1');
        if (position !== -1) {
          // Here you would handle the drop logic
          // This would need to be implemented in the parent component
        }
      }
      
      // Remove event listeners
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    pieceElement.addEventListener('touchstart', handleTouchStart, { passive: false });
    
    return () => {
      pieceElement.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onTouchStart, onDragEnd]);
  
  // Create a unique ID for the SVG clip path
  const clipPathId = `piece-clip-${piece.id}`;
  const shadowPathId = `piece-shadow-${piece.id}`;
  
  return (
    <div
      ref={pieceRef}
      className={`puzzle-piece ${isCorrect ? 'correct' : ''} ${isDragging ? 'dragging' : ''}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        position: 'relative',
        cursor: 'grab',
      }}
      draggable="true"
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', piece.id.toString());
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      onDoubleClick={onDoubleClick}
      data-piece-id={piece.id}
    >
      {/* SVG for clip path and piece outline */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          {/* Clip path for the image */}
          <clipPath id={clipPathId}>
            <path d={piecePath} />
          </clipPath>
          
          {/* Filter for drop shadow */}
          <filter id={shadowPathId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="1" stdDeviation="2" floodColor="rgba(0,0,0,0.5)" floodOpacity="0.5"/>
          </filter>
        </defs>
      </svg>
      
      {/* The actual piece with the image clipped to the puzzle shape */}
      <div
        className="piece-content"
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        {/* Background image with clip path */}
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: `${columns * width}px ${rows * height}px`,
            backgroundPosition: `${backgroundPositionX}px ${backgroundPositionY}px`,
            clipPath: `url(#${clipPathId})`,
            WebkitClipPath: `url(#${clipPathId})`,
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        />
        
        {/* SVG outline overlay for the piece */}
        <svg 
          width="100%" 
          height="100%" 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            zIndex: 2, 
            pointerEvents: 'none' 
          }}
        >
          <path 
            d={piecePath} 
            fill="none" 
            stroke="rgba(255, 255, 255, 0.7)" 
            strokeWidth="2"
            filter={isDragging ? `url(#${shadowPathId})` : ''}
          />
        </svg>
        
        {/* Number overlay if showNumber is true */}
        {showNumber && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 3 }}>
            <span className="text-white text-lg font-bold drop-shadow-md bg-black/40 px-2 py-1 rounded-full">
              {piece.id + 1}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
