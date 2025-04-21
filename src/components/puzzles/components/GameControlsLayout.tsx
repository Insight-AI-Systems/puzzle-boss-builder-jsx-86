
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import ImageSelector from './ImageSelector';
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
  if (isMobile) {
    return (
      <div className="w-full mb-4 flex flex-wrap gap-2 justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="h-8 w-8 p-0" 
            onClick={toggleMute}
          >
            {muted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          
          <Slider
            value={[muted ? 0 : volume]}
            max={100}
            min={0}
            step={5}
            className="w-20"
            onValueChange={(vals) => changeVolume(vals[0])}
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onShuffle}
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Shuffle</span>
          </Button>
        </div>
      </div>
    );
  }
  
  // Desktop layout
  return (
    <div className="w-full mb-6 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={onShuffle}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>New Game / Shuffle</span>
        </Button>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMute}
            className="h-8 w-8"
          >
            {muted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          
          <Slider
            value={[muted ? 0 : volume]}
            max={100}
            min={0}
            step={5}
            className="w-24"
            onValueChange={(vals) => changeVolume(vals[0])}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <ImageSelector
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          sampleImages={sampleImages}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default GameControlsLayout;
