
import React from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import PuzzleComponent from '@/components/PuzzleComponent';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PuzzleDemo = () => {
  return (
    <PageLayout
      title="Puzzle Demo"
      subtitle="Test our jigsaw puzzle technology"
      className="prose prose-invert max-w-4xl"
    >
      <div className="flex items-center text-muted-foreground text-sm mb-6">
        <Link to="/" className="hover:text-puzzle-aqua">Home</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="text-puzzle-aqua">Puzzle Demo</span>
      </div>

      <div className="flex justify-center mb-12">
        <PuzzleComponent />
      </div>

      <div className="bg-puzzle-black/30 border border-puzzle-aqua/20 p-6 rounded-lg">
        <h2 className="text-puzzle-white text-xl font-bold mb-2">About This Demo</h2>
        <p className="text-muted-foreground">
          This is a simple demonstration of our jigsaw puzzle technology using the Headbreaker.js library.
          The full version will include customizable images, difficulty levels, and competitive gameplay.
        </p>
      </div>
    </PageLayout>
  );
};

export default PuzzleDemo;
