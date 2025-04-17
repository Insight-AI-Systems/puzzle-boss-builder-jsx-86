
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { PuzzlePiece } from '../types/puzzle-types';

interface DirectionalControlsProps {
  draggedPiece: PuzzlePiece | null;
  onDirectionalMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

const DirectionalControls: React.FC<DirectionalControlsProps> = ({
  draggedPiece,
  onDirectionalMove
}) => {
  return (
    <div className="mt-4 grid grid-cols-3 gap-2 w-[200px]">
      <div></div>
      <Button 
        size="icon" 
        variant="outline" 
        onClick={() => onDirectionalMove('up')}
        className="aspect-square"
        disabled={!draggedPiece}
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
      <div></div>
      <Button 
        size="icon" 
        variant="outline" 
        onClick={() => onDirectionalMove('left')}
        className="aspect-square"
        disabled={!draggedPiece}
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
        disabled={!draggedPiece}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <div></div>
      <Button 
        size="icon" 
        variant="outline" 
        onClick={() => onDirectionalMove('down')}
        className="aspect-square"
        disabled={!draggedPiece}
      >
        <ChevronDown className="h-4 w-4" />
      </Button>
      <div></div>
    </div>
  );
};

export default DirectionalControls;
