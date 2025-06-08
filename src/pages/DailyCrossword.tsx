
import React from 'react';
import { CrosswordGame } from '@/components/games/crossword';
import { ResponsiveGameContainer } from '@/components/games';

export default function DailyCrossword() {
  return (
    <ResponsiveGameContainer 
      maxWidth="full"
      className="min-h-screen bg-gray-50"
    >
      <div className="container mx-auto py-8">
        <CrosswordGame />
      </div>
    </ResponsiveGameContainer>
  );
}
