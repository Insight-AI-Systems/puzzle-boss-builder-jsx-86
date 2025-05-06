
import React, { useState } from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PuzzleEnginePlayground from '@/components/puzzles/playground/PuzzleEnginePlayground';
import Breadcrumb from '@/components/common/Breadcrumb';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AlertCircle, Info, Puzzle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1620677368158-1949bf7e6241?w=500&h=500&fit=crop"
];

const PuzzleTestPlayground: React.FC = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Dev Dashboard', path: '/test-dashboard' },
    { label: 'Puzzle Test Playground', active: true }
  ];
  
  const [selectedImage, setSelectedImage] = useState(SAMPLE_IMAGES[0]);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  
  return (
    <PageLayout
      title="Puzzle Test Playground"
      subtitle="Compare different puzzle engines in a safe, isolated environment"
    >
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="max-w-6xl mx-auto mt-8">
        <Card className="mb-8">
          <CardHeader className="bg-muted/30">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl flex items-center gap-2">
                <Puzzle className="h-5 w-5" />
                Puzzle Engine Comparison
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Alert className="mb-4 border-primary/50 bg-primary/10">
              <Info className="h-4 w-4 text-primary" />
              <AlertTitle>Classic Jigsaw Engine with Traditional Pieces</AlertTitle>
              <AlertDescription>
                Our jigsaw engines feature traditional puzzle pieces with classic bulb and socket shapes.
                Each piece has precisely crafted interlocking tabs that provide a satisfying traditional jigsaw experience.
              </AlertDescription>
            </Alert>
            
            <p className="mb-4 text-muted-foreground">
              This playground allows you to test different puzzle engine implementations
              with classic jigsaw puzzle pieces. All engines use traditional bulb and socket piece designs
              for an authentic puzzle experience.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <Label htmlFor="image-select">Select Image</Label>
                <Select value={selectedImage} onValueChange={setSelectedImage}>
                  <SelectTrigger id="image-select">
                    <SelectValue placeholder="Select an image" />
                  </SelectTrigger>
                  <SelectContent>
                    {SAMPLE_IMAGES.map((img, idx) => (
                      <SelectItem key={idx} value={img}>
                        Image {idx + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="difficulty-select">Difficulty</Label>
                <Select value={difficulty} onValueChange={(val: 'easy' | 'medium' | 'hard') => setDifficulty(val)}>
                  <SelectTrigger id="difficulty-select">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy (3×3)</SelectItem>
                    <SelectItem value="medium">Medium (4×4)</SelectItem>
                    <SelectItem value="hard">Hard (5×5)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <PuzzleEnginePlayground 
              selectedImage={selectedImage}
              difficulty={difficulty}
              showNumbersToggle={true}
            />
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default PuzzleTestPlayground;
