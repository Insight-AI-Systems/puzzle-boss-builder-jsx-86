
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Image } from 'lucide-react';
import ImageSelector from '../ImageSelector';

interface ImageSelectorProps {
  selectedImage: string;
  onSelectImage: (image: string) => void;
  sampleImages: string[];
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  isLibrarySelectorOpen: boolean;
  setIsLibrarySelectorOpen: (open: boolean) => void;
  isLoading: boolean;
  isMobile?: boolean;
}

export const ImageSelectionDialog: React.FC<ImageSelectorProps> = ({
  selectedImage,
  onSelectImage,
  sampleImages,
  isDialogOpen,
  setIsDialogOpen,
  isLoading,
  isMobile = false
}) => {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size={isMobile ? "sm" : "default"}
          className={isMobile ? "h-8 px-2 flex items-center" : "space-x-1"}
          disabled={isLoading}
        >
          <Image className={isMobile ? "h-4 w-4 mr-1" : "h-4 w-4"} />
          <span className={isMobile ? "text-xs" : ""}>
            {isMobile ? "Image" : "Change Image"}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className={isMobile ? "max-w-[90vw] p-4" : "max-w-[80vw]"}>
        <DialogTitle>Select Puzzle Image</DialogTitle>
        <div className="space-y-4">
          <ImageSelector
            selectedImage={selectedImage}
            onSelectImage={onSelectImage}
            sampleImages={sampleImages}
            compact={isMobile}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
