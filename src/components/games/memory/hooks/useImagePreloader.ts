
import { useState, useEffect } from 'react';

export function useImagePreloader(imageUrls: string[]) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (imageUrls.length === 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const loaded = new Set<string>();
    let loadCount = 0;

    const loadImage = (url: string) => {
      // Skip if it's an emoji or already loaded
      if (!url.startsWith('http')) {
        loaded.add(url);
        loadCount++;
        if (loadCount === imageUrls.length) {
          setLoadedImages(loaded);
          setLoading(false);
        }
        return;
      }

      const img = new Image();
      img.onload = () => {
        loaded.add(url);
        loadCount++;
        if (loadCount === imageUrls.length) {
          setLoadedImages(loaded);
          setLoading(false);
        }
      };
      img.onerror = () => {
        console.warn(`Failed to load image: ${url}`);
        loadCount++;
        if (loadCount === imageUrls.length) {
          setLoadedImages(loaded);
          setLoading(false);
        }
      };
      img.src = url;
    };

    imageUrls.forEach(loadImage);
  }, [imageUrls]);

  return { loadedImages, loading, error };
}
