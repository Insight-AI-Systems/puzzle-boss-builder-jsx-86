
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { calculateContainerSize } from '../utils/puzzleSizeUtils';
import PuzzleStateWrapper from './PuzzleStateWrapper';
import PuzzleGameControls from './PuzzleGameControls';
import GameControlsLayout from './GameControlsLayout';
import PuzzleContainer from './PuzzleContainer';
import PuzzleCompletionHandler from './PuzzleCompletionHandler';

interface PuzzleGameLayoutProps {
  puzzleState: any;
  puzzlePieces: any;
  puzzleSettings: any;
  deviceInfo: any;
  selectedImage: string;
  setSelectedImage: (image: string) => void;
  isLoading: boolean;
  muted: boolean;
  volume: number;
  gridEvents: any;
  sampleImages: string[];
  getPieceStyle: (piece: any) => React.CSSProperties;
}

const PuzzleGameLayout: React.FC<PuzzleGameLayoutProps> = ({
  puzzleState,
  puzzlePieces,
  puzzleSettings,
  deviceInfo,
  selectedImage,
  setSelectedImage,
  isLoading,
  muted,
  volume,
  gridEvents,
  sampleImages,
  getPieceStyle
}) => {
  const { toast } = useToast();
  const { isMobile, isTouchDevice } = deviceInfo;
  const containerSize = calculateContainerSize(isMobile, puzzleSettings.difficulty);
  const totalPieces = puzzlePieces.gridSize * puzzlePieces.gridSize;

  return (
    <>
      <PuzzleStateWrapper
        puzzleState={puzzleState}
        gameMode={puzzleSettings.gameMode}
        timeLimit={puzzleSettings.timeLimit}
        isMobile={isMobile}
        totalPieces={totalPieces}
        onNewGame={puzzlePieces.handleShuffleClick}
        onDifficultyChange={puzzleSettings.setDifficulty}
        handleTimeUp={() => {
          if (puzzleSettings.gameMode === 'timed' && puzzleState.isActive) {
            puzzleState.togglePause();
            toast({
              title: "Time's Up!",
              description: "You ran out of time. Try again with a new game or adjust the time limit.",
              variant: "destructive",
            });
          }
        }}
      />
      
      <GameControlsLayout
        isMobile={isMobile}
        muted={muted}
        volume={volume}
        toggleMute={() => setMuted(prev => !prev)}
        changeVolume={setVolume}
        moveCount={puzzlePieces.moveCount}
        difficulty={puzzleSettings.difficulty}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        onShuffle={puzzlePieces.handleShuffleClick}
        sampleImages={sampleImages}
        isLoading={isLoading}
        handleDifficultyChange={puzzleSettings.setDifficulty}
      />

      <PuzzleContainer
        pieces={puzzlePieces.pieces}
        difficulty={puzzleSettings.difficulty}
        isSolved={puzzlePieces.isSolved}
        isLoading={isLoading}
        containerSize={containerSize}
        gridEvents={gridEvents}
        getPieceStyle={getPieceStyle}
        isTouchDevice={isTouchDevice}
        isMobile={isMobile}
        draggedPiece={puzzlePieces.draggedPiece}
        moveCount={puzzlePieces.moveCount}
        visualTheme={puzzleSettings.visualTheme}
      />

      <PuzzleCompletionHandler
        pieces={puzzlePieces.pieces}
        puzzleState={puzzleState}
        gridSize={puzzlePieces.gridSize}
        playSound={playSound}
        gameMode={puzzleSettings.gameMode}
        rotationEnabled={puzzleSettings.rotationEnabled}
        isSolved={puzzlePieces.isSolved}
      />
    </>
  );
};

export default PuzzleGameLayout;
