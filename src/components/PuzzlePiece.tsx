
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { PuzzlePiece as PuzzlePieceType } from '../types/puzzle-types';

interface PuzzlePieceProps {
  piece: PuzzlePieceType;
  rows: number;
  columns: number;
  containerWidth: number;
  containerHeight: number;
  imageUrl: string;
  onDragStart: (id: string) => void;
  onDragEnd: (id: string, position: number) => void;
}

const PuzzlePiece: React.FC<PuzzlePieceProps> = ({
  piece,
  rows,
  columns,
  containerWidth,
  containerHeight,
  imageUrl,
  onDragStart,
  onDragEnd
}) => {
  const pieceRef = useRef<HTMLDivElement>(null);

  // Calculate piece dimensions
  const width = containerWidth / columns;
  const height = containerHeight / rows;
  const originalRow = Math.floor(Number(piece.id.split('-')[1]) / columns);
  const originalCol = Number(piece.id.split('-')[1]) % columns;

  useEffect(() => {
    if (!pieceRef.current) return;

    const element = pieceRef.current;
    let startX = 0;
    let startY = 0;
    let isDragging = false;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      isDragging = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      onDragStart(piece.id);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      isDragging = false;
      
      // Calculate the drop position based on touch coordinates
      const touch = e.changedTouches[0];
      const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
      const dropTarget = elements.find(el => el.hasAttribute('data-position'));
      
      if (dropTarget) {
        const position = Number(dropTarget.getAttribute('data-position'));
        onDragEnd(piece.id, position);
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [piece.id, onDragStart, onDragEnd]);

  return (
    <motion.div
      ref={pieceRef}
      className={`
        touch-none cursor-grab active:cursor-grabbing rounded-sm shadow-md
        ${piece.isCorrect ? 'ring-2 ring-green-500' : ''}
        ${piece.isDragging ? 'z-10 opacity-80' : 'z-0 opacity-100'}
      `}
      drag
      dragSnapToOrigin={false}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: `${containerWidth}px ${containerHeight}px`,
        backgroundPosition: `-${originalCol * width}px -${originalRow * height}px`,
        touchAction: 'none'
      }}
      onDragStart={() => onDragStart(piece.id)}
      onDragEnd={(e, info) => {
        const element = document.elementFromPoint(info.point.x, info.point.y);
        if (element?.hasAttribute('data-position')) {
          onDragEnd(piece.id, Number(element.getAttribute('data-position')));
        }
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      data-piece-id={piece.id}
      aria-label={`Puzzle piece ${piece.id}`}
    />
  );
};

export default PuzzlePiece;
