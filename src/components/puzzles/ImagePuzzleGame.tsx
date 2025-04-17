
import React, { useState, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { DEFAULT_IMAGES, DifficultyLevel } from './types/puzzle-types';
import { usePuzzlePieces } from './hooks/usePuzzlePieces';
import { createPieceHandlers, getImagePieceStyle } from './utils/pieceInteractionHandlers';
import { calculateContainerSize } from './utils/puzzleSizeUtils';
import PuzzleControls from './components/PuzzleControls';
import PuzzleGrid from './components/PuzzleGrid';
import DirectionalControls from './components/DirectionalControls';
import PuzzleStatusMessage from './components/PuzzleStatusMessage';

interface ImagePuzzleGameProps {
  sampleImages?: string[];
}

const ImagePuzzleGame: React.FC<ImagePuzzleGameProps> = ({ sampleImages = DEFAULT_IMAGES }) => {
  const isMobile = useIsMobile();
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('3x3');
  const [selectedImage, setSelectedImage] = useState<string>(sampleImages[0]);
  const [isLoading, setIsLoading] = useState(true);
  
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Use custom hooks for state management and event handlers
  const {
    pieces,
    setPieces,
    draggedPiece,
    setDraggedPiece,
    moveCount,
    setMoveCount,
    isSolved,
    gridSize,
    handleShuffleClick
  } = usePuzzlePieces(difficulty, selectedImage, isLoading, setIsLoading);
  
  const {
    handleDragStart,
    handleDrop,
    handlePieceClick,
    handleDirectionalMove,
  } = createPieceHandlers(
    pieces,
    setPieces,
    draggedPiece,
    setDraggedPiece,
    setMoveCount,
    isSolved
  );
  
  // Reset loading state and load new puzzle when difficulty or image changes
  const handleDifficultyChange = (newDifficulty: DifficultyLevel) => {
    setDifficulty(newDifficulty);
    setIsLoading(true);
  };
  
  const handleImageChange = (newImage: string) => {
    setSelectedImage(newImage);
    setIsLoading(true);
  };
  
  // Calculate container size based on device and difficulty
  const containerSize = calculateContainerSize(isMobile, difficulty);
  
  // Wrapper for directional moves to pass gridSize
  const handleDirectionalMoveWithGrid = (direction: 'up' | 'down' | 'left' | 'right') => {
    handleDirectionalMove(direction, gridSize);
  };
  
  return (
    <div className="flex flex-col items-center">
      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} width="600" height="600" className="hidden" />
      <img ref={imgRef} className="hidden" alt="Source" />
      
      {/* Controls and info */}
      <PuzzleControls
        moveCount={moveCount}
        difficulty={difficulty}
        setDifficulty={handleDifficultyChange}
        selectedImage={selectedImage}
        setSelectedImage={handleImageChange}
        onShuffle={handleShuffleClick}
        sampleImages={sampleImages}
        isLoading={isLoading}
      />
      
      {/* Puzzle grid */}
      <PuzzleGrid
        pieces={pieces}
        difficulty={difficulty}
        isSolved={isSolved}
        isLoading={isLoading}
        containerSize={containerSize}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
        onPieceClick={handlePieceClick}
        getPieceStyle={(piece) => getImagePieceStyle(piece, selectedImage, gridSize)}
      />
      
      {/* Mobile-friendly directional controls */}
      {(isMobile || draggedPiece) && !isSolved && !isLoading && (
        <DirectionalControls 
          draggedPiece={draggedPiece}
          onDirectionalMove={handleDirectionalMoveWithGrid}
        />
      )}
      
      {/* Status messages */}
      <PuzzleStatusMessage
        isSolved={isSolved}
        isLoading={isLoading}
        isMobile={!!isMobile}
        moveCount={moveCount}
      />
    </div>
  );
};

export default ImagePuzzleGame;
