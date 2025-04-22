
import React from 'react';
import { DifficultyLevel, GameMode, PieceShape, VisualTheme } from '../types/puzzle-types';
import { SavedPuzzleState } from '../types/save-types';
import { SaveLoadGroup } from './controls/SaveLoadGroup';
import { GameSettingsGroup } from './controls/GameSettingsGroup';
import { SoundGroup } from './controls/SoundGroup';

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
  muted: boolean;
  volume: number;
  onToggleMute: () => void;
  onVolumeChange: (value: number) => void;
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
  setTimeLimit,
  muted,
  volume,
  onToggleMute,
  onVolumeChange
}) => {
  return (
    <div className="w-full mb-4 flex flex-col md:flex-row gap-2 justify-between">
      <SaveLoadGroup
        onSave={onSave}
        onLoad={onLoad}
        onDelete={onDelete}
        savedGames={savedGames}
        currentGameId={currentGameId}
        isLoading={isLoading}
        isMobile={isMobile}
      />
      
      <div className="flex items-center gap-4">
        <SoundGroup
          muted={muted}
          volume={volume}
          onToggleMute={onToggleMute}
          onVolumeChange={onVolumeChange}
          isMobile={isMobile}
        />
        
        <GameSettingsGroup
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
    </div>
  );
};

export default PuzzleGameControls;

