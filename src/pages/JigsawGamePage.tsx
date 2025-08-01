import React from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { JigsawGameWrapper } from '@/components/games/jigsaw/JigsawGameWrapper';

export default function JigsawGamePage() {
  return (
    <PageLayout 
      title="Jigsaw Puzzle" 
      subtitle="Solve beautiful jigsaw puzzles with varying difficulty levels"
    >
      <JigsawGameWrapper 
        difficulty="medium"
        pieceCount={100}
      />
    </PageLayout>
  );
}