
import React from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { MemoryGame as MemoryGameComponent } from '@/components/games/memory';

export default function MemoryGame() {
  return (
    <PageLayout 
      title="Memory Game" 
      subtitle="Test your memory with this classic card matching game"
    >
      <MemoryGameComponent />
    </PageLayout>
  );
}
