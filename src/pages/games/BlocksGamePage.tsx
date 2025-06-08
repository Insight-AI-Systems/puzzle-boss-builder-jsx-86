
import React from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { TetrisGame } from '@/components/games/tetris';

const BlocksGamePage: React.FC = () => {
  return (
    <PageLayout title="Block Puzzle Pro">
      <div className="max-w-4xl mx-auto">
        <TetrisGame />
      </div>
    </PageLayout>
  );
};

export default BlocksGamePage;
