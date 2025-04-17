
import { useState, useEffect, useCallback } from 'react';

interface AudioSource {
  name: string;
  url: string;
}

interface UseAudioPreloaderProps {
  audioSources: AudioSource[];
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  onError?: (error: string) => void;
}

interface AudioPreloaderResult {
  isLoading: boolean;
  progress: number;
  audioMap: Record<string, HTMLAudioElement>;
  playAudio: (name: string) => void;
  errors: string[];
}

export const useAudioPreloader = ({
  audioSources,
  onComplete,
  onProgress,
  onError
}: UseAudioPreloaderProps): AudioPreloaderResult => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [audioMap, setAudioMap] = useState<Record<string, HTMLAudioElement>>({});
  const [errors, setErrors] = useState<string[]>([]);

  // Memoize the preload function
  const preloadAudio = useCallback(async () => {
    if (!audioSources.length) {
      setIsLoading(false);
      setProgress(100);
      onComplete?.();
      return;
    }

    let loadedCount = 0;
    const newErrors: string[] = [];
    const newAudioMap: Record<string, HTMLAudioElement> = {};

    const loadAudio = (source: AudioSource): Promise<HTMLAudioElement> => {
      return new Promise((resolve, reject) => {
        const audio = new Audio();
        
        audio.addEventListener('canplaythrough', () => {
          loadedCount++;
          const newProgress = Math.round((loadedCount / audioSources.length) * 100);
          setProgress(newProgress);
          onProgress?.(newProgress);
          resolve(audio);
        }, { once: true });
        
        audio.addEventListener('error', () => {
          loadedCount++;
          const errorMsg = `Failed to load audio: ${source.name}`;
          newErrors.push(errorMsg);
          onError?.(errorMsg);
          reject(errorMsg);
        }, { once: true });
        
        audio.src = source.url;
        audio.load();
      });
    };

    // Load audio files in parallel but process results in order
    const promises = audioSources.map(async (source) => {
      try {
        const audio = await loadAudio(source);
        newAudioMap[source.name] = audio;
      } catch (error) {
        console.error(error);
      }
    });

    await Promise.allSettled(promises);

    setAudioMap(newAudioMap);
    setErrors(newErrors);
    setIsLoading(false);
    
    if (newErrors.length === 0) {
      onComplete?.();
    }
  }, [audioSources, onComplete, onProgress, onError]);

  // Function to play audio
  const playAudio = useCallback((name: string) => {
    if (audioMap[name]) {
      // Clone the audio to allow overlapping sounds
      const audioClone = audioMap[name].cloneNode() as HTMLAudioElement;
      audioClone.volume = 0.7; // Set volume
      audioClone.play();
      
      // Clean up clone after it's done playing
      audioClone.addEventListener('ended', () => {
        // Remove references for garbage collection
        audioClone.src = '';
        audioClone.remove();
      }, { once: true });
    }
  }, [audioMap]);

  useEffect(() => {
    preloadAudio();
    
    // Clean up function
    return () => {
      // Stop and clear all audio elements
      Object.values(audioMap).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      setAudioMap({});
    };
  }, [preloadAudio]);

  return {
    isLoading,
    progress,
    audioMap,
    playAudio,
    errors
  };
};
