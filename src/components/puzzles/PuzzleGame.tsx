import React, { useEffect } from 'react';
import { PuzzleProvider, usePuzzleContext } from './PuzzleProvider';
import CustomPuzzleEngine from './playground/engines/CustomPuzzleEngine';
import { useToast } from '@/hooks/use-toast';

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
      showNumbers={showNumbers}
    />
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
