
import React, { useState } from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import SimplePuzzleGame from '@/components/puzzles/SimplePuzzleGame';
import ImagePuzzleGame from '@/components/puzzles/ImagePuzzleGame';
import PuzzleDemoInfo from '@/components/puzzles/PuzzleDemoInfo';
import Breadcrumb from '@/components/common/Breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

      <Tabs defaultValue="image" className="w-full">
        <TabsList className="grid w-full max-w-sm mx-auto grid-cols-2 mb-4">
          <TabsTrigger value="simple">Simple Puzzle</TabsTrigger>
          <TabsTrigger value="image">Image Puzzle</TabsTrigger>
        </TabsList>
        
        <TabsContent value="simple" className="flex justify-center mb-8">
          <SimplePuzzleGame />
        </TabsContent>
        
        <TabsContent value="image" className="flex justify-center mb-8">
          <ImagePuzzleGame />
        </TabsContent>
      </Tabs>

      <PuzzleDemoInfo />
    </PageLayout>
  );
};

export default PuzzleDemo;
