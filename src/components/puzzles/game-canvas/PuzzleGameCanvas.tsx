import React, { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface PuzzleGameCanvasProps {
  children: ReactNode;
  aspectRatio?: 'square' | 'landscape' | 'portrait';
  className?: string;
}

export const PuzzleGameCanvas: React.FC<PuzzleGameCanvasProps> = ({
  children,
  aspectRatio = 'landscape',
  className = ''
}) => {
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square': return 'aspect-square';
      case 'portrait': return 'aspect-[3/4]';
      case 'landscape': 
      default: return 'aspect-[4/3]';
    }
  };

  return (
    <div className={`w-full ${getAspectRatioClass()} ${className}`}>
      <Card className="h-full bg-gradient-to-br from-muted/20 to-muted/40 border-puzzle-aqua/20">
        <CardContent className="h-full p-4 flex items-center justify-center">
          <div className="w-full h-full relative">
            {children}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};