
import React, { useState } from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import SimplePuzzleGame from '@/components/puzzles/SimplePuzzleGame';
import ImagePuzzleGame from '@/components/puzzles/ImagePuzzleGame';
import PuzzleDemoInfo from '@/components/puzzles/PuzzleDemoInfo';
import Breadcrumb from '@/components/common/Breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageSelector from '@/components/puzzles/components/ImageSelector';
import { PUZZLE_IMAGES } from '@/components/puzzles/constants/puzzle-images';
import { useDeviceInfo } from '@/hooks/use-mobile';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Puzzle, Clock, RotateCcw } from 'lucide-react';

const PuzzleDemo: React.FC = () => {
  const { isMobile } = useDeviceInfo();
  
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-800 to-blue-600">
          <CardContent className="p-4 flex items-start space-x-4">
            <div className="bg-blue-500 p-2 rounded-full">
              <Puzzle className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-white">Classic Mode</CardTitle>
              <CardDescription className="text-blue-100">
                Standard jigsaw puzzle experience with piece snapping and hints
              </CardDescription>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-800 to-orange-600">
          <CardContent className="p-4 flex items-start space-x-4">
            <div className="bg-orange-500 p-2 rounded-full">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-white">Timed Mode</CardTitle>
              <CardDescription className="text-orange-100">
                Race against the clock to complete puzzles before time runs out
              </CardDescription>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-800 to-purple-600">
          <CardContent className="p-4 flex items-start space-x-4">
            <div className="bg-purple-500 p-2 rounded-full">
              <RotateCcw className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-white">Challenge Mode</CardTitle>
              <CardDescription className="text-purple-100">
                Pieces need to be rotated to their correct orientation
              </CardDescription>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="image" className="w-full">
        <TabsList className={`grid w-full ${isMobile ? 'max-w-full' : 'max-w-sm mx-auto'} grid-cols-2 mb-4`}>
          <TabsTrigger value="simple">Simple Puzzle</TabsTrigger>
          <TabsTrigger value="image">Image Puzzle</TabsTrigger>
        </TabsList>
        
        <TabsContent value="simple" className="flex flex-col items-center mb-8">
          <SimplePuzzleGame />
        </TabsContent>
        
        <TabsContent value="image" className="flex flex-col items-center mb-8">
          {!isMobile && (
            <div className="w-full max-w-md mb-4">
              <ImageSelector 
                images={PUZZLE_IMAGES} 
                selectedImage={selectedImage}
                onSelect={handleImageSelect}
              />
            </div>
          )}
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
