
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseImageLoadingProps {
  selectedImage: string;
  externalLoading?: boolean;
  onImageLoaded?: () => void;
}

export const useImageLoading = ({ 
  selectedImage, 
  externalLoading,
  onImageLoaded 
}: UseImageLoadingProps) => {
  const [isLoading, setIsLoading] = useState(externalLoading !== undefined ? externalLoading : true);
  const { toast } = useToast();

  useEffect(() => {
    if (externalLoading !== undefined) {
      setIsLoading(externalLoading);
    }
  }, [externalLoading]);

  useEffect(() => {
    if (!isLoading && onImageLoaded) {
      onImageLoaded();
    }
  }, [isLoading, onImageLoaded]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    toast({
      title: "Error loading image",
      description: "Could not load the selected image. Please try another one.",
      variant: "destructive",
    });
    setIsLoading(false);
  };

  return {
    isLoading,
    setIsLoading,
    handleImageLoad,
    handleImageError
  };
};
