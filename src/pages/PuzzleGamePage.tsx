
import React from 'react';
import PuzzleGame from '../components/puzzles/PuzzleGame';

const PuzzleGamePage: React.FC = () => {
  // Sample image URL - replace with your own image
  const imageUrl = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=600&fit=crop";
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Puzzle Game</h1>
      <PuzzleGame 
        imageUrl={imageUrl} 
        puzzleId="demo-landscape"
        difficultyLevel="4x4"
      />
    </div>
  );
};

export default PuzzleGamePage;
