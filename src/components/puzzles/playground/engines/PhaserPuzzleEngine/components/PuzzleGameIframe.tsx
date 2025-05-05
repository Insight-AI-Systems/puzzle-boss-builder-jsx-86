
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
  const phaserGameUrl = `data:text/html;charset=utf-8,${encodeURIComponent(createPhaserGameContent({
    ...config,
    cacheBuster
  }))}`;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Listen for messages from the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Ensure the message is coming from our iframe (for security)
      if (event.source !== iframeRef.current?.contentWindow) return;
      
      const data = event.data;
      if (!data || typeof data !== 'object') return;
      
      console.log('Parent received message from iframe:', data.type);
      
      if (data.type === 'PHASER_PUZZLE_LOADED') {
        console.log('Parent received: Phaser puzzle loaded');
        onLoad();
      } else if (data.type === 'PHASER_PUZZLE_ERROR') {
        console.error('Parent received: Phaser puzzle error', data.error);
        onError(data.error || 'Unknown error loading puzzle');
      } else if (data.type === 'PHASER_PUZZLE_LOADING') {
        console.log('Parent received: Phaser puzzle loading started');
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onLoad, onError]);
  
  // Handle iframe load event
  const handleIframeLoad = () => {
    console.log('Iframe HTML document loaded');
  };
  
  return (
    <iframe 
      ref={iframeRef}
      src={phaserGameUrl}
      title="Phaser Jigsaw Puzzle Game"
      className={`phaser-puzzle-iframe ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      width="100%" 
      height="600px"
      frameBorder="0"
      allowFullScreen
      sandbox="allow-scripts allow-same-origin"
      onLoad={handleIframeLoad}
    />
  );
};

export default PuzzleGameIframe;
