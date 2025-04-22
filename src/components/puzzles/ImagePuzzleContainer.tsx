
import React from 'react';
import PuzzleGrid from './components/PuzzleGrid';
import { SimplePuzzlePiece } from './types/simple-puzzle-types';

interface ImagePuzzleContainerProps {
  pieces: SimplePuzzlePiece[];
  columns: number;
  isSolved: boolean;
  isLoading: boolean;
  containerSize: { width: number; height: number; pieceSize: number };
  gridEvents: {
    onDragStart: (e: React.DragEvent, pieceId: string) => void;
    onDragEnd: () => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent, cellIndex: number) => void;
  };
  getPieceStyle: (piece: SimplePuzzlePiece) => React.CSSProperties;
  isTouchDevice: boolean;
  isMobile: boolean;
  draggedPiece: SimplePuzzlePiece | null;
  moveCount: number;
}

const ImagePuzzleContainer: React.FC<ImagePuzzleContainerProps> = ({
  pieces,
  columns,
  isSolved,
  isLoading,
  containerSize,
  gridEvents,
  getPieceStyle,
  isTouchDevice,
  isMobile,
  draggedPiece,
  moveCount
}) => {
  const grid = Array(pieces.length).fill(null).map((_, i) => {
    const piece = pieces.find(p => p.position === i);
    return piece ? parseInt(piece.id.split('-')[1]) : null;
  });

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <PuzzleGrid
        grid={grid}
        pieces={pieces}
        columns={columns}
        isSolved={isSolved}
        onDragStart={gridEvents.onDragStart}
        onDragEnd={gridEvents.onDragEnd}
        onDragOver={gridEvents.onDragOver}
        onDrop={gridEvents.onDrop}
      />
    </div>
  );
};

export default ImagePuzzleContainer;
