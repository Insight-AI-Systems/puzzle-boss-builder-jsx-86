
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

// Preview what a grid of the selected size would look like
const renderGridPreview = (gridSize) => {
  const cells = [];
  
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      cells.push(
        <div 
          key={`${i}-${j}`} 
          className="border border-puzzle-aqua/30"
          style={{
            width: `${100/gridSize}%`,
            height: `${100/gridSize}%`,
            position: 'absolute',
            top: `${i * (100/gridSize)}%`,
            left: `${j * (100/gridSize)}%`,
          }}
        />
      );
    }
  }
  
  return cells;
};

const PuzzlePreview = ({ selectedImage, gridSize }) => {
  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <CardTitle>Puzzle Preview</CardTitle>
        <CardDescription>
          This is how the puzzle will appear to users
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="max-w-xs mx-auto">
          <div className="relative aspect-square rounded-md overflow-hidden bg-puzzle-black/50 border-2 border-puzzle-aqua">
            <img 
              src={selectedImage} 
              alt="Puzzle" 
              className="w-full h-full object-cover"
            />
            
            {/* Grid overlay */}
            {renderGridPreview(gridSize)}
          </div>
          
          <div className="mt-4 text-center text-sm text-muted-foreground">
            {gridSize}x{gridSize} grid • {gridSize * gridSize} pieces
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PuzzlePreview;
