
import React, { RefObject, memo, useEffect, useRef } from 'react';
import FirstMoveOverlay from '../FirstMoveOverlay';
import { JigsawPuzzle } from 'react-jigsaw-puzzle/lib';

interface PuzzleContainerProps {
  puzzleContainerRef: RefObject<HTMLDivElement>;
  puzzleContainerStyle: React.CSSProperties;
  showFirstMoveOverlay: boolean;
  loading: boolean;
  handleStartIfFirstMove: () => void;
  imageUrl: string;
  rows: number;
  columns: number;
  keyProp: number;
  onSolved: () => void;
  showBorder: boolean;
}

export const PuzzleContainer: React.FC<PuzzleContainerProps> = memo(({
  puzzleContainerRef,
  puzzleContainerStyle,
  showFirstMoveOverlay,
  loading,
  handleStartIfFirstMove,
  imageUrl,
  rows,
  columns,
  keyProp,
  onSolved,
  showBorder
}) => {
  // Track previous image URL to avoid unnecessary re-renders
  const prevImageRef = useRef(imageUrl);
  
  // Only log when image URL actually changes
  useEffect(() => {
    if (prevImageRef.current !== imageUrl) {
      console.log('Image URL changed to:', imageUrl);
      prevImageRef.current = imageUrl;
    }
  }, [imageUrl]);

  return (
    <div
      ref={puzzleContainerRef}
      style={puzzleContainerStyle}
      tabIndex={0}
      className="focus:outline-1 focus:outline-primary relative"
    >
      <FirstMoveOverlay show={showFirstMoveOverlay} onFirstMove={handleStartIfFirstMove} />

      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-20">
          <span className="ml-2">Loading puzzle...</span>
        </div>
      ) : (
        <div
          style={{ position: 'relative', width: '100%', maxWidth: '500px' }}
          onClick={handleStartIfFirstMove}
          className={!showBorder ? 'no-border' : ''}
        >
          {/* Display the image URL for debugging - shortened to reduce re-renders */}
          {imageUrl && (
            <div className="mb-2 text-xs text-muted-foreground">
              Image loaded: {imageUrl.substring(0, 20)}...
            </div>
          )}

          <JigsawPuzzle
            key={keyProp}
            imageSrc={imageUrl}
            rows={rows}
            columns={columns}
            onSolved={onSolved}
          />
        </div>
      )}
    </div>
  );
});

PuzzleContainer.displayName = 'PuzzleContainer';
