
import React from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { SudokuGame } from '@/components/games/sudoku';

export default function SudokuGamePage() {
  return (
    <PageLayout 
      title="Sudoku" 
      subtitle="Fill the grid with numbers from 1 to 9"
    >
      <SudokuGame />
    </PageLayout>
  );
}
