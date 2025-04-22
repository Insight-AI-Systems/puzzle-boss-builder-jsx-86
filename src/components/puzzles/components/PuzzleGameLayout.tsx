
import React from 'react';
import { VisualTheme } from '../types/puzzle-types';

interface PuzzleGameLayoutProps {
  visualTheme: VisualTheme;
  isMobile: boolean;
  children: React.ReactNode;
}

const PuzzleGameLayout: React.FC<PuzzleGameLayoutProps> = ({
  visualTheme,
  isMobile,
  children
}) => {
  const getThemeStyles = (theme: VisualTheme) => {
    switch (theme) {
      case 'light':
        return 'bg-white';
      case 'dark':
        return 'bg-gray-900 text-white';
      case 'colorful':
        return 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white';
      default:
        return 'bg-white';
    }
  };

  return (
    <div className={`flex flex-col items-center w-full max-w-full px-2 ${getThemeStyles(visualTheme)}`}>
      {children}
    </div>
  );
};

export default PuzzleGameLayout;
