
import { useEffect, useState } from 'react';

interface UsePuzzleImagePreloadProps {
  imageUrl: string;
  onLoad: () => void;
  onError: (error: Error) => void;
}

export const usePuzzleImagePreload = ({ 
  imageUrl, 
  onLoad, 
  onError 
}: UsePuzzleImagePreloadProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    if (!imageUrl) {
      console.error('No image URL provided to usePuzzleImagePreload');
      return;
    }
    
    setIsLoaded(false);
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      console.log('Image successfully loaded:', imageUrl);
      setIsLoaded(true);
      onLoad();
    };
    
    img.onerror = () => {
      console.error('Failed to load image:', imageUrl);
      onError(new Error(`Failed to load image: ${imageUrl}`));
    };
    
    // Add cache buster for development environments
    const cacheBuster = process.env.NODE_ENV === 'development' ? `?cb=${Date.now()}` : '';
    img.src = `${imageUrl}${cacheBuster}`;
    
    return () => {
      // Clean up event handlers to prevent memory leaks
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl, onLoad, onError]);
  
  return { isLoaded };
};
