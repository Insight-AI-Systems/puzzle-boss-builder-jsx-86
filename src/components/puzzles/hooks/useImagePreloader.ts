
import { useState, useEffect, useCallback } from 'react';

interface UseImagePreloaderProps {
  imageUrls: string[];
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  onError?: (error: string) => void;
}

interface ImagePreloaderResult {
  isLoading: boolean;
  progress: number;
  errors: string[];
  preloadedImages: Record<string, HTMLImageElement>;
}

export const useImagePreloader = ({
  imageUrls,
  onComplete,
  onProgress,
  onError
}: UseImagePreloaderProps): ImagePreloaderResult => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [preloadedImages, setPreloadedImages] = useState<Record<string, HTMLImageElement>>({});

  // Memoize the preload function
  const preloadImages = useCallback(async () => {
    if (!imageUrls.length) {
      setIsLoading(false);
      setProgress(100);
      onComplete?.();
      return;
    }

    let loadedCount = 0;
    const newErrors: string[] = [];
    const newImages: Record<string, HTMLImageElement> = {};

    const loadImage = (url: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        
        img.onload = () => {
          loadedCount++;
          const newProgress = Math.round((loadedCount / imageUrls.length) * 100);
          setProgress(newProgress);
          onProgress?.(newProgress);
          resolve(img);
        };
        
        img.onerror = () => {
          loadedCount++;
          newErrors.push(`Failed to load image: ${url}`);
          onError?.(`Failed to load image: ${url}`);
          reject(`Failed to load image: ${url}`);
        };
        
        // Add cache busting if needed for development
        const cacheBuster = process.env.NODE_ENV === 'development' ? `?cb=${Date.now()}` : '';
        img.src = `${url}${cacheBuster}`;
      });
    };

    // Load images in parallel but process results in order
    const promises = imageUrls.map(async (url) => {
      try {
        const img = await loadImage(url);
        newImages[url] = img;
      } catch (error) {
        console.error(error);
      }
    });

    await Promise.allSettled(promises);

    setPreloadedImages(newImages);
    setErrors(newErrors);
    setIsLoading(false);
    
    if (newErrors.length === 0) {
      onComplete?.();
    }
  }, [imageUrls, onComplete, onProgress, onError]);

  useEffect(() => {
    preloadImages();
    
    // Clean up function
    return () => {
      // Clear references to loaded images to help garbage collection
      setPreloadedImages({});
    };
  }, [preloadImages]);

  return {
    isLoading,
    progress,
    errors,
    preloadedImages
  };
};
