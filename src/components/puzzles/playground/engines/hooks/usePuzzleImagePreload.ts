
import { useEffect } from 'react';

type UsePuzzleImagePreloadProps = {
  imageUrl: string;
  onLoad: () => void;
  onError: (error: unknown) => void;
};

export function usePuzzleImagePreload({ imageUrl, onLoad, onError }: UsePuzzleImagePreloadProps) {
  useEffect(() => {
    const img = new window.Image();
    img.src = imageUrl;
    img.onload = () => onLoad();
    img.onerror = (error) => onError(error);
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl, onLoad, onError]);
}
