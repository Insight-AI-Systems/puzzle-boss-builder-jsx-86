
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
  
  // Create unique IDs for the SVG elements
  const clipPathId = `piece-clip-${piece.id}`;
  const shadowId = `drop-shadow-${piece.id}`;
  
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
      {/* SVG for clip path and filters */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          {/* Clip path for the image */}
          <clipPath id={clipPathId}>
            <path d={piecePath} />
          </clipPath>
          
          {/* Drop shadow filter for enhanced 3D effect */}
          <filter id={shadowId} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow 
              dx="3" 
              dy="3" 
              stdDeviation="3" 
              floodColor="rgba(0,0,0,0.6)" 
              floodOpacity="0.6"
            />
          </filter>
        </defs>
      </svg>
      
      {/* The actual puzzle piece with clipped image */}
      <div
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
        
        {/* SVG outline for the piece shape */}
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
            stroke={isCorrect ? "rgba(100, 255, 100, 0.8)" : "rgba(255, 255, 255, 0.8)"}
            strokeWidth={isDragging ? "2.5" : "1.5"}
            strokeLinejoin="round"
            filter={isDragging ? `url(#${shadowId})` : ''}
          />
        </svg>
        
        {/* Number overlay if showNumber is true */}
        {showNumber && (
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              zIndex: 3,
            }}
          >
            <span 
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: 'bold',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
              }}
            >
              {piece.id + 1}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
