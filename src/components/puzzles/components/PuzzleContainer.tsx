
import React from 'react';
import { DifficultyLevel, PuzzlePiece } from '../types/puzzle-types';
import { getThemeStyles } from '../utils/themeUtils';
import ImagePuzzleContainer from '../ImagePuzzleContainer';

interface PuzzleContainerProps {
  pieces: PuzzlePiece[];
  difficulty: DifficultyLevel;
  isSolved: boolean;
  isLoading: boolean;
  containerSize: { width: number; height: number; pieceSize: number };
  gridEvents: any;
  getPieceStyle: (piece: PuzzlePiece) => React.CSSProperties;
  isTouchDevice: boolean;
  isMobile: boolean;
  draggedPiece: PuzzlePiece | null;
  moveCount: number;
  visualTheme: string;
}

const PuzzleContainer: React.FC<PuzzleContainerProps> = ({
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
  moveCount,
  visualTheme
}) => {
  return (
    <div className={`flex flex-col items-center w-full max-w-full px-2 ${getThemeStyles(visualTheme)}`}>
      <ImagePuzzleContainer
        pieces={pieces as any}  // Type cast to avoid the error while maintaining runtime behavior
        difficulty={difficulty}
        isSolved={isSolved}
        isLoading={isLoading}
        containerSize={containerSize}
        gridEvents={gridEvents}
        getPieceStyle={getPieceStyle as any}  // Type cast the style function too
        isTouchDevice={isTouchDevice}
        isMobile={isMobile}
        draggedPiece={draggedPiece as any}
        moveCount={moveCount}
      />
    </div>
  );
};

export default PuzzleContainer;
