
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shuffle, Image as ImageIcon } from 'lucide-react';
import { DifficultyLevel } from '../types/puzzle-types';

interface PuzzleControlsProps {
  moveCount: number;
  difficulty: DifficultyLevel;
  setDifficulty: (difficulty: DifficultyLevel) => void;
  selectedImage: string;
  setSelectedImage: (image: string) => void;
  onShuffle: () => void;
  sampleImages: string[];
  isLoading: boolean;
}

const PuzzleControls: React.FC<PuzzleControlsProps> = ({
  moveCount,
  difficulty,
  setDifficulty,
  selectedImage,
  setSelectedImage,
  onShuffle,
  sampleImages,
  isLoading
}) => {
  return (
    <div className="mb-4 w-full max-w-[360px]">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-puzzle-aqua">
          Moves: {moveCount}
        </div>
        <Button 
          onClick={onShuffle}
          className="bg-puzzle-gold hover:bg-puzzle-gold/80 text-black"
        >
          <Shuffle className="w-4 h-4 mr-2" />
          Shuffle
        </Button>
      </div>
      
      {/* Difficulty and image selectors */}
      <div className="flex justify-between gap-2 mb-2">
        <div className="w-1/2">
          <Select 
            value={difficulty} 
            onValueChange={(value: string) => setDifficulty(value as DifficultyLevel)}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3x3">Easy (3×3)</SelectItem>
              <SelectItem value="4x4">Medium (4×4)</SelectItem>
              <SelectItem value="5x5">Hard (5×5)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Image selector */}
        <div className="w-1/2">
          <Select 
            value={selectedImage} 
            onValueChange={setSelectedImage}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full">
              <ImageIcon className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Image" />
            </SelectTrigger>
            <SelectContent>
              {sampleImages.map((img, index) => (
                <SelectItem key={img} value={img}>
                  Image {index + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default PuzzleControls;
