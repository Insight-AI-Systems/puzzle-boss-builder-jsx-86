
import React, { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSimplePuzzlePieces } from './hooks/useSimplePuzzlePieces';
import { usePuzzleState } from './hooks/usePuzzleState';
import { createPieceHandlers } from './utils/pieceInteractionHandlers';
import { useSoundEffects } from './utils/useSoundEffects';
import SimplePuzzleGrid from './components/SimplePuzzleGrid';
import SimplePuzzleControls from './components/SimplePuzzleControls';
import SimpleDirectionalControls from './components/SimpleDirectionalControls';
import PuzzleStatusMessage from './components/PuzzleStatusMessage';
import PuzzleStateDisplay from './components/PuzzleStateDisplay';
import SoundControls from './components/SoundControls';
import { difficultyConfig } from './types/puzzle-types';
import './styles/puzzle-animations.css';

const SimplePuzzleGame: React.FC = () => {
  const isMobile = useIsMobile();
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
    playSound // Pass the playSound function
  );
  
  // Adaptors for the SimplePuzzleGrid component's event handlers
  const handleGridDragStart = (e: React.MouseEvent | React.TouchEvent, piece: any) => {
    handleDragStart(piece);
  };
  
  const handleGridMove = (e: React.MouseEvent | React.TouchEvent, index: number) => {
    if (draggedPiece) {
      handleMove(draggedPiece, index);
    }
  };
  
  const handleGridDrop = (e: React.MouseEvent | React.TouchEvent, index: number) => {
    if (draggedPiece) {
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

  return (
    <div className="flex flex-col items-center">
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
      
      {/* Sound controls */}
      <div className="mb-4">
        <SoundControls
          muted={muted}
          volume={volume}
          onToggleMute={toggleMute}
          onVolumeChange={changeVolume}
        />
      </div>
      
      <SimplePuzzleControls 
        moveCount={moveCount}
        onShuffle={handleNewGame}
      />
      
      <SimplePuzzleGrid 
        pieces={pieces}
        isSolved={isSolved}
        isMobile={isMobile}
        onDragStart={handleGridDragStart}
        onMove={handleGridMove}
        onDrop={handleGridDrop}
        onPieceClick={handleGridPieceClick}
      />
      
      <SimpleDirectionalControls 
        draggedPiece={draggedPiece}
        isSolved={isSolved}
        isMobile={isMobile}
        onDirectionalMove={(direction) => handleDirectionalMove(direction, 3)}
      />
      
      <PuzzleStatusMessage 
        isSolved={isSolved}
        isLoading={false}
        isMobile={!!isMobile}
        moveCount={moveCount}
      />
    </div>
  );
};

export default SimplePuzzleGame;
