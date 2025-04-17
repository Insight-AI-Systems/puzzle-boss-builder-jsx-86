
import React from 'react';
import { PuzzleImage } from '../constants/puzzle-images';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ImageSelectorProps {
  images: PuzzleImage[];
  selectedImage: string;
  onSelect: (imageUrl: string) => void;
  compact?: boolean;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ 
  images, 
  selectedImage, 
  onSelect,
  compact = false
}) => {
  return (
    <div className={`w-full max-w-lg ${compact ? 'mb-2' : 'mb-6'}`}>
      <h3 className={`text-puzzle-aqua font-medium ${compact ? 'text-sm mb-1' : 'mb-2'}`}>Select Puzzle Image</h3>
      <ScrollArea className="w-full">
        <div className="flex space-x-2 pb-2">
          {images.map((image) => (
            <button
              key={image.id}
              className={`relative rounded-md overflow-hidden border-2 transition-all ${compact ? 'h-12 w-12' : 'h-16 w-16'} flex-shrink-0
                ${selectedImage === image.url 
                  ? 'border-puzzle-gold shadow-md scale-105 puzzle-piece-hint' 
                  : 'border-puzzle-black/60 hover:border-puzzle-aqua'
                }`}
              onClick={() => onSelect(image.url)}
              title={image.name}
            >
              <img 
                src={image.thumbnail || image.url} 
                alt={image.name}
                className="w-full h-full object-cover"
              />
              {selectedImage === image.url && (
                <div className="absolute inset-0 bg-puzzle-gold/20"></div>
              )}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ImageSelector;
