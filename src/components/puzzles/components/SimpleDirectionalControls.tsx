
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { SimplePuzzlePiece } from '../types/simple-puzzle-types';

interface SimpleDirectionalControlsProps {
  draggedPiece: SimplePuzzlePiece | null;
  isSolved: boolean;
  isMobile: boolean;
  onDirectionalMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

const SimpleDirectionalControls: React.FC<SimpleDirectionalControlsProps> = ({
  draggedPiece,
  isSolved,
  isMobile,
  onDirectionalMove
}) => {
  // Only show on mobile or when a piece is selected, and not when solved
  if ((!isMobile && !draggedPiece) || isSolved) {
    return null;
  }

  return (
    <div className="mt-4 grid grid-cols-3 gap-2 w-[200px]">
      <div></div>
      <Button 
        size="icon" 
        variant="outline" 
        onClick={() => onDirectionalMove('up')}
        className="aspect-square"
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
      <div></div>
      <Button 
        size="icon" 
        variant="outline" 
        onClick={() => onDirectionalMove('left')}
        className="aspect-square"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="flex items-center justify-center text-xs text-puzzle-aqua">
        {draggedPiece ? `Move ${parseInt(draggedPiece.id.split('-')[1]) + 1}` : 'Select a piece'}
      </div>
      <Button 
        size="icon" 
        variant="outline" 
        onClick={() => onDirectionalMove('right')}
        className="aspect-square"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <div></div>
      <Button 
        size="icon" 
        variant="outline" 
        onClick={() => onDirectionalMove('down')}
        className="aspect-square"
      >
        <ChevronDown className="h-4 w-4" />
      </Button>
      <div></div>
    </div>
  );
};

export default SimpleDirectionalControls;
