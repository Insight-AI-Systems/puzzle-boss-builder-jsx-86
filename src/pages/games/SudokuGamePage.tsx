
import React from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { SudokuGame } from '@/components/games/sudoku';

const SudokuGamePage: React.FC = () => {
  return (
    <PageLayout title="Speed Sudoku">
      <div className="max-w-4xl mx-auto">
        <SudokuGame />
      </div>
    </PageLayout>
  );
};

export default SudokuGamePage;
