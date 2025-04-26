
import React from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ImageIcon } from 'lucide-react';

interface HeroImageSectionProps {
  imageUrl: string;
}

export const HeroImageSection: React.FC<HeroImageSectionProps> = ({ imageUrl }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h3 className="text-sm font-medium mb-2">Preview</h3>
      {imageUrl ? (
        <div className="border rounded-lg overflow-hidden bg-black/20 w-[256px] h-[256px]">
          <AspectRatio ratio={1/1} className="h-full">
            <img 
              src={imageUrl} 
              alt="Puzzle preview" 
              className="object-contain w-full h-full"
            />
          </AspectRatio>
        </div>
      ) : (
        <div className="border rounded-lg flex items-center justify-center aspect-square w-[256px] h-[256px] bg-black/20">
          <p className="text-muted-foreground text-sm">No image URL provided</p>
        </div>
      )}
    </div>
  );
};
