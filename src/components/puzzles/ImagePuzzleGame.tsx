import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDeviceInfo } from '@/hooks/use-mobile';
import { difficultyConfig, DifficultyLevel, GameMode, PieceShape, VisualTheme } from './types/puzzle-types';
import { useImageLoading } from './hooks/useImageLoading';
import { usePuzzlePieces } from './hooks/usePuzzlePieces';
import { usePuzzleState } from './hooks/usePuzzleState';
import { usePuzzleGridEvents } from './hooks/usePuzzleGridEvents';
import { getImagePieceStyle } from './utils/pieceStyleUtils';
import { getRotationStyle, rotatePiece, initializeWithRotations, allPiecesCorrectlyRotated } from './utils/pieceRotationUtils';
import { createPieceHandlers } from './utils/pieceInteractionHandlers';
import { getRecommendedDifficulty, calculateContainerSize } from './utils/puzzleSizeUtils';
import { DEFAULT_IMAGES } from './types/puzzle-types';
import { useToast } from '@/hooks/use-toast';
import './styles/puzzle-animations.css';
import { usePuzzleSound } from './usePuzzleSound';
import { useImagePuzzleSave } from './useImagePuzzleSave';
import { usePuzzleCompletion } from './usePuzzleCompletion';
import ImagePuzzleContainer from './ImagePuzzleContainer';

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
  const { toast } = useToast();
  
  const initialDifficulty = getRecommendedDifficulty(width);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(initialDifficulty);
  
  const [selectedImage, setSelectedImage] = useState<string>(initialImage || sampleImages[0]);
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [pieceShape, setPieceShape] = useState<PieceShape>('standard');
  const [visualTheme, setVisualTheme] = useState<VisualTheme>('light');
  const [rotationEnabled, setRotationEnabled] = useState<boolean>(false);
  const [timeLimit, setTimeLimit] = useState<number>(300); // 5 minutes default
  
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
  
  useEffect(() => {
    // Apply piece rotations if in challenge mode or rotation enabled
    if (!isLoading && (gameMode === 'challenge' || rotationEnabled) && pieces.length > 0) {
      if (gameMode === 'challenge') {
        // For challenge mode, use random rotations
        setPieces(initializeWithRotations(pieces));
      } else if (rotationEnabled) {
        // For manual rotation, initialize with 0 degrees but allow rotation
        setPieces(pieces.map(piece => ({
          ...piece,
          rotation: 0
        })));
      }
    }
  }, [gameMode, rotationEnabled, isLoading, pieces.length]);
  
  // Handle piece rotation (click to rotate)
  const handlePieceRotation = useCallback((piece: { id: string }) => {
    if ((gameMode === 'challenge' || rotationEnabled) && !isSolved) {
      setPieces(prevPieces => {
        return prevPieces.map(p => {
          if (p.id === piece.id) {
            playSound('pickup');
            return rotatePiece(p);
          }
          return p;
        });
      });
      
      // Increment move count when rotating pieces
      setMoveCount(prev => prev + 1);
      puzzleState.incrementMoves();
    }
  }, [gameMode, rotationEnabled, isSolved, playSound, puzzleState]);
  
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
  
  // Override piece click to handle rotations
  const wrappedHandlePieceClick = (piece: any) => {
    if (gameMode === 'challenge' || rotationEnabled) {
      handlePieceRotation(piece);
    } else {
      handlePieceClick(piece);
    }
  };

  const gridEvents = usePuzzleGridEvents({
    draggedPiece,
    handleDragStart,
    handleMove,
    handleDrop,
    handlePieceClick: wrappedHandlePieceClick,
    handleDirectionalMove
  });

  useEffect(() => {
    if (initialImage && initialImage !== selectedImage) {
      setSelectedImage(initialImage);
      setIsLoading(true);
    }
  }, [initialImage, selectedImage, setIsLoading]);

  // Handle puzzle completion in the extracted hook
  usePuzzleCompletion({
    pieces,
    puzzleState,
    gridSize,
    playSound,
    gameMode,
    rotationEnabled,
    isSolved
  });

  useEffect(() => {
    if (!isSolved && pieces.length > 0) {
      const correctCount = pieces.filter((piece) => {
        const pieceNumber = parseInt(piece.id.split('-')[1]);
        const positionCorrect = piece.position === pieceNumber;
        
        if (gameMode === 'challenge' || rotationEnabled) {
          const rotationCorrect = (piece.rotation || 0) === 0;
          return positionCorrect && rotationCorrect;
        }
        
        return positionCorrect;
      }).length;
      
      puzzleState.updateCorrectPieces(correctCount);
    }
  }, [pieces, isSolved, puzzleState, gameMode, rotationEnabled]);

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
    puzzleState.startNewPuzzle(difficulty, gameMode, timeLimit);
  };

  const handleDifficultyChange = (newDifficulty: DifficultyLevel) => {
    setDifficulty(newDifficulty);
    puzzleState.changeDifficulty(newDifficulty);
    setIsLoading(true);
  };

  const handleTimeUp = () => {
    if (gameMode === 'timed' && puzzleState.isActive) {
      puzzleState.togglePause(); // Pause the game
      toast({
        title: "Time's Up!",
        description: "You ran out of time. Try again with a new game or adjust the time limit.",
        variant: "destructive",
      });
      playSound('complete'); // Use complete sound for time up alert
    }
  };

  const containerSize = calculateContainerSize(isMobile, difficulty);
  const totalPieces = gridSize * gridSize;

  // Save/load hook extracted
  const {
    savedGames,
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

  useEffect(() => {
    if (!isSolved && pieces.length > 0 && puzzleState.isActive) {
      const autoSaveInterval = setInterval(() => {
        const saveState = {
          id: currentGameId,
          name: `${gameMode.charAt(0).toUpperCase() + gameMode.slice(1)} Puzzle ${new Date().toLocaleTimeString()}`,
          timestamp: Date.now(),
          difficulty,
          pieces,
          moveCount,
          timeSpent: puzzleState.timeSpent,
          selectedImage,
          version: '1.0.0',
          gameMode,
          pieceShape,
          visualTheme,
          rotationEnabled,
          timeLimit
        };
        saveGame(saveState);
      }, 30000); // Auto save every 30 seconds

      return () => clearInterval(autoSaveInterval);
    }
  }, [pieces, isSolved, currentGameId, difficulty, moveCount, puzzleState.timeSpent, 
      selectedImage, gameMode, pieceShape, visualTheme, rotationEnabled, timeLimit, puzzleState.isActive, handleSave, saveGame]);

  const getThemeStyles = () => {
    switch (visualTheme) {
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

  // Move the container/content below controls to ImagePuzzleContainer
  return (
    <div className={`flex flex-col items-center w-full max-w-full px-2 ${getThemeStyles()}`}>
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

export default ImagePuzzleGame;
