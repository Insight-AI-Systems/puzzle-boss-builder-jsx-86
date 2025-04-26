
import React, { useEffect, useState } from 'react';
import { PuzzleProvider, usePuzzleContext } from './PuzzleProvider';
import CustomPuzzleEngine from './playground/engines/CustomPuzzleEngine';
import { useToast } from '@/hooks/use-toast';
import { usePuzzleImagePreload } from './playground/engines/hooks/usePuzzleImagePreload';

interface PuzzleGameProps {
  imageUrl: string;
  puzzleId?: string;
  rows?: number;
  columns?: number;
  showNumbers?: boolean;
}

const PuzzleGameInner: React.FC<PuzzleGameProps> = ({
  imageUrl,
  rows = 3,
  columns = 4,
  showNumbers = true
}) => {
  const { isAuthenticated, progress } = usePuzzleContext();
  const { toast } = useToast();
  const [imageError, setImageError] = useState<string | null>(null);

  // Preload the image to ensure it's ready before rendering the puzzle
  const { isLoaded, error } = usePuzzleImagePreload({
    imageUrl,
    onError: (err) => {
      console.error('Error loading puzzle image:', err);
      setImageError(err.message);
      toast({
        title: "Image Loading Error",
        description: "There was a problem loading the puzzle image. Please try again.",
        variant: "destructive",
      });
    }
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Not signed in",
        description: "Sign in to save your puzzle progress",
        variant: "default",
      });
    }
  }, [isAuthenticated, toast]);

  // Clear any previous errors when the image URL changes
  useEffect(() => {
    setImageError(null);
  }, [imageUrl]);

  return (
    <>
      {imageError ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <p className="text-destructive mb-4">Failed to load puzzle image</p>
          <button 
            className="bg-puzzle-aqua text-white px-4 py-2 rounded hover:bg-puzzle-aqua/80"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      ) : (
        <CustomPuzzleEngine
          imageUrl={imageUrl}
          rows={rows}
          columns={columns}
          showNumbers={showNumbers}
        />
      )}
    </>
  );
};

const PuzzleGame: React.FC<PuzzleGameProps> = (props) => {
  return (
    <PuzzleProvider puzzleId={props.puzzleId}>
      <PuzzleGameInner {...props} />
    </PuzzleProvider>
  );
};

export default PuzzleGame;
