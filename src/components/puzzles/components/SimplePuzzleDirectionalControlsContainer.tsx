
import React, { memo } from 'react';
import SimpleDirectionalControls from './SimpleDirectionalControls';
import { SimplePuzzlePiece } from '../types/simple-puzzle-types';

interface SimplePuzzleDirectionalControlsContainerProps {
  draggedPiece: SimplePuzzlePiece | null;
  isSolved: boolean;
  isMobile: boolean;
  onDirectionalMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
  isTouchDevice: boolean;
}

// Using memo to prevent unnecessary re-renders
const SimplePuzzleDirectionalControlsContainer: React.FC<SimplePuzzleDirectionalControlsContainerProps> = memo(({
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
});

SimplePuzzleDirectionalControlsContainer.displayName = 'SimplePuzzleDirectionalControlsContainer';

export default SimplePuzzleDirectionalControlsContainer;
