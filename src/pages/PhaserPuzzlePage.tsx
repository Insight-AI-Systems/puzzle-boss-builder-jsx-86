
import React, { useState } from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import PhaserPuzzleEngine from '@/components/puzzles/playground/engines/PhaserPuzzleEngine';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import Breadcrumb from '@/components/common/Breadcrumb';

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1620677368158-1949bf7e6241?w=500&h=500&fit=crop"
];

const PhaserPuzzlePage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState(SAMPLE_IMAGES[0]);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Puzzles', path: '/puzzles' },
    { label: 'Phaser Puzzle', active: true }
  ];
  
  // Calculate rows and columns based on selected difficulty
  const getDimensionsForDifficulty = (diff: string) => {
    switch (diff) {
      case 'easy':
        return { rows: 3, columns: 3 };
      case 'medium':
        return { rows: 4, columns: 4 };
      case 'hard':
        return { rows: 5, columns: 5 };
      default:
        return { rows: 4, columns: 4 };
    }
  };
  
  const { rows, columns } = getDimensionsForDifficulty(difficulty);
  
  return (
    <PageLayout title="Phaser Puzzle" subtitle="Race against the clock to solve the puzzle!">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="max-w-6xl mx-auto my-8">
        <Card>
          <CardContent className="pt-6">
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
            
            <PhaserPuzzleEngine
              imageUrl={selectedImage}
              rows={rows}
              columns={columns}
              puzzleId={difficulty}
            />
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default PhaserPuzzlePage;
