
import React from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { MemoryGameWrapper } from '@/components/games/memory/MemoryGameWrapper';

export default function MemoryGamePage() {
  return (
    <PageLayout 
      title="Memory Match Game" 
      subtitle="Test your memory skills with our engaging card matching game"
    >
      <MemoryGameWrapper layout="3x4" theme="animals" />
    </PageLayout>
  );
}
