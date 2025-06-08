
import React from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { TetrisGame } from '@/components/games/tetris';

export default function BlockPuzzlePro() {
  return (
    <PageLayout 
      title="Block Puzzle Pro" 
      subtitle="Classic Tetris-style block puzzle game"
    >
      <TetrisGame />
    </PageLayout>
  );
}
