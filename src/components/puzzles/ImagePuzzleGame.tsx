import React, { useState, useEffect } from 'react';
import { useDeviceInfo } from '@/hooks/use-mobile';
import { DifficultyLevel, GameMode, PieceShape, VisualTheme } from './types/puzzle-types';
import { useImageLoading } from './hooks/useImageLoading';
import { usePuzzlePieces } from '@/hooks/puzzles/usePuzzlePieces';
import { usePuzzleState } from '@/hooks/puzzles/usePuzzleState';
import { usePuzzleGridEvents } from './hooks/usePuzzleGridEvents';
import { getImagePieceStyle } from './utils/pieceStyleUtils';
import { getRotationStyle } from './utils/pieceRotationUtils';
import { DEFAULT_IMAGES } from './types/puzzle-types';
import { usePuzzleSound } from './usePuzzleSound';
import { useImagePuzzleSave } from './useImagePuzzleSave';
import { usePuzzleCompletion } from './usePuzzleCompletion';
import ImagePuzzleContainer from './ImagePuzzleContainer';
import PuzzleStateDisplay from './components/PuzzleStateDisplay';
import TimedModeBanner from './components/TimedModeBanner';
import SaveLoadControls from './components/SaveLoadControls';
import GameSettings from './components/GameSettings';
import GameControlsLayout from './components/GameControlsLayout';
import { getRecommendedDifficulty, calculateContainerSize } from './utils/puzzleSizeUtils';
import { useToast } from '@/hooks/use-toast';
import { handlePieceMove, handlePieceDrop } from './utils/pieceMovementHandlers';

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
  const { toast } = useToast();
  
  const initialDifficulty = getRecommendedDifficulty(width);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(initialDifficulty);
  
  const [selectedImage, setSelectedImage] = useState<string>(initialImage || sampleImages[0]);
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [pieceShape, setPieceShape] = useState<PieceShape>('standard');
  const [visualTheme, setVisualTheme] = useState<VisualTheme>('light');
  const [rotationEnabled, setRotationEnabled] = useState<boolean>(false);
  const [timeLimit, setTimeLimit] = useState<number>(300);
  
  const { playSound, muted, toggleMute, volume, changeVolume } = usePuzzleSound();
  
  const { isLoading, setIsLoading } = useImageLoading({ 
    selectedImage, 
    externalLoading, 
    onImageLoaded 
  });
  
  const puzzleState = usePuzzleState(difficulty, gameMode, timeLimit);
  
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
    savedGames,
    saveGame,
    handleSave,
    handleLoad,
    deleteSave,
    currentGameId,
  } = useImagePuzzleSave(
    puzzleState,
    difficulty,
    pieces,
    moveCount,
    selectedImage,
    gameMode,
    pieceShape,
    visualTheme,
    rotationEnabled,
    timeLimit,
    setPieces,
    setMoveCount,
    setDifficulty,
    setGameMode,
    setPieceShape,
    setVisualTheme,
    setRotationEnabled,
    setTimeLimit
  );

  const handlePieceClick = (piece) => {
    // Handle piece click logic
    playSound('pickup');
  };

  const gridEvents = usePuzzleGridEvents({
    draggedPiece,
    handleDragStart: (piece) => {
      setDraggedPiece(piece);
      playSound('pickup');
    },
    handleMove: (piece, index) => {
      if (draggedPiece && draggedPiece.id === piece.id) {
        setPieces(prev => {
          const moved = handlePieceMove(prev, draggedPiece, index);
          puzzleState.incrementMoves();
          playSound('place');
          return moved;
        });
      }
    },
    handleDrop: () => {
      if (draggedPiece) {
        setPieces(prev => handlePieceDrop(prev, draggedPiece));
        setDraggedPiece(null);
      }
    },
    handlePieceClick: (piece) => {
      handlePieceClick(piece);
      playSound('pickup');
    },
    handleDirectionalMove: (direction) => {
      // Handle directional move logic
      if (!draggedPiece) return;
      
      // Implementation depends on your grid layout
      console.log(`Move ${draggedPiece.id} to ${direction}`);
    }
  });

  useEffect(() => {
    if (initialImage && initialImage !== selectedImage) {
      setSelectedImage(initialImage);
      setIsLoading(true);
    }
  }, [initialImage, selectedImage, setIsLoading]);

  // Use puzzle completion hook
  usePuzzleCompletion({
    pieces,
    puzzleState,
    gridSize,
    playSound,
    gameMode,
    rotationEnabled,
    isSolved
  });

  const handleNewGame = () => {
    handleShuffleClick();
    puzzleState.startNewPuzzle(difficulty, gameMode, timeLimit);
  };

  const handleDifficultyChange = (newDifficulty: DifficultyLevel) => {
    setDifficulty(newDifficulty);
    puzzleState.changeDifficulty(newDifficulty);
    setIsLoading(true);
  };

  const handleTimeUp = () => {
    if (gameMode === 'timed' && puzzleState.isActive) {
      puzzleState.togglePause();
      toast({
        title: "Time's Up!",
        description: "You ran out of time. Try again with a new game or adjust the time limit.",
        variant: "destructive",
      });
      playSound('complete');
    }
  };

  const containerSize = calculateContainerSize(isMobile, difficulty);
  const totalPieces = gridSize * gridSize;

  return (
    <div className={`flex flex-col items-center w-full max-w-full px-2 ${getThemeStyles(visualTheme)}`}>
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
      
      {gameMode === 'timed' && (
        <div className="w-full mb-4">
          <TimedModeBanner
            timeLimit={timeLimit}
            timeSpent={puzzleState.timeSpent}
            isActive={puzzleState.isActive}
            onTimeUp={handleTimeUp}
            isMobile={isMobile}
          />
        </div>
      )}

      <div className="w-full mb-4 flex flex-col md:flex-row gap-2 justify-between">
        <SaveLoadControls
          onSave={handleSave}
          onLoad={handleLoad}
          onDelete={deleteSave}
          savedGames={savedGames}
          currentGameId={currentGameId}
          isLoading={isLoading}
          isMobile={isMobile}
        />
        
        <GameSettings
          gameMode={gameMode}
          setGameMode={setGameMode}
          difficulty={difficulty}
          setDifficulty={handleDifficultyChange}
          pieceShape={pieceShape}
          setPieceShape={setPieceShape}
          visualTheme={visualTheme}
          setVisualTheme={setVisualTheme}
          rotationEnabled={rotationEnabled}
          setRotationEnabled={setRotationEnabled}
          timeLimit={timeLimit}
          setTimeLimit={setTimeLimit}
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

      <ImagePuzzleContainer
        pieces={pieces}
        difficulty={difficulty}
        isSolved={isSolved}
        isLoading={isLoading}
        containerSize={containerSize}
        gridEvents={gridEvents}
        getPieceStyle={(piece) => {
          const baseStyle = getImagePieceStyle(piece, selectedImage, gridSize);
          const rotationStyle = getRotationStyle(piece.rotation);
          return { ...baseStyle, ...rotationStyle };
        }}
        isTouchDevice={isTouchDevice}
        isMobile={isMobile}
        draggedPiece={draggedPiece}
        moveCount={moveCount}
      />
    </div>
  );
};

const getThemeStyles = (theme: VisualTheme) => {
  switch (theme) {
    case 'light':
      return 'bg-white';
    case 'dark':
      return 'bg-gray-900 text-white';
    case 'colorful':
      return 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white';
    default:
      return 'bg-white';
  }
};

export default ImagePuzzleGame;
