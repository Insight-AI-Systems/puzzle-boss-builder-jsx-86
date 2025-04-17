import React, { useState, useRef, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { DEFAULT_IMAGES, DifficultyLevel, difficultyConfig } from './types/puzzle-types';
import { usePuzzlePieces } from './hooks/usePuzzlePieces';
import { usePuzzleState } from './hooks/usePuzzleState';
import { createPieceHandlers, getImagePieceStyle } from './utils/pieceInteractionHandlers';
import { calculateContainerSize } from './utils/puzzleSizeUtils';
import { useSoundEffects } from './utils/useSoundEffects';
import PuzzleControls from './components/PuzzleControls';
import PuzzleGrid from './components/PuzzleGrid';
import DirectionalControls from './components/DirectionalControls';
import PuzzleStatusMessage from './components/PuzzleStatusMessage';
import PuzzleStateDisplay from './components/PuzzleStateDisplay';
import SoundControls from './components/SoundControls';
import './styles/puzzle-animations.css';

interface ImagePuzzleGameProps {
  sampleImages?: string[];
  initialImage?: string;
  isImageLoading?: boolean;
  onImageLoaded?: () => void;
}

const ImagePuzzleGame: React.FC<ImagePuzzleGameProps> = ({ 
  sampleImages = DEFAULT_IMAGES,
  initialImage,
  isImageLoading: externalLoading,
  onImageLoaded
}) => {
  const isMobile = useIsMobile();
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('3x3');
  const [selectedImage, setSelectedImage] = useState<string>(initialImage || sampleImages[0]);
  const [isLoading, setIsLoading] = useState(externalLoading !== undefined ? externalLoading : true);
  
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { playSound, muted, toggleMute, volume, changeVolume } = useSoundEffects();
  
  useEffect(() => {
    if (initialImage && initialImage !== selectedImage) {
      setSelectedImage(initialImage);
      setIsLoading(true);
    }
  }, [initialImage, selectedImage]);
  
  useEffect(() => {
    if (externalLoading !== undefined) {
      setIsLoading(externalLoading);
    }
  }, [externalLoading]);
  
  const puzzleState = usePuzzleState(difficulty);
  
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
    checkForHints
  } = createPieceHandlers(
    pieces,
    setPieces,
    draggedPiece,
    setDraggedPiece,
    (count) => {
      setMoveCount(count);
      puzzleState.incrementMoves();
    },
    isSolved,
    playSound
  );
  
  const handleGridDragStart = (e: React.MouseEvent | React.TouchEvent, piece: any) => {
    handleDragStart(piece);
  };
  
  const handleGridDrop = (e: React.MouseEvent | React.TouchEvent, index: number) => {
    if (draggedPiece) {
      handleDrop(draggedPiece);
    }
  };
  
  const handleGridPieceClick = (piece: any) => {
    handlePieceClick(piece);
  };
  
  const handleDifficultyChange = (newDifficulty: DifficultyLevel) => {
    setDifficulty(newDifficulty);
    puzzleState.changeDifficulty(newDifficulty);
    setIsLoading(true);
  };
  
  const handleImageChange = (newImage: string) => {
    setSelectedImage(newImage);
    setIsLoading(true);
  };
  
  const handleNewGame = () => {
    handleShuffleClick();
    puzzleState.startNewPuzzle(difficulty);
  };
  
  useEffect(() => {
    if (!isLoading && onImageLoaded) {
      onImageLoaded();
    }
  }, [isLoading, onImageLoaded]);
  
  useEffect(() => {
    if (!isLoading && pieces.length > 0) {
      puzzleState.startNewPuzzle(difficulty);
    }
  }, [isLoading, pieces.length]);
  
  useEffect(() => {
    if (isSolved && !puzzleState.isComplete) {
      puzzleState.checkCompletion(gridSize * gridSize, gridSize * gridSize);
      playSound('complete');
    }
  }, [isSolved, puzzleState, gridSize, playSound]);
  
  useEffect(() => {
    if (!isSolved && pieces.length > 0) {
      const correctCount = pieces.filter((piece) => {
        const pieceNumber = parseInt(piece.id.split('-')[1]);
        return piece.position === pieceNumber;
      }).length;
      puzzleState.updateCorrectPieces(correctCount);
    }
  }, [pieces, isSolved, puzzleState]);
  
  useEffect(() => {
    if (!isSolved && pieces.length > 0 && puzzleState.isActive) {
      const hintInterval = setInterval(() => {
        checkForHints();
      }, 5000);
      
      return () => clearInterval(hintInterval);
    }
  }, [pieces, isSolved, puzzleState.isActive, checkForHints]);
  
  const containerSize = calculateContainerSize(isMobile, difficulty);
  
  const handleDirectionalMoveWithGrid = (direction: 'up' | 'down' | 'left' | 'right') => {
    handleDirectionalMove(direction, gridSize);
  };
  
  const totalPieces = gridSize * gridSize;
  
  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} width="600" height="600" className="hidden" />
      <img ref={imgRef} className="hidden" alt="Source" />
      
      <PuzzleStateDisplay 
        state={{
          ...puzzleState,
          isComplete: isSolved
        }}
        totalPieces={totalPieces}
        onNewGame={handleNewGame}
        onDifficultyChange={handleDifficultyChange}
        onTogglePause={puzzleState.togglePause}
      />
      
      <div className="mb-4">
        <SoundControls
          muted={muted}
          volume={volume}
          onToggleMute={toggleMute}
          onVolumeChange={changeVolume}
        />
      </div>
      
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
      
      <PuzzleGrid
        pieces={pieces}
        difficulty={difficulty}
        isSolved={isSolved}
        isLoading={isLoading}
        containerSize={containerSize}
        onDragStart={handleGridDragStart}
        onDrop={handleGridDrop}
        onPieceClick={handleGridPieceClick}
        getPieceStyle={(piece) => getImagePieceStyle(piece, selectedImage, gridSize)}
      />
      
      {(isMobile || draggedPiece) && !isSolved && !isLoading && (
        <DirectionalControls 
          draggedPiece={draggedPiece}
          onDirectionalMove={handleDirectionalMoveWithGrid}
        />
      )}
      
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
