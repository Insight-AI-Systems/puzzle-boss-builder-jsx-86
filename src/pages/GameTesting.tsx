
import React from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import PuzzleTestRunner from '@/components/testing/PuzzleTestRunner';

export default function GameTesting() {
  return (
    <PageLayout 
      title="Game Testing Suite" 
      subtitle="Comprehensive testing dashboard for all puzzle games"
    >
      <PuzzleTestRunner />
    </PageLayout>
  );
}
