
import React from 'react';
import { motion } from 'framer-motion';
import { PuzzlePiece as PuzzlePieceType } from '../types/puzzle-types';
import { calculatePieceStyle } from '../utils/puzzleUtils';

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
  const pieceStyle = calculatePieceStyle(
    piece.id,
    piece.position,
    rows,
    columns,
    containerWidth,
    containerHeight,
    imageUrl
  );

  return (
    <motion.div
      className={`
        cursor-grab active:cursor-grabbing rounded-sm shadow-md
        ${piece.isCorrect ? 'ring-2 ring-green-500' : ''}
        ${piece.isDragging ? 'z-10 opacity-80' : 'z-0 opacity-100'}
      `}
      drag
      dragSnapToOrigin={false}
      style={pieceStyle}
      onDragStart={() => onDragStart(piece.id)}
      onDragEnd={() => onDragEnd(piece.id, piece.position)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      data-piece-id={piece.id}
      aria-label={`Puzzle piece ${piece.id}`}
    />
  );
};

export default PuzzlePiece;
