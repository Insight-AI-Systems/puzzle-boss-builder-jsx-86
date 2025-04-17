
import React, { useEffect } from 'react';
import { useImagePreloader } from '../hooks/useImagePreloader';
import { useAudioPreloader } from '../hooks/useAudioPreloader';
import { Progress } from '@/components/ui/progress';

interface PuzzleAssetPreloaderProps {
  imageUrls: string[];
  audioSources: Array<{ name: string; url: string }>;
  onComplete: () => void;
  onAudioReady: (playAudio: (name: string) => void) => void;
}

const PuzzleAssetPreloader: React.FC<PuzzleAssetPreloaderProps> = ({
  imageUrls,
  audioSources,
  onComplete,
  onAudioReady
}) => {
  // Load images
  const {
    isLoading: imagesLoading,
    progress: imageProgress,
    errors: imageErrors
  } = useImagePreloader({ 
    imageUrls 
  });
  
  // Load audio
  const {
    isLoading: audioLoading,
    progress: audioProgress,
    playAudio,
    errors: audioErrors
  } = useAudioPreloader({
    audioSources
  });
  
  // Calculate combined loading progress
  const combinedProgress = (imageProgress + audioProgress) / 2;
  
  // When audio is ready, pass the playAudio function to parent
  useEffect(() => {
    if (!audioLoading) {
      onAudioReady(playAudio);
    }
  }, [audioLoading, playAudio, onAudioReady]);
  
  // When all assets are loaded, notify parent
  useEffect(() => {
    if (!imagesLoading && !audioLoading) {
      onComplete();
    }
  }, [imagesLoading, audioLoading, onComplete]);
  
  // Display errors if any
  const hasErrors = imageErrors.length > 0 || audioErrors.length > 0;
  
  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold mb-1">Loading Puzzle Assets</h3>
        <p className="text-sm text-gray-400">
          {imagesLoading || audioLoading 
            ? `Loading (${Math.round(combinedProgress)}%)...` 
            : 'Assets loaded successfully!'}
        </p>
      </div>
      
      <Progress value={combinedProgress} className="h-2 mb-4" />
      
      {hasErrors && (
        <div className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-md">
          <p className="text-red-400 text-sm font-medium">Some assets failed to load:</p>
          <ul className="list-disc list-inside text-xs text-red-300 mt-1">
            {imageErrors.map((error, index) => (
              <li key={`img-err-${index}`}>{error}</li>
            ))}
            {audioErrors.map((error, index) => (
              <li key={`audio-err-${index}`}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PuzzleAssetPreloader;
