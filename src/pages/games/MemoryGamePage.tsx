
import React from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { MemoryGame } from '@/components/games/memory';

const MemoryGamePage: React.FC = () => {
  return (
    <PageLayout title="Memory Master">
      <div className="max-w-4xl mx-auto">
        <MemoryGame />
      </div>
    </PageLayout>
  );
};

export default MemoryGamePage;
