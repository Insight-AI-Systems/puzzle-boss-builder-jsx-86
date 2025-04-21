import { useEffect, useRef } from 'react';

type UsePuzzleImagePreloadProps = {
  imageUrl: string;
  onLoad: () => void;
  onError: (error: unknown) => void;
};

export function usePuzzleImagePreload({ imageUrl, onLoad, onError }: UsePuzzleImagePreloadProps) {
  // Keep track of whether this hook is still mounted
  const isMounted = useRef(true);
  
  // Cache previous image URL to avoid unnecessary reloads
  const previousImageUrl = useRef('');
  
  useEffect(() => {
    // Set up cleanup flag
    isMounted.current = true;
    
    // Only reload if the image URL has changed
    if (previousImageUrl.current === imageUrl) {
      return;
    }
    
    previousImageUrl.current = imageUrl;
    
    const img = new window.Image();
    
    img.onload = () => {
      // Only call onLoad if the component is still mounted and the URL is still relevant
      if (isMounted.current && previousImageUrl.current === imageUrl) {
        onLoad();
      }
    };
    
    img.onerror = (error) => {
      // Only call onError if the component is still mounted and the URL is still relevant
      if (isMounted.current && previousImageUrl.current === imageUrl) {
        onError(error);
      }
    };
    
    img.src = imageUrl;
    
    // Cleanup function
    return () => {
      isMounted.current = false;
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl, onLoad, onError]);
}
