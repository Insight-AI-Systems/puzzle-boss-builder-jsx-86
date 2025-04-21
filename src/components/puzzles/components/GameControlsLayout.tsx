
import React from 'react';
import ImageSelector from './ImageSelector';
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
    <div className={`w-full flex ${isMobile ? 'flex-col' : 'flex-row'} gap-2 mb-4`}>
      <div className={`${isMobile ? 'w-full' : 'w-1/2'} flex flex-col gap-2`}>
        <div className="flex items-center justify-between gap-2 p-2 bg-black/10 rounded-lg">
          <span className={`font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>
            Moves: <span className="font-bold">{moveCount}</span>
          </span>
          
          <SoundControls
            muted={muted}
            volume={volume}
            toggleMute={toggleMute}
            changeVolume={changeVolume}
            isMobile={isMobile}
          />
        </div>
        
        <PuzzleControls
          onShuffle={onShuffle}
          difficulty={difficulty}
          setDifficulty={handleDifficultyChange}
          isLoading={isLoading}
          isMobile={isMobile}
        />
      </div>
      
      <div className={`${isMobile ? 'w-full' : 'w-1/2'} flex flex-col gap-2`}>
        <ImageSelector
          selectedImage={selectedImage}
          onSelectImage={setSelectedImage}
          sampleImages={sampleImages}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default GameControlsLayout;
