
import React, { useState } from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import PhaserPuzzleEngine from '@/components/puzzles/playground/engines/PhaserPuzzleEngine';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1620677368158-1949bf7e6241?w=500&h=500&fit=crop"
];

const PhaserPuzzlePage = () => {
  const [selectedImage, setSelectedImage] = useState(SAMPLE_IMAGES[0]);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [showNumbers, setShowNumbers] = useState(false);
  
  // Calculate rows and columns based on difficulty
  const getDifficultySettings = (diff: string) => {
    switch(diff) {
      case 'easy': return { rows: 3, cols: 3 };
      case 'medium': return { rows: 4, cols: 4 };
      case 'hard': return { rows: 5, cols: 5 };
      default: return { rows: 4, cols: 4 };
    }
  };
  
  const { rows, cols } = getDifficultySettings(difficulty);
  
  return (
    <PageLayout
      title="Phaser Puzzle Game"
      subtitle="Test our new Phaser-based jigsaw puzzle engine"
    >
      <div className="max-w-6xl mx-auto mt-8">
        <Card className="p-6">
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
            columns={cols}
            showNumbers={showNumbers}
            puzzleId="phaser-test-1"
          />
        </Card>
      </div>
    </PageLayout>
  );
};

export default PhaserPuzzlePage;
