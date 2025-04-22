
import React, { useState, useCallback, useEffect } from 'react';
import { useDeviceInfo } from '@/hooks/use-mobile';
import { useImageLoading } from './hooks/useImageLoading';
import { usePuzzlePieces } from '@/hooks/puzzles/usePuzzlePieces';
import { usePuzzleState } from '@/hooks/puzzles/usePuzzleState';
import { usePuzzleGridEvents } from './hooks/usePuzzleGridEvents';
import { getImagePieceStyle } from './utils/pieceStyleUtils';
import { getRotationStyle } from './utils/pieceRotationUtils';
import { DEFAULT_IMAGES } from './types/puzzle-types';
import { useImagePuzzleSave } from './useImagePuzzleSave';
import { usePuzzleCompletion } from './usePuzzleCompletion';
import { usePuzzlePieceHandlers } from './hooks/usePuzzlePieceHandlers';
import { usePuzzleSettings } from './hooks/usePuzzleSettings';
import { useToast } from '@/hooks/use-toast';
import GameControlsLayout from './components/GameControlsLayout';
import PuzzleCompletionHandler from './components/PuzzleCompletionHandler';
import { getRecommendedDifficulty, calculateContainerSize } from './utils/puzzleSizeUtils';
import PuzzleStateWrapper from './components/PuzzleStateWrapper';
import AudioProvider from './components/AudioProvider';
import PuzzleContainer from './components/PuzzleContainer';
import PuzzleGameControls from './components/PuzzleGameControls';

const ImagePuzzleGame = ({
  sampleImages = DEFAULT_IMAGES,
  initialImage,
  isImageLoading: externalLoading,
  onImageLoaded
}) => {
  const deviceInfo = useDeviceInfo();
  const { isMobile, width, isTouchDevice } = deviceInfo;
  const { toast } = useToast();
  
  const initialDifficulty = getRecommendedDifficulty(width);
  const puzzleSettings = usePuzzleSettings(initialDifficulty);
  const {
    difficulty, setDifficulty,
    gameMode, setGameMode,
    pieceShape, setPieceShape,
    visualTheme, setVisualTheme,
    rotationEnabled, setRotationEnabled,
    timeLimit, setTimeLimit
  } = puzzleSettings;
  
  const [selectedImage, setSelectedImage] = useState<string>(initialImage || sampleImages[0]);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(50);
  const [playSound, setPlaySound] = useState(() => (name: string) => {});
  
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

  const puzzlePieceHandlers = usePuzzlePieceHandlers({
    pieces,
    setPieces,
    draggedPiece,
    setDraggedPiece,
    incrementMoves: puzzleState.incrementMoves,
    isSolved,
    playSound,
    gameMode,
    rotationEnabled
  });

  const gridEvents = usePuzzleGridEvents({
    draggedPiece,
    handleDragStart: puzzlePieceHandlers.handleDragStart,
    handleMove: puzzlePieceHandlers.handleMove,
    handleDrop: puzzlePieceHandlers.handleDrop,
    handlePieceClick: puzzlePieceHandlers.handlePieceClick,
    handleDirectionalMove: puzzlePieceHandlers.handleDirectionalMove
  });

  useEffect(() => {
    if (initialImage && initialImage !== selectedImage) {
      setSelectedImage(initialImage);
      setIsLoading(true);
    }
  }, [initialImage, selectedImage, setIsLoading]);

  const handleNewGame = () => {
    handleShuffleClick();
    puzzleState.startNewPuzzle(difficulty, gameMode, timeLimit);
  };

  const handleDifficultyChange = (newDifficulty) => {
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

  const handlePlaySound = useCallback((name: string) => {
    if (typeof playSound === 'function') {
      playSound(name);
    }
  }, [playSound]);

  return (
    <AudioProvider
      setPlaySound={setPlaySound}
      setMuted={setMuted}
      setVolume={setVolume}
    >
      <PuzzleStateWrapper
        puzzleState={puzzleState}
        gameMode={gameMode}
        timeLimit={timeLimit}
        isMobile={isMobile}
        totalPieces={totalPieces}
        onNewGame={handleNewGame}
        onDifficultyChange={handleDifficultyChange}
        handleTimeUp={handleTimeUp}
      />
      
      <PuzzleGameControls
        onSave={handleSave}
        onLoad={handleLoad}
        onDelete={deleteSave}
        savedGames={savedGames}
        currentGameId={currentGameId}
        isLoading={isLoading}
        isMobile={isMobile}
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
        muted={muted}
        volume={volume}
        onToggleMute={() => setMuted(prev => !prev)}
        onVolumeChange={setVolume}
      />
        
      <GameControlsLayout 
        isMobile={isMobile}
        muted={muted}
        volume={volume}
        toggleMute={() => setMuted(prev => !prev)}
        changeVolume={setVolume}
        moveCount={moveCount}
        difficulty={difficulty}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        onShuffle={handleNewGame}
        sampleImages={sampleImages}
        isLoading={isLoading}
        handleDifficultyChange={handleDifficultyChange}
      />

      <PuzzleContainer
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
        visualTheme={visualTheme}
      />

      <PuzzleCompletionHandler
        pieces={pieces}
        puzzleState={puzzleState}
        gridSize={gridSize}
        playSound={handlePlaySound}
        gameMode={gameMode}
        rotationEnabled={rotationEnabled}
        isSolved={isSolved}
      />
    </AudioProvider>
  );
};

export default ImagePuzzleGame;
