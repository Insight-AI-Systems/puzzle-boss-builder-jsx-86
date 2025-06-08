
import React from 'react';
import { MainLayout } from '@/components/MainLayout';
import { CrosswordGame } from '@/components/games/crossword';

export default function DailyCrossword() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-puzzle-white mb-4">Daily Crossword</h1>
          <p className="text-puzzle-aqua text-lg">Solve today's crossword puzzle challenge</p>
        </div>
        <CrosswordGame />
      </div>
    </MainLayout>
  );
}
