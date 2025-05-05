
import React from 'react';
import { createPhaserGameContent, PuzzleConfig } from '../utils/gameContentGenerator';

interface PuzzleGameIframeProps {
  config: PuzzleConfig;
  isLoading: boolean;
}

const PuzzleGameIframe: React.FC<PuzzleGameIframeProps> = ({ config, isLoading }) => {
  // Create a data URL from the HTML content
  const phaserGameUrl = `data:text/html;charset=utf-8,${encodeURIComponent(createPhaserGameContent(config))}`;
  
  return (
    <iframe 
      src={phaserGameUrl}
      title="Phaser Jigsaw Puzzle Game"
      className={`phaser-puzzle-iframe ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      width="100%" 
      height="600px"
      frameBorder="0"
      allowFullScreen
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    />
  );
};

export default PuzzleGameIframe;
