
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
      {pieces.map((piece, index) => {
        const pieceSize = containerSize?.pieceSize || (width / 3) - (isMobile ? 4 : 8);
        // Get the piece number from the id for correct position checking
        const pieceNumber = parseInt(piece.id.split('-')[1]);
        const isCorrectlyPlaced = pieceNumber === piece.position;
        
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
            className={`puzzle-piece flex items-center justify-center rounded-lg cursor-pointer shadow-md transition-all
              ${piece.isDragging ? 'puzzle-piece-dragging' : ''}
              ${isCorrectlyPlaced ? 'puzzle-piece-correct' : ''}
              ${(piece as any).showHint ? 'puzzle-piece-hint' : ''}
              ${isSolved ? 'ring-1 ring-puzzle-gold/50' : ''}
              ${isTouchDevice ? 'active:scale-105' : 'hover:brightness-110'}`}
            style={{ 
              backgroundColor: piece.color,
              opacity: piece.isDragging ? '0.8' : '1',
              width: pieceSize,
              height: pieceSize,
              zIndex: (piece as any).zIndex || (isCorrectlyPlaced ? 10 : 20), // Use zIndex property or default based on placement
              position: 'relative'
            }}
          >
            <span className={`text-base sm:text-lg font-bold text-white drop-shadow-md 
              ${piece.isDragging ? 'scale-110' : ''}`}
            >
              {pieceNumber + 1}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default SimplePuzzleGrid;
