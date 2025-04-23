
import React, { useRef, useEffect } from 'react';
import { SimplePuzzlePiece } from '../types/simple-puzzle-types';
import PuzzlePiece from './PuzzlePiece';
import PuzzleStagingArea from './PuzzleStagingArea';
import { sortPiecesForGrid, isTrappedPiece } from './utils/gridHelpers';
import { checkTrappedPieces } from '../utils/pieceSortingUtils';
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
          const newScale = currentScale * (currentDistance / initialDistance);
          const constrainedScale = Math.min(Math.max(newScale, minScale), maxScale);
          gridRef.current.style.transform = `scale(${constrainedScale})`;
          currentScale = constrainedScale;
          initialDistance = currentDistance;
        }
      }
    };
    
    const handleTouchEnd = () => {
      initialDistance = 0;
    };
    
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
  
  const defaultWidth = isMobile ? 300 : 360;
  const width = containerSize?.width || defaultWidth;
  const height = containerSize?.height || defaultWidth;
  const pieceSize = containerSize?.pieceSize || (width / 3) - (isMobile ? 4 : 8);
  
  // Separate grid pieces from staging pieces
  const gridPieces = pieces.filter(piece => piece.position >= 0);
  const stagingPieces = pieces.filter(piece => piece.position < 0);
  
  // Mark trapped pieces and ensure they are properly sorted
  const markedPieces = gridPieces.map(piece => ({
    ...piece,
    trapped: isTrappedPiece(piece, gridPieces)
  }));
  
  // Use the enhanced sorting to ensure trapped pieces are visible
  const sortedPieces = sortPiecesForGrid(markedPieces);
  
  // Handle staging area interactions
  const handleStagingDragStart = (e: React.DragEvent | React.MouseEvent | React.TouchEvent, pieceId: string) => {
    const piece = pieces.find(p => p.id === pieceId);
    if (piece) {
      onDragStart(e, piece);
    }
  };
  
  const handleStagingDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Allow drop
  };
  
  const handleStagingDrop = (e: React.DragEvent) => {
    e.preventDefault();
    // Move piece back to staging area (position < 0)
    const pieceId = e.dataTransfer.getData('piece-id');
    if (pieceId) {
      const piece = pieces.find(p => p.id === pieceId);
      if (piece) {
        onDrop(e, -1); // Use -1 as a special index for staging area
      }
    }
  };

  return (
    <div className="puzzle-area flex flex-col items-center w-full">
      <div 
        ref={gridRef}
        className={`grid grid-cols-3 gap-1 sm:gap-2 bg-puzzle-black/60 p-2 sm:p-4 rounded-lg border-2 
          ${isSolved ? 'border-puzzle-gold puzzle-complete' : 'border-puzzle-aqua'}
          transition-transform duration-200 transform-gpu touch-manipulation`}
        style={{ width, height }}
      >
        {sortedPieces.map((piece, index) => {
          const pieceNumber = parseInt(piece.id.split('-')[1]);
          const isCorrectlyPlaced = pieceNumber === piece.position;
          const isTrapped = !!piece.trapped;

          return (
            <PuzzlePiece
              key={piece.id}
              piece={piece}
              index={index}
              isCorrectlyPlaced={isCorrectlyPlaced}
              isTrapped={isTrapped}
              isSolved={isSolved}
              isTouchDevice={isTouchDevice}
              pieceSize={pieceSize}
              onDragStart={(e) => onDragStart(e, piece)}
              onMove={(e) => onMove(e, index)}
              onDrop={(e) => onDrop(e, index)}
              onClick={() => onPieceClick(piece)}
            />
          );
        })}
      </div>
      
      {/* Staging Area */}
      <PuzzleStagingArea 
        stagingPieces={stagingPieces}
        onDragStart={handleStagingDragStart}
        onDragEnd={() => {}}
        onDragOver={handleStagingDragOver}
        onDrop={handleStagingDrop}
        isTouchDevice={isTouchDevice}
        pieceSize={Math.floor(pieceSize * 0.8)}
      />
    </div>
  );
};

export default SimplePuzzleGrid;
