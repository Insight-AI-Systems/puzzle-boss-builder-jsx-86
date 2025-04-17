
import { DifficultyLevel, difficultyConfig } from '../types/puzzle-types';

export const calculateContainerSize = (isMobile: boolean, difficulty: DifficultyLevel) => {
  const gridSize = difficultyConfig[difficulty].gridSize;
  
  if (isMobile) {
    return {
      width: 300,
      height: 300,
      pieceSize: 300 / gridSize
    };
  }
  
  // Decrease size as grid gets larger
  const baseSize = 360;
  const size = difficulty === '5x5' ? baseSize - 30 : baseSize;
  
  return {
    width: size,
    height: size,
    pieceSize: size / gridSize
  };
};
