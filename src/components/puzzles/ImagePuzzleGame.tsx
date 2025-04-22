
import React, { useEffect, useState } from 'react';
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
import { calculateContainerSize } from './utils/puzzleSizeUtils';
import AudioProvider from './components/AudioProvider';
import PuzzleGameLayout from './components/PuzzleGameLayout';

const ImagePuzzleGame = ({
  sampleImages = DEFAULT_IMAGES,
  initialImage,
  isImageLoading: externalLoading,
  onImageLoaded
}) => {
  const deviceInfo = useDeviceInfo();
  const { isMobile, width, isTouchDevice } = deviceInfo;
  
  const initialDifficulty = getRecommendedDifficulty(width);
  const puzzleSettings = usePuzzleSettings(initialDifficulty);
  
  const [selectedImage, setSelectedImage] = useState<string>(initialImage || sampleImages[0]);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(50);
  const [playSound, setPlaySound] = useState(() => (name: string) => {});
  
  const { isLoading, setIsLoading } = useImageLoading({ 
    selectedImage, 
    externalLoading, 
    onImageLoaded 
  });
  
  useEffect(() => {
    if (initialImage && initialImage !== selectedImage) {
      setSelectedImage(initialImage);
      setIsLoading(true);
    }
  }, [initialImage, selectedImage, setIsLoading]);

  // Get puzzle state and pieces
  const puzzleState = usePuzzleState(puzzleSettings.difficulty, puzzleSettings.gameMode, puzzleSettings.timeLimit);
  const puzzlePieces = usePuzzlePieces(puzzleSettings.difficulty, selectedImage, isLoading, setIsLoading);
  
  const puzzleHandlers = usePuzzlePieceHandlers({
    pieces: puzzlePieces.pieces,
    setPieces: puzzlePieces.setPieces,
    draggedPiece: puzzlePieces.draggedPiece,
    setDraggedPiece: puzzlePieces.setDraggedPiece,
    incrementMoves: puzzleState.incrementMoves,
    isSolved: puzzlePieces.isSolved,
    playSound,
    gameMode: puzzleSettings.gameMode,
    rotationEnabled: puzzleSettings.rotationEnabled
  });

  const gridEvents = usePuzzleGridEvents({
    draggedPiece: puzzlePieces.draggedPiece,
    handleDragStart: puzzleHandlers.handleDragStart,
    handleMove: puzzleHandlers.handleMove,
    handleDrop: puzzleHandlers.handleDrop,
    handlePieceClick: puzzleHandlers.handlePieceClick,
    handleDirectionalMove: puzzleHandlers.handleDirectionalMove
  });

  return (
    <AudioProvider
      setPlaySound={setPlaySound}
      setMuted={setMuted}
      setVolume={setVolume}
    >
      <PuzzleGameLayout
        puzzleState={puzzleState}
        puzzlePieces={puzzlePieces}
        puzzleSettings={puzzleSettings}
        deviceInfo={deviceInfo}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        isLoading={isLoading}
        muted={muted}
        volume={volume}
        gridEvents={gridEvents}
        sampleImages={sampleImages}
        getPieceStyle={(piece) => {
          const baseStyle = getImagePieceStyle(piece, selectedImage, puzzlePieces.gridSize);
          const rotationStyle = getRotationStyle(piece.rotation);
          return { ...baseStyle, ...rotationStyle };
        }}
      />
    </AudioProvider>
  );
};

export default ImagePuzzleGame;
