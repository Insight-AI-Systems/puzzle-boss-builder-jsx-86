
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
  const patternId = `piece-texture-${piece.id}`;
  
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
      {/* SVG for clip path, filters, and patterns */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          {/* Clip path for the image */}
          <clipPath id={clipPathId}>
            <path d={piecePath} />
          </clipPath>
          
          {/* Enhanced drop shadow filter for more pronounced 3D effect */}
          <filter id={shadowId} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow 
              dx="3" 
              dy="5" 
              stdDeviation="4" 
              floodColor="rgba(0,0,0,0.75)" 
              floodOpacity="0.8"
            />
          </filter>
          
          {/* Subtle texture pattern for pieces - slightly enhanced */}
          <pattern id={patternId} patternUnits="userSpaceOnUse" width="100" height="100" patternTransform="scale(0.12)">
            <rect width="100%" height="100%" fill="rgba(255,255,255,0.03)"/>
            <path d="M 0,10 L 100,10" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
            <path d="M 0,30 L 100,30" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
            <path d="M 0,50 L 100,50" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
            <path d="M 0,70 L 100,70" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
            <path d="M 0,90 L 100,90" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
            <path d="M 10,0 L 10,100" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
            <path d="M 30,0 L 30,100" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
            <path d="M 50,0 L 50,100" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
            <path d="M 70,0 L 70,100" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
            <path d="M 90,0 L 90,100" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
          </pattern>
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
        
        {/* SVG outline for the piece shape with more pronounced appearance */}
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
          {/* Optional subtle texture overlay */}
          <path 
            d={piecePath} 
            fill={`url(#${patternId})`}
            fillOpacity="0.2"
            stroke="none"
          />
          
          {/* Piece outline - enhanced for classic jigsaw look */}
          <path 
            d={piecePath} 
            fill="none" 
            stroke={isCorrect ? "rgba(100, 255, 100, 0.9)" : "rgba(255, 255, 255, 0.9)"}
            strokeWidth={isDragging ? "3.2" : "2.2"}
            strokeLinejoin="round"
            strokeLinecap="round"
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
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: 'bold',
                boxShadow: '0 1px 3px rgba(0,0,0,0.5)'
              }}
            >
              {piece.originalPosition + 1}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
