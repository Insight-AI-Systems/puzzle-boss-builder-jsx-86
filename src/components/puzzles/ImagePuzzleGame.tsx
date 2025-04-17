
import React, { useState, useRef, useEffect } from 'react';
import { useDeviceInfo } from '@/hooks/use-mobile';
import { DEFAULT_IMAGES, DifficultyLevel, difficultyConfig } from './types/puzzle-types';
import { usePuzzlePieces } from './hooks/usePuzzlePieces';
import { usePuzzleState } from './hooks/usePuzzleState';
import { createPieceHandlers, getImagePieceStyle } from './utils/pieceInteractionHandlers';
import { calculateContainerSize, getRecommendedDifficulty } from './utils/puzzleSizeUtils';
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
  const deviceInfo = useDeviceInfo();
  const { isMobile, width, isTouchDevice } = deviceInfo;
  
  // Auto-suggest appropriate difficulty based on screen size
  const initialDifficulty = getRecommendedDifficulty(width);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(initialDifficulty);
  
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
    handleMove,
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
    e.preventDefault(); // Prevent default scroll/zoom behaviors
    handleDragStart(piece);
  };
  
  const handleGridMove = (e: React.MouseEvent | React.TouchEvent, index: number) => {
    if (draggedPiece) {
      e.preventDefault();
      handleMove(draggedPiece, index);
    }
  };
  
  const handleGridDrop = (e: React.MouseEvent | React.TouchEvent, index: number) => {
    if (draggedPiece) {
      e.preventDefault();
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
    <div className="flex flex-col items-center w-full max-w-full px-2">
      <canvas ref={canvasRef} width="600" height="600" className="hidden" />
      <img ref={imgRef} className="hidden" alt="Source" />
      
      <div className={`w-full ${isMobile ? 'mb-2' : 'mb-4'}`}>
        <PuzzleStateDisplay 
          state={{
            ...puzzleState,
            isComplete: isSolved
          }}
          totalPieces={totalPieces}
          onNewGame={handleNewGame}
          onDifficultyChange={handleDifficultyChange}
          onTogglePause={puzzleState.togglePause}
          isMobile={isMobile}
        />
      </div>
      
      <div className={`w-full flex ${isMobile ? 'flex-col' : 'flex-row'} items-center justify-center gap-2 mb-3`}>
        <div className={`${isMobile ? 'w-full mb-2' : 'mr-4'}`}>
          <SoundControls
            muted={muted}
            volume={volume}
            onToggleMute={toggleMute}
            onVolumeChange={changeVolume}
            isMobile={isMobile}
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
          isMobile={isMobile}
        />
      </div>
      
      <PuzzleGrid
        pieces={pieces}
        difficulty={difficulty}
        isSolved={isSolved}
        isLoading={isLoading}
        containerSize={containerSize}
        onDragStart={handleGridDragStart}
        onMove={handleGridMove}
        onDrop={handleGridDrop}
        onPieceClick={handleGridPieceClick}
        getPieceStyle={(piece) => getImagePieceStyle(piece, selectedImage, gridSize)}
        isTouchDevice={isTouchDevice}
        isMobile={isMobile}
      />
      
      {(isTouchDevice || draggedPiece) && !isSolved && !isLoading && (
        <DirectionalControls 
          draggedPiece={draggedPiece}
          onDirectionalMove={handleDirectionalMoveWithGrid}
          isMobile={isMobile}
        />
      )}
      
      <PuzzleStatusMessage
        isSolved={isSolved}
        isLoading={isLoading}
        isMobile={isMobile}
        moveCount={moveCount}
        isTouchDevice={isTouchDevice}
      />
    </div>
  );
};

export default ImagePuzzleGame;
