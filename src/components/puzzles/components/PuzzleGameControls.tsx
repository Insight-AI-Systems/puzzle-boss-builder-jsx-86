
import React from 'react';
import SaveLoadControls from './SaveLoadControls';
import GameSettings from './GameSettings';
import { DifficultyLevel, GameMode, PieceShape, VisualTheme } from '../types/puzzle-types';
import { SavedPuzzleState } from '../types/save-types';

interface PuzzleGameControlsProps {
  onSave: () => void;
  onLoad: (save: SavedPuzzleState) => void;
  onDelete: (id: string) => void;
  savedGames: SavedPuzzleState[];
  currentGameId: string;
  isLoading: boolean;
  isMobile: boolean;
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  difficulty: DifficultyLevel;
  setDifficulty: (difficulty: DifficultyLevel) => void;
  pieceShape: PieceShape;
  setPieceShape: (shape: PieceShape) => void;
  visualTheme: VisualTheme;
  setVisualTheme: (theme: VisualTheme) => void;
  rotationEnabled: boolean;
  setRotationEnabled: (enabled: boolean) => void;
  timeLimit: number;
  setTimeLimit: (limit: number) => void;
}

const PuzzleGameControls: React.FC<PuzzleGameControlsProps> = ({
  onSave,
  onLoad,
  onDelete,
  savedGames,
  currentGameId,
  isLoading,
  isMobile,
  gameMode,
  setGameMode,
  difficulty,
  setDifficulty,
  pieceShape,
  setPieceShape,
  visualTheme,
  setVisualTheme,
  rotationEnabled,
  setRotationEnabled,
  timeLimit,
  setTimeLimit
}) => {
  return (
    <div className="w-full mb-4 flex flex-col md:flex-row gap-2 justify-between">
      <SaveLoadControls
        onSave={onSave}
        onLoad={onLoad}
        onDelete={onDelete}
        savedGames={savedGames}
        currentGameId={currentGameId}
        isLoading={isLoading}
        isMobile={isMobile}
      />
      
      <GameSettings
        gameMode={gameMode}
        setGameMode={setGameMode}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
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
  );
};

export default PuzzleGameControls;
