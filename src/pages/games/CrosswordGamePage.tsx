
import React from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { CrosswordGame } from '@/components/games/crossword';

const CrosswordGamePage: React.FC = () => {
  return (
    <PageLayout title="Daily Crossword">
      <div className="max-w-4xl mx-auto">
        <CrosswordGame />
      </div>
    </PageLayout>
  );
};

export default CrosswordGamePage;
