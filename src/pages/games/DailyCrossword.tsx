
import React from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { CrosswordGame } from '@/components/games/crossword';

export default function DailyCrossword() {
  return (
    <PageLayout 
      title="Daily Crossword" 
      subtitle="Solve today's crossword puzzle challenge"
    >
      <CrosswordGame />
    </PageLayout>
  );
}
