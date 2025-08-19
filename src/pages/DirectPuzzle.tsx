import React from 'react';
import { EnhancedJigsawWrapper } from '@/components/games/jigsaw/EnhancedJigsawWrapper';

export default function DirectPuzzle() {
  const handleComplete = (stats: any) => {
    alert(`🎉 Puzzle Complete!\n\nScore: ${stats.score}\nTime: ${stats.time}s\nMoves: ${stats.moves}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">
          🧩 Enhanced Puzzle Game
        </h1>
        
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <p className="text-center text-gray-300">
            This is the new puzzle game with Headbreaker + Konva integration. No login required!
          </p>
        </div>

        <EnhancedJigsawWrapper
          difficulty="medium"
          imageUrl="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
          onComplete={handleComplete}
        />

        <div className="mt-8 text-center space-x-4">
          <a 
            href="/admin-noauth" 
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Go to Admin
          </a>
          <a 
            href="/" 
            className="inline-block px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Go to Home
          </a>
        </div>
      </div>
    </div>
  );
}