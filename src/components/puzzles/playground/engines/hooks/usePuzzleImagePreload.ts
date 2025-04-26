
import { useState, useEffect } from 'react';

interface UsePuzzleImagePreloadProps {
  imageUrl: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export const usePuzzleImagePreload = ({
  imageUrl,
  onLoad,
  onError
}: UsePuzzleImagePreloadProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!imageUrl) {
      console.log('No image URL provided to preload');
      return;
    }
    
    setIsLoaded(false);
    setError(null);
    
    console.log('Preloading image:', imageUrl);
    
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      console.log('Image successfully preloaded:', imageUrl);
      setIsLoaded(true);
      if (onLoad) onLoad();
    };
    
    img.onerror = (event) => {
      const errorMessage = `Failed to load image: ${imageUrl}`;
      console.error(errorMessage, event);
      
      // If it's a blob URL that might have expired, suggest a reload
      if (imageUrl.startsWith('blob:')) {
        console.warn('Blob URL detected which may have expired. Consider refreshing the page.');
      }
      
      const error = new Error(errorMessage);
      setError(error);
      if (onError) onError(error);
    };
    
    img.src = imageUrl;
    
    return () => {
      // Clean up
      img.onload = null;
      img.onerror = null;
      
      // For blob URLs, consider revoking to free memory
      // But only if we created the blob ourselves, which isn't the case here
      // if (imageUrl.startsWith('blob:') && weCreatedThisBlob) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl, onLoad, onError]);

  return { isLoaded, error };
};
