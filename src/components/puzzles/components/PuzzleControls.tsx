
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, Image } from 'lucide-react';
import { DifficultyLevel } from '../types/puzzle-types';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ImageSelector from './ImageSelector';
import { PuzzleImage } from '../constants/puzzle-images';

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
  moveCount,
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
  
  const handleImageSelected = (image: string) => {
    setSelectedImage(image);
    setIsDialogOpen(false);
  };

  // Convert string URLs to PuzzleImage objects if needed for ImageSelector
  const convertedImages: PuzzleImage[] = sampleImages.map((url, index) => ({
    id: `image-${index}`,
    name: `Image ${index + 1}`,
    url
  }));
  
  // More compact controls for mobile
  if (isMobile) {
    return (
      <div className="flex justify-between items-center w-full">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 flex items-center"
              disabled={isLoading}
            >
              <Image className="h-4 w-4 mr-1" />
              <span className="text-xs">Image</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[90vw] p-4">
            <DialogTitle>Select Puzzle Image</DialogTitle>
            <ImageSelector
              selectedImage={selectedImage}
              onSelectImage={handleImageSelected}
              sampleImages={sampleImages}
              compact={true}
            />
          </DialogContent>
        </Dialog>
        
        <div className="flex space-x-1 items-center">
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2"
            onClick={onShuffle}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Select
            value={difficulty}
            onValueChange={(value) => setDifficulty(value as DifficultyLevel)}
            disabled={isLoading}
          >
            <SelectTrigger className="w-16 h-8 text-xs">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3x3">3×3</SelectItem>
              <SelectItem value="4x4">4×4</SelectItem>
              <SelectItem value="5x5">5×5</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }
  
  // Desktop controls with more space
  return (
    <div className="flex justify-between items-center w-full max-w-md">
      <div className="flex space-x-2 items-center">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="space-x-1"
              disabled={isLoading}
            >
              <Image className="h-4 w-4" />
              <span>Change Image</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[80vw]">
            <DialogTitle>Select Puzzle Image</DialogTitle>
            <ImageSelector
              selectedImage={selectedImage}
              onSelectImage={handleImageSelected}
              sampleImages={sampleImages}
            />
          </DialogContent>
        </Dialog>
        
        <Select
          value={difficulty}
          onValueChange={(value) => setDifficulty(value as DifficultyLevel)}
          disabled={isLoading}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3x3">3×3 (Easy)</SelectItem>
            <SelectItem value="4x4">4×4 (Medium)</SelectItem>
            <SelectItem value="5x5">5×5 (Hard)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          className="space-x-1"
          onClick={onShuffle}
          disabled={isLoading}
        >
          <RefreshCw className="h-4 w-4" />
          <span>Shuffle</span>
        </Button>
      </div>
    </div>
  );
};

export default PuzzleControls;
