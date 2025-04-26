
import React, { useState } from 'react';
import { DifficultyLevel } from '../types/puzzle-types';
import { ImageSelectionDialog } from './controls/ImageSelectionDialog';
import { DifficultySelector } from './controls/DifficultySelector';
import { ShuffleButton } from './controls/ShuffleButton';

interface PuzzleControlsProps {
  moveCount: number;
  difficulty: DifficultyLevel;
  setDifficulty: (difficulty: DifficultyLevel) => void;
  selectedImage: string;
  setSelectedImage: (image: string) => void;
  onShuffle: () => void;
  sampleImages: string[];
  isLoading: boolean;
  isMobile?: boolean;
}

const PuzzleControls: React.FC<PuzzleControlsProps> = ({
  difficulty,
  setDifficulty,
  selectedImage,
  setSelectedImage,
  onShuffle,
  sampleImages,
  isLoading,
  isMobile = false
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLibrarySelectorOpen, setIsLibrarySelectorOpen] = useState(false);
  
  if (isMobile) {
    return (
      <div className="flex justify-between items-center w-full">
        <ImageSelectionDialog
          selectedImage={selectedImage}
          onSelectImage={setSelectedImage}
          sampleImages={sampleImages}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          isLibrarySelectorOpen={isLibrarySelectorOpen}
          setIsLibrarySelectorOpen={setIsLibrarySelectorOpen}
          isLoading={isLoading}
          isMobile={true}
        />
        
        <div className="flex space-x-1 items-center">
          <ShuffleButton
            onShuffle={onShuffle}
            isLoading={isLoading}
            isMobile={true}
          />
          
          <DifficultySelector
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            isLoading={isLoading}
            isMobile={true}
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex justify-between items-center w-full max-w-md">
      <div className="flex space-x-2 items-center">
        <ImageSelectionDialog
          selectedImage={selectedImage}
          onSelectImage={setSelectedImage}
          sampleImages={sampleImages}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          isLibrarySelectorOpen={isLibrarySelectorOpen}
          setIsLibrarySelectorOpen={setIsLibrarySelectorOpen}
          isLoading={isLoading}
        />
        
        <DifficultySelector
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          isLoading={isLoading}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <ShuffleButton
          onShuffle={onShuffle}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default PuzzleControls;
