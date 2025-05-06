
import React, { useEffect, useRef } from 'react';
import { createPhaserGameContent } from '../utils/gameContentGenerator';
import { PuzzleConfig } from '../types/puzzleTypes';

interface PuzzleGameIframeProps {
  config: PuzzleConfig;
  isLoading: boolean;
  onLoad: () => void;
  onError: (error: string) => void;
}

const PuzzleGameIframe: React.FC<PuzzleGameIframeProps> = ({ 
  config, 
  isLoading,
  onLoad,
  onError
}) => {
  // Create a data URL from the HTML content with cache buster
  const cacheBuster = Date.now();
  const phaserGameContent = createPhaserGameContent({
    ...config,
    cacheBuster
  });
  // Use blob URL instead of data URL for better performance with large content
  const blobUrl = useRef<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Create blob URL on component mount
  useEffect(() => {
    // Create a blob with the HTML content
    const blob = new Blob([phaserGameContent], { type: 'text/html' });
    blobUrl.current = URL.createObjectURL(blob);
    
    // Clean up the blob URL when component unmounts
    return () => {
      if (blobUrl.current) {
        URL.revokeObjectURL(blobUrl.current);
      }
    };
  }, [phaserGameContent]);
  
  // Listen for messages from the iframe
  useEffect(() => {
    // Set a timeout for loading - if the game doesn't load in 10 seconds, show error
    const loadTimeout = setTimeout(() => {
      if (isLoading) {
        console.error('Phaser game loading timeout');
        onError('Game loading timed out. Please try again or switch to a different puzzle engine.');
      }
    }, 10000);
    
    const handleMessage = (event: MessageEvent) => {
      // Ensure the message is coming from our iframe (for security)
      if (event.source !== iframeRef.current?.contentWindow) return;
      
      const data = event.data;
      if (!data || typeof data !== 'object') return;
      
      console.log('Parent received message from iframe:', data.type);
      
      if (data.type === 'PHASER_PUZZLE_LOADED') {
        console.log('Parent received: Phaser puzzle loaded');
        clearTimeout(loadTimeout);
        onLoad();
      } else if (data.type === 'PHASER_PUZZLE_ERROR') {
        console.error('Parent received: Phaser puzzle error', data.error);
        clearTimeout(loadTimeout);
        onError(data.error || 'Unknown error loading puzzle');
      } else if (data.type === 'PHASER_PUZZLE_LOADING') {
        console.log('Parent received: Phaser puzzle loading started');
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(loadTimeout);
    };
  }, [onLoad, onError, isLoading]);
  
  // Handle iframe load event
  const handleIframeLoad = () => {
    console.log('Iframe HTML document loaded');
  };
  
  return (
    <iframe 
      ref={iframeRef}
      src={blobUrl.current || ''}
      title="Phaser Jigsaw Puzzle Game"
      className={`phaser-puzzle-iframe ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      width="100%" 
      height="600px"
      frameBorder="0"
      allowFullScreen
      sandbox="allow-scripts allow-same-origin"
      onLoad={handleIframeLoad}
      style={{
        transition: 'opacity 0.3s ease',
        border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}
    />
  );
};

export default PuzzleGameIframe;
