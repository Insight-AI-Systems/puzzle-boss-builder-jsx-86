
import React, { RefObject, memo, useEffect, useRef } from 'react';
import FirstMoveOverlay from '../FirstMoveOverlay';
import { JigsawPuzzle } from 'react-jigsaw-puzzle/lib';
import '../styles/jigsaw-puzzle.css';

interface PuzzleContainerProps {
  loading: boolean;
  handleStartIfFirstMove: () => void;
  imageUrl: string;
  rows: number;
  columns: number;
  keyProp: number;
  onSolved: () => void;
  showBorder: boolean;
  hasStarted: boolean;
}

export const PuzzleContainer: React.FC<PuzzleContainerProps> = ({
  loading,
  handleStartIfFirstMove,
  imageUrl,
  rows,
  columns,
  keyProp,
  onSolved,
  showBorder,
  hasStarted
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevImageRef = useRef(imageUrl);
  
  useEffect(() => {
    if (prevImageRef.current !== imageUrl) {
      console.log('Image URL changed to:', imageUrl);
      prevImageRef.current = imageUrl;
    }
  }, [imageUrl]);

  const containerStyle = {
    position: 'relative',
    width: '100%',
    maxWidth: '500px',
  } as const;

  return (
    <div
      ref={containerRef}
      style={containerStyle}
      tabIndex={0}
      className="focus:outline-1 focus:outline-primary relative"
    >
      <FirstMoveOverlay show={!hasStarted && !loading} onFirstMove={handleStartIfFirstMove} />

      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-20">
          <span className="ml-2">Loading puzzle...</span>
        </div>
      ) : (
        <div
          onClick={handleStartIfFirstMove}
          className={!showBorder ? 'no-border-puzzle' : ''}
        >
          <JigsawPuzzle
            key={keyProp}
            imageSrc={imageUrl}
            rows={rows}
            columns={columns}
            onSolved={onSolved}
            // Add a class to enable bright border
            className={showBorder ? 'with-border' : ''}
          />
        </div>
      )}
    </div>
  );
};

export default memo(PuzzleContainer);
