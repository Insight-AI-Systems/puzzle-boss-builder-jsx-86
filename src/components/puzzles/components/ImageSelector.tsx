
import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DEFAULT_IMAGES, PuzzleImage, fetchPuzzleImages } from '../constants/puzzle-images';

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
  isLoading = false,
  compact = false
}) => {
  const [libraryImages, setLibraryImages] = useState<PuzzleImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const images = await fetchPuzzleImages();
        setLibraryImages(images.length > 0 ? images : DEFAULT_IMAGES);
      } catch (err) {
        console.error('Failed to load puzzle images:', err);
        setError('Failed to load images');
        setLibraryImages(DEFAULT_IMAGES);
      }
    };

    loadImages();
  }, []);

  // Handle both callback patterns
  const handleImageSelection = (image: string) => {
    if (onSelectImage) onSelectImage(image);
    if (onSelect) onSelect(image);
  };

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
          {libraryImages.map((image) => (
            <SelectItem key={image.id} value={image.url}>
              {image.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default ImageSelector;
