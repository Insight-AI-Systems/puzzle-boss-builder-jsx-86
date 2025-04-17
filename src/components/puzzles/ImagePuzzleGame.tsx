
import React, { useState, useRef, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { DEFAULT_IMAGES, DifficultyLevel, difficultyConfig } from './types/puzzle-types';
import { usePuzzlePieces } from './hooks/usePuzzlePieces';
import { usePuzzleState } from './hooks/usePuzzleState';
import { createPieceHandlers, getImagePieceStyle } from './utils/pieceInteractionHandlers';
import { calculateContainerSize } from './utils/puzzleSizeUtils';
import PuzzleControls from './components/PuzzleControls';
import PuzzleGrid from './components/PuzzleGrid';
import DirectionalControls from './components/DirectionalControls';
import PuzzleStatusMessage from './components/PuzzleStatusMessage';
import PuzzleStateDisplay from './components/PuzzleStateDisplay';

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
  
  // New puzzle state management
  const puzzleState = usePuzzleState(difficulty);
  
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
    (count) => {
      setMoveCount(count);
      puzzleState.incrementMoves();
    },
    isSolved
  );
  
  // Reset loading state and load new puzzle when difficulty or image changes
  const handleDifficultyChange = (newDifficulty: DifficultyLevel) => {
    setDifficulty(newDifficulty);
    puzzleState.changeDifficulty(newDifficulty);
    setIsLoading(true);
  };
  
  const handleImageChange = (newImage: string) => {
    setSelectedImage(newImage);
    setIsLoading(true);
  };
  
  // Start a new puzzle
  const handleNewGame = () => {
    handleShuffleClick();
    puzzleState.startNewPuzzle(difficulty);
  };
  
  // When a new puzzle is loaded, start the timer
  useEffect(() => {
    if (!isLoading && pieces.length > 0) {
      puzzleState.startNewPuzzle(difficulty);
    }
  }, [isLoading, pieces.length]);
  
  // Check for puzzle completion
  useEffect(() => {
    if (isSolved && !puzzleState.isComplete) {
      puzzleState.checkCompletion(gridSize * gridSize, gridSize * gridSize);
    }
  }, [isSolved, puzzleState, gridSize]);
  
  // Update correct pieces count
  useEffect(() => {
    if (!isSolved && pieces.length > 0) {
      const correctCount = pieces.filter((piece) => {
        const pieceNumber = parseInt(piece.id.split('-')[1]);
        return piece.position === pieceNumber;
      }).length;
      puzzleState.updateCorrectPieces(correctCount);
    }
  }, [pieces, isSolved, puzzleState]);
  
  // Calculate container size based on device and difficulty
  const containerSize = calculateContainerSize(isMobile, difficulty);
  
  // Wrapper for directional moves to pass gridSize
  const handleDirectionalMoveWithGrid = (direction: 'up' | 'down' | 'left' | 'right') => {
    handleDirectionalMove(direction, gridSize);
  };
  
  // Total pieces based on difficulty
  const totalPieces = gridSize * gridSize;
  
  return (
    <div className="flex flex-col items-center">
      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} width="600" height="600" className="hidden" />
      <img ref={imgRef} className="hidden" alt="Source" />
      
      {/* New puzzle state display */}
      <PuzzleStateDisplay 
        state={{
          ...puzzleState,
          isComplete: isSolved // Use isSolved for completion status
        }}
        totalPieces={totalPieces}
        onNewGame={handleNewGame}
        onDifficultyChange={handleDifficultyChange}
        onTogglePause={puzzleState.togglePause}
      />
      
      {/* Controls and info */}
      <PuzzleControls
        moveCount={moveCount}
        difficulty={difficulty}
        setDifficulty={handleDifficultyChange}
        selectedImage={selectedImage}
        setSelectedImage={handleImageChange}
        onShuffle={handleNewGame}
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
