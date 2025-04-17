
import React, { useRef, useEffect } from 'react';
import { useDeviceInfo } from '@/hooks/use-mobile';
import { difficultyConfig, DifficultyLevel } from './types/puzzle-types';
import { usePuzzlePieces } from './hooks/usePuzzlePieces';
import { usePuzzleState } from './hooks/usePuzzleState';
import { createPieceHandlers } from './utils/pieceInteractionHandlers';
import { calculateContainerSize, getRecommendedDifficulty } from './utils/puzzleSizeUtils';
import { useSoundEffects } from './utils/useSoundEffects';
import { useImageLoading } from './hooks/useImageLoading';
import { usePuzzleGridEvents } from './hooks/usePuzzleGridEvents';
import PuzzleGrid from './components/PuzzleGrid';
import DirectionalControls from './components/DirectionalControls';
import PuzzleStatusMessage from './components/PuzzleStatusMessage';
import PuzzleStateDisplay from './components/PuzzleStateDisplay';
import GameControlsLayout from './components/GameControlsLayout';
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Auto-suggest appropriate difficulty based on screen size
  const initialDifficulty = getRecommendedDifficulty(width);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(initialDifficulty);
  
  const [selectedImage, setSelectedImage] = useState<string>(initialImage || sampleImages[0]);
  
  const { isLoading, setIsLoading } = useImageLoading({ 
    selectedImage, 
    externalLoading, 
    onImageLoaded 
  });
  
  const { playSound, muted, toggleMute, volume, changeVolume } = useSoundEffects();
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

  const gridEvents = usePuzzleGridEvents({
    draggedPiece,
    handleDragStart,
    handleMove,
    handleDrop,
    handlePieceClick
  });

  useEffect(() => {
    if (initialImage && initialImage !== selectedImage) {
      setSelectedImage(initialImage);
      setIsLoading(true);
    }
  }, [initialImage, selectedImage]);

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

  const handleNewGame = () => {
    handleShuffleClick();
    puzzleState.startNewPuzzle(difficulty);
  };

  const handleDifficultyChange = (newDifficulty: DifficultyLevel) => {
    setDifficulty(newDifficulty);
    puzzleState.changeDifficulty(newDifficulty);
    setIsLoading(true);
  };

  const containerSize = calculateContainerSize(isMobile, difficulty);
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
      
      <GameControlsLayout 
        isMobile={isMobile}
        muted={muted}
        volume={volume}
        toggleMute={toggleMute}
        changeVolume={changeVolume}
        moveCount={moveCount}
        difficulty={difficulty}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        onShuffle={handleNewGame}
        sampleImages={sampleImages}
        isLoading={isLoading}
        handleDifficultyChange={handleDifficultyChange}
      />
      
      <PuzzleGrid
        pieces={pieces}
        difficulty={difficulty}
        isSolved={isSolved}
        isLoading={isLoading}
        containerSize={containerSize}
        onDragStart={gridEvents.handleGridDragStart}
        onMove={gridEvents.handleGridMove}
        onDrop={gridEvents.handleGridDrop}
        onPieceClick={gridEvents.handleGridPieceClick}
        getPieceStyle={(piece) => getImagePieceStyle(piece, selectedImage, gridSize)}
        isTouchDevice={isTouchDevice}
        isMobile={isMobile}
      />
      
      {(isTouchDevice || draggedPiece) && !isSolved && !isLoading && (
        <DirectionalControls 
          draggedPiece={draggedPiece}
          onDirectionalMove={(direction) => handleDirectionalMove(direction, gridSize)}
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
