
import React from 'react';
import SimpleDirectionalControls from './SimpleDirectionalControls';
import { SimplePuzzlePiece } from '../types/simple-puzzle-types';

interface SimplePuzzleDirectionalControlsContainerProps {
  draggedPiece: SimplePuzzlePiece | null;
  isSolved: boolean;
  isMobile: boolean;
  onDirectionalMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
  isTouchDevice: boolean;
}

const SimplePuzzleDirectionalControlsContainer: React.FC<SimplePuzzleDirectionalControlsContainerProps> = ({
  draggedPiece, isSolved, isMobile, onDirectionalMove, isTouchDevice
}) => {
  if (!(isTouchDevice || draggedPiece) || isSolved) return null;
  return (
    <SimpleDirectionalControls 
      draggedPiece={draggedPiece}
      isSolved={isSolved}
      isMobile={isMobile}
      onDirectionalMove={onDirectionalMove}
    />
  );
};

export default SimplePuzzleDirectionalControlsContainer;
