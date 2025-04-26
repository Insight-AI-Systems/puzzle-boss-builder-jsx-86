
import { useState, useEffect, useRef } from 'react';

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
  const cachedImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!imageUrl) {
      console.log('No image URL provided to preload');
      return;
    }
    
    setIsLoaded(false);
    setError(null);
    
    console.log('Preloading image:', imageUrl);
    
    // Check if we already have this image cached
    if (cachedImageRef.current?.src === imageUrl && cachedImageRef.current.complete) {
      console.log('Using cached image from ref:', imageUrl);
      setIsLoaded(true);
      if (onLoad) onLoad();
      return;
    }
    
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      console.log('Image successfully preloaded:', imageUrl);
      setIsLoaded(true);
      // Store the loaded image in the ref for future use
      cachedImageRef.current = img;
      if (onLoad) onLoad();
    };
    
    img.onerror = (event) => {
      const errorMessage = `Failed to load image: ${imageUrl}`;
      console.error(errorMessage, event);
      
      // If it's a blob URL that might have expired, suggest a reload
      if (imageUrl.startsWith('blob:')) {
        console.warn('Blob URL detected which may have expired. Consider refreshing the page.');
      }
      
      // Try to load the image with a cache-busting query param
      if (!imageUrl.includes('?')) {
        const cacheBustUrl = `${imageUrl}?t=${Date.now()}`;
        console.log('Attempting to reload with cache bust:', cacheBustUrl);
        img.src = cacheBustUrl;
        return;
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
    };
  }, [imageUrl, onLoad, onError]);

  return { 
    isLoaded, 
    error,
    cachedImage: cachedImageRef.current
  };
};
