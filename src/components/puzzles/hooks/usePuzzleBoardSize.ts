
import { useState, useEffect } from 'react';

export const usePuzzleBoardSize = (boardRef: React.RefObject<HTMLDivElement>) => {
  const [boardSize, setBoardSize] = useState({ width: 400, height: 400 });

  useEffect(() => {
    const updateBoardSize = () => {
      if (boardRef.current) {
        const container = boardRef.current.parentElement;
        if (container) {
          const screenWidth = window.innerWidth;
          let maxWidth;
          
          if (screenWidth < 640) { // sm
            maxWidth = Math.min(screenWidth - 32, 400);
          } else if (screenWidth < 768) { // md
            maxWidth = Math.min(screenWidth - 48, 500);
          } else {
            maxWidth = Math.min(container.clientWidth - 32, 600);
          }
          
          const aspectRatio = 1;
          setBoardSize({
            width: maxWidth,
            height: maxWidth * aspectRatio
          });
        }
      }
    };

    updateBoardSize();
    window.addEventListener('resize', updateBoardSize);
    return () => window.removeEventListener('resize', updateBoardSize);
  }, [boardRef]);

  return boardSize;
};
