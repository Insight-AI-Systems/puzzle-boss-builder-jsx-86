
import React from 'react';
import { PuzzlePiece, DifficultyLevel } from './types/puzzle-types';
import SimplePuzzleGrid from './components/SimplePuzzleGrid';

interface ImagePuzzleContainerProps {
  pieces: PuzzlePiece[];
  difficulty: DifficultyLevel;
  isSolved: boolean;
  isLoading: boolean;
  containerSize: { width: number; height: number; pieceSize: number };
  gridEvents: {
    onDragStart: (e: React.MouseEvent | React.TouchEvent, piece: PuzzlePiece) => void;
    onMove: (e: React.MouseEvent | React.TouchEvent, index: number) => void;
    onDrop: (e: React.MouseEvent | React.TouchEvent, index: number) => void;
    onPieceClick: (piece: PuzzlePiece) => void;
  };
  getPieceStyle: (piece: PuzzlePiece) => React.CSSProperties;
  isTouchDevice: boolean;
  isMobile: boolean;
  draggedPiece: PuzzlePiece | null;
  moveCount: number;
}

const ImagePuzzleContainer: React.FC<ImagePuzzleContainerProps> = ({
  pieces,
  difficulty,
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
  // If we need to adapt PuzzlePiece to SimplePuzzlePiece, we can do it here
  // by adding a color property or transforming pieces as needed
  const adaptedPieces = pieces.map(piece => ({
    ...piece,
    color: piece.color || `hsl(${parseInt(piece.id.split('-')[1]) * 30 % 360}, 70%, 60%)` // Fallback color if not provided
  }));

  return (
    <div className="puzzle-board-container relative">
      {isLoading ? (
        <div className="flex items-center justify-center h-40 w-full">
          <span>Loading puzzle...</span>
        </div>
      ) : (
        <SimplePuzzleGrid
          pieces={adaptedPieces as any}
          isSolved={isSolved}
          isMobile={isMobile}
          containerSize={containerSize}
          onDragStart={gridEvents.onDragStart}
          onMove={gridEvents.onMove}
          onDrop={gridEvents.onDrop}
          onPieceClick={gridEvents.onPieceClick}
          isTouchDevice={isTouchDevice}
        />
      )}
    </div>
  );
};

export default ImagePuzzleContainer;
