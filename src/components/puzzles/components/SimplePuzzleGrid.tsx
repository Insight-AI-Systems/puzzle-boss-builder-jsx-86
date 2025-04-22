
import React, { useRef, useEffect } from 'react';
import { SimplePuzzlePiece } from '../types/simple-puzzle-types';
import '../styles/puzzle-animations.css';

interface SimplePuzzleGridProps {
  pieces: SimplePuzzlePiece[];
  isSolved: boolean;
  isMobile: boolean;
  containerSize?: { width: number; height: number; pieceSize: number };
  onDragStart: (e: React.MouseEvent | React.TouchEvent, piece: SimplePuzzlePiece) => void;
  onMove: (e: React.MouseEvent | React.TouchEvent, index: number) => void;
  onDrop: (e: React.MouseEvent | React.TouchEvent, index: number) => void;
  onPieceClick: (piece: SimplePuzzlePiece) => void;
  isTouchDevice?: boolean;
}

const SimplePuzzleGrid: React.FC<SimplePuzzleGridProps> = ({
  pieces,
  isSolved,
  isMobile,
  containerSize,
  onDragStart,
  onMove,
  onDrop,
  onPieceClick,
  isTouchDevice = false
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  
  // Support for zoom gestures on touch devices
  useEffect(() => {
    if (!isTouchDevice || !gridRef.current) return;
    
    let initialDistance = 0;
    let currentScale = 1;
    const minScale = 0.8;
    const maxScale = 1.5;
    
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        initialDistance = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY
        );
      }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && gridRef.current) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY
        );
        
        if (initialDistance > 0) {
          // Calculate new scale based on pinch gesture
          const newScale = currentScale * (currentDistance / initialDistance);
          // Apply constraints
          const constrainedScale = Math.min(Math.max(newScale, minScale), maxScale);
          
          // Apply the transform
          gridRef.current.style.transform = `scale(${constrainedScale})`;
          
          // Update for next move
          currentScale = constrainedScale;
          initialDistance = currentDistance;
        }
      }
    };
    
    const handleTouchEnd = () => {
      initialDistance = 0;
    };
    
    // Add passive: false to override default behavior and allow preventDefault
    gridRef.current.addEventListener('touchstart', handleTouchStart, { passive: false });
    gridRef.current.addEventListener('touchmove', handleTouchMove, { passive: false });
    gridRef.current.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      if (gridRef.current) {
        gridRef.current.removeEventListener('touchstart', handleTouchStart);
        gridRef.current.removeEventListener('touchmove', handleTouchMove);
        gridRef.current.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [isTouchDevice]);
  
  // Default sizes if not provided
  const defaultWidth = isMobile ? 300 : 360;
  const width = containerSize?.width || defaultWidth;
  const height = containerSize?.height || defaultWidth;
  
  // Sort pieces to get correct initial layering 
  // This ensures the components render in the right order from the beginning
  const sortedPieces = [...pieces].sort((a, b) => {
    const aNumber = parseInt(a.id.split('-')[1]);
    const bNumber = parseInt(b.id.split('-')[1]);
    
    const aCorrect = aNumber === a.position;
    const bCorrect = bNumber === b.position;
    
    // Consider trapped state (pieces that are under correctly placed pieces)
    const aTrapped = (a as any).trapped;
    const bTrapped = (b as any).trapped;
    
    // Prioritize trapped pieces to be more visible
    if (aTrapped && !bTrapped) return 1;
    if (!aTrapped && bTrapped) return -1;
    
    if (a.isDragging) return 1; // Dragging pieces always on top
    if (b.isDragging) return -1;
    
    if ((a as any).selected) return 1; // Selected pieces next
    if ((b as any).selected) return -1;
    
    if (aCorrect && !bCorrect) return -1; // Correct pieces on bottom
    if (!aCorrect && bCorrect) return 1;  // Incorrect pieces on top
    
    return 0;
  });
  
  return (
    <div 
      ref={gridRef}
      className={`grid grid-cols-3 gap-1 sm:gap-2 bg-puzzle-black/60 p-2 sm:p-4 rounded-lg border-2 
        ${isSolved ? 'border-puzzle-gold puzzle-complete' : 'border-puzzle-aqua'}
        transition-transform duration-200 transform-gpu touch-manipulation`}
      style={{ 
        width: width,
        height: height
      }}
    >
      {sortedPieces.map((piece, index) => {
        const pieceSize = containerSize?.pieceSize || (width / 3) - (isMobile ? 4 : 8);
        // Get the piece number from the id for correct position checking
        const pieceNumber = parseInt(piece.id.split('-')[1]);
        const isCorrectlyPlaced = pieceNumber === piece.position;
        
        // Check if this piece is potentially trapped under a correctly placed piece
        const isTrapped = !isCorrectlyPlaced && sortedPieces.some(other => {
          const otherNumber = parseInt(other.id.split('-')[1]);
          return other.position === piece.position && otherNumber === other.position;
        });
        
        // Determine CSS classes based on piece state
        const pieceClasses = [
          'puzzle-piece',
          'flex items-center justify-center rounded-lg cursor-pointer shadow-md transition-all',
          piece.isDragging ? 'puzzle-piece-dragging' : '',
          isCorrectlyPlaced ? 'puzzle-piece-correct' : '',
          (piece as any).showHint ? 'puzzle-piece-hint' : '',
          (piece as any).selected ? 'selected' : '',
          isTrapped ? 'trapped' : '',
          isSolved ? 'ring-1 ring-puzzle-gold/50' : '',
          isTouchDevice ? 'active:scale-105' : 'hover:brightness-110'
        ].filter(Boolean).join(' ');
        
        return (
          <div 
            key={piece.id}
            onMouseDown={(e) => onDragStart(e, piece)}
            onTouchStart={(e) => onDragStart(e, piece)}
            onMouseOver={(e) => onMove(e, index)}
            onTouchMove={(e) => onMove(e, index)}
            onMouseUp={(e) => onDrop(e, index)}
            onTouchEnd={(e) => onDrop(e, index)}
            onClick={() => onPieceClick(piece)}
            className={pieceClasses}
            style={{ 
              backgroundColor: piece.color,
              opacity: piece.isDragging ? '0.8' : '1',
              width: pieceSize,
              height: pieceSize,
              position: 'relative',
              // Avoid inline z-index, use CSS classes instead for better control
            }}
            data-correct={isCorrectlyPlaced ? 'true' : 'false'}
            data-piece-number={pieceNumber}
            data-piece-id={piece.id}
            data-position={piece.position}
            data-trapped={isTrapped ? 'true' : 'false'}
            aria-label={`Puzzle piece ${pieceNumber + 1}${isTrapped ? ', trapped under another piece' : ''}${isCorrectlyPlaced ? ', correctly placed' : ''}`}
          >
            <span className={`text-base sm:text-lg font-bold text-white drop-shadow-md 
              ${piece.isDragging ? 'scale-110' : ''}`}
            >
              {pieceNumber + 1}
            </span>
            {isTrapped && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-xs text-white bg-red-600 px-1 rounded animate-pulse">
                  Trapped
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SimplePuzzleGrid;
