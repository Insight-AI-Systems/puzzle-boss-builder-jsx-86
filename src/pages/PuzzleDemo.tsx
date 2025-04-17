
import React, { useState } from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import SimplePuzzleGame from '@/components/puzzles/SimplePuzzleGame';
import ImagePuzzleGame from '@/components/puzzles/ImagePuzzleGame';
import PuzzleDemoInfo from '@/components/puzzles/PuzzleDemoInfo';
import Breadcrumb from '@/components/common/Breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageSelector from '@/components/puzzles/components/ImageSelector';
import { PUZZLE_IMAGES } from '@/components/puzzles/constants/puzzle-images';

const PuzzleDemo: React.FC = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Puzzle Demo', active: true }
  ];
  
  const [selectedImage, setSelectedImage] = useState<string>(PUZZLE_IMAGES[0].url);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageSelect = (imageUrl: string) => {
    setIsLoading(true);
    setSelectedImage(imageUrl);
  };

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
        
        <TabsContent value="simple" className="flex flex-col items-center mb-8">
          <SimplePuzzleGame />
        </TabsContent>
        
        <TabsContent value="image" className="flex flex-col items-center mb-8">
          <ImageSelector 
            images={PUZZLE_IMAGES} 
            selectedImage={selectedImage}
            onSelect={handleImageSelect}
          />
          <ImagePuzzleGame 
            sampleImages={PUZZLE_IMAGES.map(img => img.url)} 
            initialImage={selectedImage}
            isImageLoading={isLoading}
            onImageLoaded={() => setIsLoading(false)}
          />
        </TabsContent>
      </Tabs>

      <PuzzleDemoInfo />
    </PageLayout>
  );
};

export default PuzzleDemo;
