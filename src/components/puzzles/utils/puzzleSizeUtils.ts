
import { DifficultyLevel, difficultyConfig } from '../types/puzzle-types';

export const calculateContainerSize = (isMobile: boolean, difficulty: DifficultyLevel) => {
  const gridSize = difficultyConfig[difficulty].gridSize;
  
  // Get viewport width to determine appropriate sizing
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
  
  if (isMobile) {
    // More dynamic sizing based on viewport for mobile
    const maxMobileWidth = Math.min(viewportWidth - 40, 320);
    return {
      width: maxMobileWidth,
      height: maxMobileWidth,
      pieceSize: maxMobileWidth / gridSize
    };
  }
  
  // For tablets (between 768px and 1024px)
  if (viewportWidth < 1024) {
    const tabletSize = Math.min(viewportWidth - 80, 480);
    return {
      width: tabletSize,
      height: tabletSize,
      pieceSize: tabletSize / gridSize
    };
  }
  
  // For desktops, adjust size based on difficulty
  const baseSize = 480;
  const adjustedSize = difficulty === '5x5' ? baseSize - 40 : 
                       difficulty === '4x4' ? baseSize - 20 : 
                       baseSize;
  
  return {
    width: adjustedSize,
    height: adjustedSize,
    pieceSize: adjustedSize / gridSize
  };
};

// Helper function to determine appropriate difficulty based on screen size
export const getRecommendedDifficulty = (width: number): DifficultyLevel => {
  if (width < 480) {
    return '3x3'; // Simpler puzzles for smaller screens
  } else if (width < 768) {
    return '4x4'; // Medium complexity for tablets
  } else {
    return '5x5'; // Full complexity for desktops
  }
};

// Helper for touch controls sizing
export const getTouchControlsSize = (isMobile: boolean) => {
  return isMobile ? 
    { buttonSize: 42, iconSize: 20 } : 
    { buttonSize: 36, iconSize: 16 };
};
