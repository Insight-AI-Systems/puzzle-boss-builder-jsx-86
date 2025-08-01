
import React, { useState } from 'react';
import EnhancedJigsawPuzzle from './puzzles/engines/EnhancedJigsawPuzzle';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e',
];

const JigsawPuzzleGame: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState(DEFAULT_IMAGES[0]);
  const [difficulty, setDifficulty] = useState<{rows: number, columns: number}>({
    rows: 3,
    columns: 3
  });

  const handleDifficultyChange = (value: string) => {
    switch (value) {
      case 'easy':
        setDifficulty({ rows: 3, columns: 3 });
        break;
      case 'medium':
        setDifficulty({ rows: 4, columns: 4 });
        break;
      case 'hard':
        setDifficulty({ rows: 5, columns: 5 });
        break;
      case 'expert':
        setDifficulty({ rows: 6, columns: 6 });
        break;
      default:
        setDifficulty({ rows: 3, columns: 3 });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle>Jigsaw Puzzle Game</CardTitle>
          <CardDescription>
            Drag and drop the pieces to complete the puzzle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex flex-col gap-2 w-full sm:w-1/2">
              <label className="text-sm font-medium">Select Difficulty</label>
              <Select onValueChange={handleDifficultyChange} defaultValue="easy">
                <SelectTrigger>
                  <SelectValue placeholder="Select Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy (3×3)</SelectItem>
                  <SelectItem value="medium">Medium (4×4)</SelectItem>
                  <SelectItem value="hard">Hard (5×5)</SelectItem>
                  <SelectItem value="expert">Expert (6×6)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2 w-full sm:w-1/2">
              <label className="text-sm font-medium">Select Image</label>
              <Select 
                onValueChange={setSelectedImage} 
                defaultValue={selectedImage}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Image" />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_IMAGES.map((img, idx) => (
                    <SelectItem key={idx} value={img}>
                      Image {idx + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="bg-gray-50 p-2 rounded-md">
            <div className="aspect-square w-full max-w-md mx-auto mb-4">
              <img src={selectedImage} alt="Selected puzzle" className="rounded-md shadow-sm" />
            </div>
          </div>
        </CardContent>
      </Card>

      <EnhancedJigsawPuzzle 
        imageUrl={selectedImage}
        rows={difficulty.rows}
        columns={difficulty.columns}
        puzzleId="demo-jigsaw"
        showNumbers={false}
        showGuide={true}
      />
    </div>
  );
};

export default JigsawPuzzleGame;
