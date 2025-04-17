
import React from 'react';
import SoundControls from './SoundControls';
import PuzzleControls from './PuzzleControls';
import { DifficultyLevel } from '../types/puzzle-types';

interface GameControlsLayoutProps {
  isMobile: boolean;
  muted: boolean;
  volume: number;
  toggleMute: () => void;
  changeVolume: (value: number) => void;
  moveCount: number;
  difficulty: DifficultyLevel;
  selectedImage: string;
  setSelectedImage: (image: string) => void;
  onShuffle: () => void;
  sampleImages: string[];
  isLoading: boolean;
  handleDifficultyChange: (difficulty: DifficultyLevel) => void;
}

const GameControlsLayout: React.FC<GameControlsLayoutProps> = ({
  isMobile,
  muted,
  volume,
  toggleMute,
  changeVolume,
  moveCount,
  difficulty,
  selectedImage,
  setSelectedImage,
  onShuffle,
  sampleImages,
  isLoading,
  handleDifficultyChange
}) => {
  return (
    <div className={`w-full flex ${isMobile ? 'flex-col' : 'flex-row'} items-center justify-center gap-2 mb-3`}>
      <div className={`${isMobile ? 'w-full mb-2' : 'mr-4'}`}>
        <SoundControls
          muted={muted}
          volume={volume}
          onToggleMute={toggleMute}
          onVolumeChange={changeVolume}
          isMobile={isMobile}
        />
      </div>
      
      <PuzzleControls
        moveCount={moveCount}
        difficulty={difficulty}
        setDifficulty={handleDifficultyChange}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        onShuffle={onShuffle}
        sampleImages={sampleImages}
        isLoading={isLoading}
        isMobile={isMobile}
      />
    </div>
  );
};

export default GameControlsLayout;
