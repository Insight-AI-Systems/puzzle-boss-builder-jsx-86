import React from 'react';
import Navbar from '@/components/Navbar';
import { PuzzleEngineFileManager } from '@/components/admin/puzzle-engine/PuzzleEngineFileManager';

const PuzzleFileManager: React.FC = () => {
  return (
    <div className="min-h-screen bg-puzzle-black">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-puzzle-white mb-8">
            Puzzle Engine File Manager
          </h1>
          <PuzzleEngineFileManager />
        </div>
      </div>
    </div>
  );
};

export default PuzzleFileManager;