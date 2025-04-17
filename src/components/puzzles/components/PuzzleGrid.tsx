
import React, { useRef, useEffect } from 'react';
import { PuzzlePiece, difficultyConfig, DifficultyLevel } from '../types/puzzle-types';
import '../styles/puzzle-animations.css';

interface PuzzleGridProps {
  pieces: PuzzlePiece[];
  difficulty: DifficultyLevel;
  isSolved: boolean;
  isLoading: boolean;
  containerSize: { width: number; height: number; pieceSize: number };
  onDragStart: (e: React.MouseEvent | React.TouchEvent, piece: PuzzlePiece) => void;
  onMove?: (e: React.MouseEvent | React.TouchEvent, index: number) => void;
  onDrop: (e: React.MouseEvent | React.TouchEvent, index: number) => void;
  onPieceClick: (piece: PuzzlePiece) => void;
  getPieceStyle: (piece: PuzzlePiece) => React.CSSProperties;
  isTouchDevice?: boolean;
  isMobile?: boolean;
}

const PuzzleGrid: React.FC<PuzzleGridProps> = ({
  pieces,
  difficulty,
  isSolved,
  isLoading,
  containerSize,
  onDragStart,
  onMove,
  onDrop,
  onPieceClick,
  getPieceStyle,
  isTouchDevice = false,
  isMobile = false
}) => {
  const gridSize = difficultyConfig[difficulty].gridSize;
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
  
  if (isLoading) {
    return (
      <div 
        className="flex items-center justify-center bg-puzzle-black/60 rounded-lg border-2 border-puzzle-aqua animate-pulse"
        style={{ width: containerSize.width, height: containerSize.height }}
      >
        <p className="text-puzzle-aqua">Loading puzzle...</p>
      </div>
    );
  }
  
  // Adjust gap size based on difficulty and device
  const getGapSize = () => {
    if (isMobile) {
      return difficulty === '5x5' ? 0.5 : 1;
    }
    return difficulty === '5x5' ? 1 : 2;
  };
  
  const gapSize = getGapSize();
  
  return (
    <div 
      ref={gridRef}
      className={`grid gap-[${gapSize}px] bg-puzzle-black/60 p-1 sm:p-2 rounded-lg border-2 
        ${isSolved ? 'border-puzzle-gold puzzle-complete' : 'border-puzzle-aqua'}
        ${difficultyConfig[difficulty].containerClass}
        transition-transform duration-200 transform-gpu touch-manipulation`}
      style={{ 
        width: containerSize.width, 
        height: containerSize.height,
        gap: `${gapSize}px`
      }}
    >
      {pieces.map((piece, index) => {
        const pieceSize = containerSize.pieceSize - (gapSize * 2);
        
        // For 5x5 puzzles on mobile, we don't show numbers for better visibility
        const showNumber = !(difficulty === '5x5' && isMobile);
        
        return (
          <div 
            key={piece.id}
            onMouseDown={(e) => onDragStart(e, piece)}
            onTouchStart={(e) => onDragStart(e, piece)}
            onMouseMove={(e) => onMove && onMove(e, index)}
            onTouchMove={(e) => onMove && onMove(e, index)}
            onMouseUp={(e) => onDrop(e, index)}
            onTouchEnd={(e) => onDrop(e, index)}
            onClick={() => onPieceClick(piece)}
            className={`puzzle-piece flex items-center justify-center rounded cursor-pointer shadow-md transition-all
              ${piece.isDragging ? 'puzzle-piece-dragging ring-2 ring-white z-10' : ''}
              ${(piece as any).correctlyPlaced ? 'puzzle-piece-correct' : ''}
              ${(piece as any).showHint ? 'puzzle-piece-hint' : ''}
              ${isSolved ? 'ring-1 ring-puzzle-gold/50' : ''}
              ${isTouchDevice ? 'active:scale-105' : 'hover:brightness-110'}`}
            style={{ 
              ...getPieceStyle(piece),
              width: pieceSize,
              height: pieceSize,
            }}
          >
            {showNumber && (
              <span className={`text-xs sm:text-sm md:text-base font-bold text-white drop-shadow-md bg-black/30 
                ${isMobile ? 'w-5 h-5' : 'w-6 h-6'} flex items-center justify-center rounded-full
                ${piece.isDragging ? 'scale-110' : ''}`}
              >
                {parseInt(piece.id.split('-')[1]) + 1}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PuzzleGrid;
