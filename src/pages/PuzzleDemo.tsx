
import React from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import SimplePuzzleGame from '@/components/puzzles/SimplePuzzleGame';
import PuzzleDemoInfo from '@/components/puzzles/PuzzleDemoInfo';
import Breadcrumb from '@/components/common/Breadcrumb';

const PuzzleDemo: React.FC = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Puzzle Demo', active: true }
  ];

  return (
    <PageLayout
      title="Puzzle Demo"
      subtitle="Test our jigsaw puzzle technology"
      className="prose prose-invert max-w-6xl"
    >
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex justify-center mb-8">
        <SimplePuzzleGame />
      </div>

      <PuzzleDemoInfo />
    </PageLayout>
  );
};

export default PuzzleDemo;
