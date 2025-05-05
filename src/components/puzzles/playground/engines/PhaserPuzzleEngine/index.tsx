
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import LeaderboardSection from './components/LeaderboardSection';
import AuthSection from './components/AuthSection';
import './styles/phaser-puzzle.css';

interface PhaserPuzzleEngineProps {
  imageUrl: string;
  rows: number;
  columns: number;
  showNumbers?: boolean;
  puzzleId?: string;
}

const PhaserPuzzleEngine: React.FC<PhaserPuzzleEngineProps> = ({
  imageUrl,
  rows,
  columns,
  showNumbers = false,
  puzzleId = 'default'
}) => {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  // Calculate difficulty based on rows and columns
  const getDifficulty = () => {
    const totalPieces = rows * columns;
    if (totalPieces <= 9) return 'easy';
    if (totalPieces <= 16) return 'medium';
    return 'hard';
  };
  
  // Build URL with query parameters for the iframe
  // Note: Using a temporary placeholder URL until the actual game is deployed
  // In a real implementation, we'd use a valid URL like puzzle-boss-jigsaw.pages.dev
  const iframeUrl = `https://example.com/puzzle-game?image=${encodeURIComponent(imageUrl)}&difficulty=${getDifficulty()}&pieces=${rows * columns}&showNumbers=${showNumbers}`;
  
  useEffect(() => {
    // Simulate loading time for iframe
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="phaser-puzzle-container">
      <div className="phaser-puzzle-header">
        <h2 className="text-2xl font-bold mb-1">Play Puzzle</h2>
        <p className="text-muted-foreground mb-4">
          Race against the clock to solve puzzles and climb the leaderboard!
        </p>
      </div>
      
      <div className="phaser-puzzle-game-container">
        {isLoading && (
          <div className="phaser-puzzle-loading">
            <div className="spinner"></div>
            <p>Loading puzzle game...</p>
          </div>
        )}
        
        <iframe 
          src={iframeUrl}
          title="Phaser Jigsaw Puzzle Game"
          className={`phaser-puzzle-iframe ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          width="100%" 
          height="600px"
          frameBorder="0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
      
      <div className="phaser-puzzle-footer mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <AuthSection puzzleId={puzzleId} />
          </div>
          <div className="md:col-span-1">
            <LeaderboardSection puzzleId={puzzleId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhaserPuzzleEngine;
