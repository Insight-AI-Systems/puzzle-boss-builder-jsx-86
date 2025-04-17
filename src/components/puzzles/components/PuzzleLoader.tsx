
import React, { useState, useEffect } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Progress } from '@/components/ui/progress';

interface PuzzleLoaderProps {
  selectedImage: string;
  difficulty: string;
  onImageLoaded: (imageElement: HTMLImageElement) => void;
  onLoadError: (error: string) => void;
}

const PuzzleLoader: React.FC<PuzzleLoaderProps> = ({
  selectedImage,
  difficulty,
  onImageLoaded,
  onLoadError
}) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loadStatus, setLoadStatus] = useState<'loading' | 'success' | 'error'>('loading');
  
  // Calculate approx size based on difficulty
  const getImageSize = () => {
    switch (difficulty) {
      case '3x3': return 300;
      case '4x4': return 400;
      case '5x5': return 500;
      default: return 400;
    }
  };
  
  // Optimize image loading with proper size
  useEffect(() => {
    setLoading(true);
    setProgress(0);
    setLoadStatus('loading');
    
    const imageSize = getImageSize();
    
    // Simulate progressive loading
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        return newProgress > 90 ? 90 : newProgress;
      });
    }, 200);
    
    // Create optimized image URL with sizing parameters
    // This assumes your images support query parameters for resizing
    const size = getImageSize();
    // Add cache busting in development mode
    const cacheBuster = process.env.NODE_ENV === 'development' ? `&cb=${Date.now()}` : '';
    const optimizedUrl = `${selectedImage}?w=${size}&h=${size}&fit=crop${cacheBuster}`;
    
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      clearInterval(progressInterval);
      setProgress(100);
      setLoading(false);
      setLoadStatus('success');
      onImageLoaded(img);
    };
    
    img.onerror = () => {
      clearInterval(progressInterval);
      setLoading(false);
      setLoadStatus('error');
      onLoadError(`Failed to load image: ${selectedImage}`);
    };
    
    img.src = optimizedUrl;
    
    return () => {
      clearInterval(progressInterval);
      img.onload = null;
      img.onerror = null;
    };
  }, [selectedImage, difficulty, onImageLoaded, onLoadError]);

  if (loadStatus === 'error') {
    return (
      <div className="bg-red-900/20 border border-red-700 rounded-md p-4 text-center">
        <p className="text-red-400">Failed to load puzzle image</p>
        <button 
          className="mt-2 px-3 py-1 bg-red-800 text-white text-sm rounded-md hover:bg-red-700"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col items-center">
      <div className="mb-2">
        {loading ? 'Loading puzzle image...' : 'Image loaded!'}
      </div>
      
      <Progress 
        value={progress} 
        className="w-full h-2 mb-4" 
      />
      
      {loading && <LoadingSpinner size="small" message="Optimizing puzzle..." />}
    </div>
  );
};

export default PuzzleLoader;
