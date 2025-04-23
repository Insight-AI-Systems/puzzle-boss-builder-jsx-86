
import React, { useEffect } from 'react';
import { PuzzleProvider, usePuzzleContext } from './PuzzleProvider';
import CustomPuzzleEngine from './playground/engines/CustomPuzzleEngine';
import { useToast } from '@/hooks/use-toast';

interface PuzzleGameProps {
  imageUrl: string;
  puzzleId?: string;
  rows?: number;
  columns?: number;
}

// Inner component that uses the PuzzleContext
const PuzzleGameInner: React.FC<PuzzleGameProps> = ({
  imageUrl,
  rows = 3,
  columns = 4
}) => {
  const { isAuthenticated, progress } = usePuzzleContext();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Not signed in",
        description: "Sign in to save your puzzle progress",
        variant: "default",
      });
    }
  }, [isAuthenticated, toast]);

  return (
    <CustomPuzzleEngine
      imageUrl={imageUrl}
      rows={rows}
      columns={columns}
    />
  );
};

// Main component that provides the PuzzleContext
const PuzzleGame: React.FC<PuzzleGameProps> = (props) => {
  return (
    <PuzzleProvider puzzleId={props.puzzleId}>
      <PuzzleGameInner {...props} />
    </PuzzleProvider>
  );
};

export default PuzzleGame;
