
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DEFAULT_IMAGES } from '../types/puzzle-types';
import { PuzzleImage } from '../constants/puzzle-images';

export interface ImageSelectorProps {
  selectedImage: string;
  onSelectImage?: (image: string) => void;
  onSelect?: (image: string) => void;
  sampleImages?: string[];
  isLoading?: boolean;
  images?: PuzzleImage[];
  compact?: boolean;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({
  selectedImage,
  onSelectImage,
  onSelect,
  sampleImages = [],
  isLoading = false,
  images = [],
  compact = false
}) => {
  // Handle both callback patterns
  const handleImageSelection = (image: string) => {
    if (onSelectImage) onSelectImage(image);
    if (onSelect) onSelect(image);
  };
  
  // Process image options based on what's provided
  let imageOptions: string[] = [];
  
  if (images && images.length > 0) {
    // Extract URLs from PuzzleImage objects
    imageOptions = images.map(img => img.url);
  } else if (sampleImages && sampleImages.length > 0) {
    // Use simple string array
    imageOptions = sampleImages;
  } else {
    // Use default images as fallback
    imageOptions = DEFAULT_IMAGES;
  }
  
  return (
    <div className={`${compact ? 'p-1' : 'p-2'} bg-black/10 rounded-lg`}>
      <label htmlFor="image-selector" className={`block ${compact ? 'text-xs mb-0.5' : 'mb-1 text-sm'} font-medium`}>
        Puzzle Image
      </label>
      <Select
        disabled={isLoading}
        value={selectedImage}
        onValueChange={handleImageSelection}
      >
        <SelectTrigger id="image-selector" className={`w-full bg-white/50 ${compact ? 'h-8 text-xs' : ''}`}>
          <SelectValue placeholder="Select image" />
        </SelectTrigger>
        <SelectContent>
          {imageOptions.map((image, index) => {
            const imageName = images && images[index]?.name ? images[index].name : `Image ${index + 1}`;
            return (
              <SelectItem key={`img-${index}`} value={image}>
                {imageName}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ImageSelector;
