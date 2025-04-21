import React, { useEffect, useState } from 'react';
import { useDeviceInfo } from '@/hooks/use-mobile';
import { useSimplePuzzlePieces } from './hooks/useSimplePuzzlePieces';
import { usePuzzleState } from './hooks/usePuzzleState';
import { createPieceHandlers } from './utils/pieceInteractionHandlers';
import { useSoundEffects } from './utils/useSoundEffects';
import { getRecommendedDifficulty, calculateContainerSize } from './utils/puzzleSizeUtils';
import SimplePuzzleGrid from './components/SimplePuzzleGrid';
import PuzzleStatusMessage from './components/PuzzleStatusMessage';
import { difficultyConfig, DifficultyLevel } from './types/puzzle-types';
import './styles/puzzle-animations.css';

import SimplePuzzleStateDisplay from './components/SimplePuzzleStateDisplay';
import SimplePuzzleControlPanel from './components/SimplePuzzleControlPanel';
import SimplePuzzleDirectionalControlsContainer from './components/SimplePuzzleDirectionalControlsContainer';

const SimplePuzzleGame: React.FC = () => {
  const deviceInfo = useDeviceInfo();
  const { isMobile, width, isTouchDevice } = deviceInfo;

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

  const { playSound, muted, toggleMute, volume, changeVolume } = useSoundEffects();

  const puzzleState = usePuzzleState('3x3');

  useEffect(() => {
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

  const handleGridDragStart = (e: React.MouseEvent | React.TouchEvent, piece: any) => {
    e.preventDefault(); 
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

  const handleNewGame = () => {
    handleShuffleClick();
    puzzleState.startNewPuzzle(puzzleState.difficulty);
  };

  const handleDifficultyChange = (difficulty: typeof puzzleState.difficulty) => {
    puzzleState.changeDifficulty(difficulty);
  };

  useEffect(() => {
    if (isSolved && !puzzleState.isComplete) {
      const gridSize = difficultyConfig[puzzleState.difficulty].gridSize;
      puzzleState.checkCompletion(gridSize * gridSize, gridSize * gridSize);
      playSound('complete');
    }
  }, [isSolved, puzzleState, playSound]);

  useEffect(() => {
    if (!isSolved) {
      const correctCount = pieces.filter((piece, index) => {
        const pieceNumber = parseInt(piece.id.split('-')[1]);
        return pieceNumber === index;
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

  const totalPieces = difficultyConfig[puzzleState.difficulty].gridSize ** 2;
  const containerSize = calculateContainerSize(isMobile, puzzleState.difficulty);

  return (
    <div className="flex flex-col items-center w-full max-w-full px-2">
      <div className={`w-full ${isMobile ? 'mb-2' : 'mb-4'}`}>
        <SimplePuzzleStateDisplay 
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
      <SimplePuzzleControlPanel
        muted={muted}
        volume={volume}
        onToggleMute={toggleMute}
        onVolumeChange={changeVolume}
        isMobile={isMobile}
        moveCount={moveCount}
        onShuffle={handleNewGame}
      />
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
      <SimplePuzzleDirectionalControlsContainer
        draggedPiece={draggedPiece}
        isSolved={isSolved}
        isMobile={isMobile}
        onDirectionalMove={(direction) => handleDirectionalMove(direction)}
        isTouchDevice={isTouchDevice}
      />
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
