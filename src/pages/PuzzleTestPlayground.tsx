
import React, { useState } from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PuzzleEnginePlayground from '@/components/puzzles/playground/PuzzleEnginePlayground';
import Breadcrumb from '@/components/common/Breadcrumb';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

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
              <CardTitle className="text-xl">Puzzle Engine Comparison</CardTitle>
              <Badge variant="outline" className="flex items-center gap-2 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 px-3 py-1.5">
                <AlertTriangle size={16} />
                <span>Phaser Engine Coming Soon</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="mb-4 text-muted-foreground">
              This playground allows you to test and compare different puzzle engine implementations 
              without affecting the main application. Cycle through different engines using the button,
              configure settings, and evaluate which solution works best for our needs.
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
