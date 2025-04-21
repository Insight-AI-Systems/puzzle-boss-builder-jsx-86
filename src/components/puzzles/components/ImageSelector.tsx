
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DEFAULT_IMAGES } from '../types/puzzle-types';

export interface ImageSelectorProps {
  selectedImage: string;
  onSelectImage: (image: string) => void;
  sampleImages: string[];
  isLoading: boolean;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({
  selectedImage,
  onSelectImage,
  sampleImages,
  isLoading
}) => {
  const imageOptions = sampleImages.length > 0 ? sampleImages : DEFAULT_IMAGES;
  
  return (
    <div className="p-2 bg-black/10 rounded-lg">
      <label htmlFor="image-selector" className="block mb-1 text-sm font-medium">
        Puzzle Image
      </label>
      <Select
        disabled={isLoading}
        value={selectedImage}
        onValueChange={onSelectImage}
      >
        <SelectTrigger id="image-selector" className="w-full bg-white/50">
          <SelectValue placeholder="Select image" />
        </SelectTrigger>
        <SelectContent>
          {imageOptions.map((image, index) => (
            <SelectItem key={`img-${index}`} value={image}>
              Image {index + 1}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ImageSelector;
