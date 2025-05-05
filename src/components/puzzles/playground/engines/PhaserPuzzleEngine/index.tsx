
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
  
  // Create a placeholder that shows something more meaningful than example.com
  // This will be replaced with the actual puzzle game URL when available
  const createPlaceholderContent = () => {
    const difficulty = getDifficulty();
    const totalPieces = rows * columns;
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Puzzle Game Placeholder</title>
          <style>
            body {
              font-family: system-ui, sans-serif;
              background: #0f172a;
              color: #e2e8f0;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              padding: 20px;
              text-align: center;
            }
            .puzzle-info {
              background: rgba(255, 255, 255, 0.1);
              border-radius: 8px;
              padding: 20px;
              max-width: 90%;
              width: 500px;
            }
            .puzzle-image {
              max-width: 200px;
              max-height: 200px;
              margin: 20px auto;
              border-radius: 4px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
            }
            .badge {
              background: #fbbf24;
              color: #1e293b;
              font-weight: bold;
              padding: 4px 8px;
              border-radius: 4px;
              display: inline-block;
              margin: 4px;
            }
            .coming-soon {
              font-size: 1.2em;
              margin-top: 20px;
              color: #fbbf24;
            }
          </style>
        </head>
        <body>
          <div class="puzzle-info">
            <h2>Phaser Puzzle Engine</h2>
            <p>This puzzle will be interactive when the engine is fully implemented.</p>
            <img src="${imageUrl}" class="puzzle-image" alt="Puzzle Image">
            <div>
              <span class="badge">Difficulty: ${difficulty}</span>
              <span class="badge">Pieces: ${totalPieces}</span>
              ${showNumbers ? '<span class="badge">Numbered Mode</span>' : ''}
            </div>
            <p class="coming-soon">Coming Soon!</p>
          </div>
        </body>
      </html>
    `;
  };
  
  // Create a data URL from the HTML content
  const placeholderUrl = `data:text/html;charset=utf-8,${encodeURIComponent(createPlaceholderContent())}`;
  
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
          src={placeholderUrl}
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
