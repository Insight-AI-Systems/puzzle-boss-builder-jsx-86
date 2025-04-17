
import React, { useEffect, useState } from 'react';
import { useDeviceInfo } from '@/hooks/use-mobile';
import { useSimplePuzzlePieces } from './hooks/useSimplePuzzlePieces';
import { usePuzzleState } from './hooks/usePuzzleState';
import { createPieceHandlers } from './utils/pieceInteractionHandlers';
import { useSoundEffects } from './utils/useSoundEffects';
import { getRecommendedDifficulty, calculateContainerSize } from './utils/puzzleSizeUtils';
import SimplePuzzleGrid from './components/SimplePuzzleGrid';
import SimplePuzzleControls from './components/SimplePuzzleControls';
import SimpleDirectionalControls from './components/SimpleDirectionalControls';
import PuzzleStatusMessage from './components/PuzzleStatusMessage';
import PuzzleStateDisplay from './components/PuzzleStateDisplay';
import SoundControls from './components/SoundControls';
import { difficultyConfig, DifficultyLevel } from './types/puzzle-types';
import './styles/puzzle-animations.css';

const SimplePuzzleGame: React.FC = () => {
  const deviceInfo = useDeviceInfo();
  const { isMobile, width, isTouchDevice } = deviceInfo;
  
  // Auto-suggest appropriate difficulty based on screen size
  const [recommendedDifficulty] = useState<DifficultyLevel>(
    getRecommendedDifficulty(width)
  );
  
  const {
    pieces,
    setPieces,
    draggedPiece,
    setDraggedPiece,
    moveCount,
    setMoveCount,
    isSolved,
    handleShuffleClick
  } = useSimplePuzzlePieces();
  
  // Initialize sound effects
  const { playSound, muted, toggleMute, volume, changeVolume } = useSoundEffects();
  
  // New puzzle state management
  const puzzleState = usePuzzleState('3x3');
  
  useEffect(() => {
    // If we detect a small screen on initial load, suggest the recommended difficulty
    if (isMobile && puzzleState.difficulty !== recommendedDifficulty) {
      puzzleState.changeDifficulty(recommendedDifficulty);
    }
  }, [isMobile, recommendedDifficulty]);
  
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
  
  // Adaptors for the SimplePuzzleGrid component's event handlers
  const handleGridDragStart = (e: React.MouseEvent | React.TouchEvent, piece: any) => {
    e.preventDefault(); // Prevent default touch behavior
    handleDragStart(piece);
  };
  
  const handleGridMove = (e: React.MouseEvent | React.TouchEvent, index: number) => {
    if (draggedPiece) {
      e.preventDefault(); // Prevent scrolling on touch devices
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
  
  // Start a new puzzle when shuffling
  const handleNewGame = () => {
    handleShuffleClick();
    puzzleState.startNewPuzzle(puzzleState.difficulty);
  };
  
  // Handle difficulty change
  const handleDifficultyChange = (difficulty: typeof puzzleState.difficulty) => {
    puzzleState.changeDifficulty(difficulty);
    // We don't automatically start a new game here to let user decide
  };
  
  // Check for puzzle completion
  useEffect(() => {
    if (isSolved && !puzzleState.isComplete) {
      const gridSize = difficultyConfig[puzzleState.difficulty].gridSize;
      puzzleState.checkCompletion(gridSize * gridSize, gridSize * gridSize);
      // Play completion sound
      playSound('complete');
    }
  }, [isSolved, puzzleState, playSound]);
  
  // Update correct pieces count
  useEffect(() => {
    if (!isSolved) {
      const correctCount = pieces.filter((piece, index) => {
        const pieceNumber = parseInt(piece.id.split('-')[1]);
        return pieceNumber === index;
      }).length;
      puzzleState.updateCorrectPieces(correctCount);
    }
  }, [pieces, isSolved, puzzleState]);
  
  // Periodically check for pieces that could be hinted
  useEffect(() => {
    if (!isSolved && pieces.length > 0 && puzzleState.isActive) {
      const hintInterval = setInterval(() => {
        checkForHints();
      }, 5000); // Check every 5 seconds
      
      return () => clearInterval(hintInterval);
    }
  }, [pieces, isSolved, puzzleState.isActive, checkForHints]);
  
  // Total pieces based on difficulty
  const totalPieces = difficultyConfig[puzzleState.difficulty].gridSize ** 2;
  
  // Calculate container size based on device
  const containerSize = calculateContainerSize(isMobile, puzzleState.difficulty);

  return (
    <div className="flex flex-col items-center w-full max-w-full px-2">
      {/* Game state display */}
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
      
      {/* Controls layout - stack for mobile, side-by-side for desktop */}
      <div className={`w-full flex ${isMobile ? 'flex-col' : 'flex-row'} items-center justify-center gap-2 mb-3`}>
        {/* Sound controls */}
        <div className={`${isMobile ? 'w-full mb-2' : 'mr-4'}`}>
          <SoundControls
            muted={muted}
            volume={volume}
            onToggleMute={toggleMute}
            onVolumeChange={changeVolume}
            isMobile={isMobile}
          />
        </div>
        
        <SimplePuzzleControls 
          moveCount={moveCount}
          onShuffle={handleNewGame}
          isMobile={isMobile}
        />
      </div>
      
      {/* Game grid at appropriate size */}
      <SimplePuzzleGrid 
        pieces={pieces}
        isSolved={isSolved}
        isMobile={isMobile}
        containerSize={containerSize}
        onDragStart={handleGridDragStart}
        onMove={handleGridMove}
        onDrop={handleGridDrop}
        onPieceClick={handleGridPieceClick}
        isTouchDevice={isTouchDevice}
      />
      
      {/* Show directional controls only when relevant */}
      {(isTouchDevice || draggedPiece) && !isSolved && (
        <SimpleDirectionalControls 
          draggedPiece={draggedPiece}
          isSolved={isSolved}
          isMobile={isMobile}
          onDirectionalMove={(direction) => handleDirectionalMove(direction, 3)}
        />
      )}
      
      <PuzzleStatusMessage 
        isSolved={isSolved}
        isLoading={false}
        isMobile={isMobile}
        moveCount={moveCount}
        isTouchDevice={isTouchDevice}
      />
    </div>
  );
};

export default SimplePuzzleGame;
