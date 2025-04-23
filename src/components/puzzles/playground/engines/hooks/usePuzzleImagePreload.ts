
import { useEffect } from 'react';

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
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      onLoad();
    };
    
    img.onerror = () => {
      onError(new Error(`Failed to load image: ${imageUrl}`));
    };
    
    img.src = imageUrl;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl, onLoad, onError]);
};
