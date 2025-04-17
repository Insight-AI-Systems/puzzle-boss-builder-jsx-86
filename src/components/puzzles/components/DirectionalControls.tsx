
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { BasePuzzlePiece } from '../types/puzzle-types';
import { getTouchControlsSize } from '../utils/puzzleSizeUtils';

interface DirectionalControlsProps {
  draggedPiece: BasePuzzlePiece | null;
  onDirectionalMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
  isMobile?: boolean;
}

const DirectionalControls: React.FC<DirectionalControlsProps> = ({
  draggedPiece,
  onDirectionalMove,
  isMobile = false
}) => {
  const { buttonSize, iconSize } = getTouchControlsSize(isMobile);
  
  return (
    <div className={`mt-4 grid grid-cols-3 gap-1 sm:gap-2 ${isMobile ? 'w-[180px]' : 'w-[200px]'}`}>
      <div></div>
      <Button 
        size="icon" 
        variant="outline" 
        onClick={() => onDirectionalMove('up')}
        className="aspect-square"
        style={{ width: buttonSize, height: buttonSize }}
        disabled={!draggedPiece}
      >
        <ChevronUp style={{ width: iconSize, height: iconSize }} />
      </Button>
      <div></div>
      <Button 
        size="icon" 
        variant="outline" 
        onClick={() => onDirectionalMove('left')}
        className="aspect-square"
        style={{ width: buttonSize, height: buttonSize }}
        disabled={!draggedPiece}
      >
        <ChevronLeft style={{ width: iconSize, height: iconSize }} />
      </Button>
      <div className="flex items-center justify-center text-xs text-puzzle-aqua">
        {draggedPiece ? `Piece ${parseInt(draggedPiece.id.split('-')[1]) + 1}` : 'Select a piece'}
      </div>
      <Button 
        size="icon" 
        variant="outline" 
        onClick={() => onDirectionalMove('right')}
        className="aspect-square"
        style={{ width: buttonSize, height: buttonSize }}
        disabled={!draggedPiece}
      >
        <ChevronRight style={{ width: iconSize, height: iconSize }} />
      </Button>
      <div></div>
      <Button 
        size="icon" 
        variant="outline" 
        onClick={() => onDirectionalMove('down')}
        className="aspect-square"
        style={{ width: buttonSize, height: buttonSize }}
        disabled={!draggedPiece}
      >
        <ChevronDown style={{ width: iconSize, height: iconSize }} />
      </Button>
      <div></div>
    </div>
  );
};

export default DirectionalControls;
