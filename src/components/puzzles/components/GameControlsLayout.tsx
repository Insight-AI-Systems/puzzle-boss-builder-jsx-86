
import React from 'react';
import { DifficultyLevel } from '../types/puzzle-types';

interface GameControlsLayoutProps {
  isMobile: boolean;
  muted: boolean;
  volume: number;
  toggleMute: () => void;
  changeVolume: (volume: number) => void;
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
    <div className="w-full flex flex-col gap-4 mb-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {muted ? 'Unmute' : 'Mute'}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => changeVolume(Number(e.target.value))}
            className="w-24"
          />
        </div>
        <div className="flex items-center gap-2">
          <span>Moves: {moveCount}</span>
          <button
            onClick={onShuffle}
            className="px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600"
            disabled={isLoading}
          >
            New Game
          </button>
        </div>
      </div>
      {!isMobile && (
        <div className="flex items-center gap-2">
          <select
            value={selectedImage}
            onChange={(e) => setSelectedImage(e.target.value)}
            className="p-2 border rounded-md"
          >
            {sampleImages.map((img, idx) => (
              <option key={img} value={img}>
                Image {idx + 1}
              </option>
            ))}
          </select>
          <select
            value={difficulty}
            onChange={(e) => handleDifficultyChange(e.target.value as DifficultyLevel)}
            className="p-2 border rounded-md"
          >
            <option value="3x3">Easy (3×3)</option>
            <option value="4x4">Medium (4×4)</option>
            <option value="5x5">Hard (5×5)</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default GameControlsLayout;
