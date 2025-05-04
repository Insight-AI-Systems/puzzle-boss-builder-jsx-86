
import React, { useEffect, useState } from 'react';
import EnhancedJigsawPuzzle from './engines/EnhancedJigsawPuzzle';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface PuzzleGameProps {
  imageUrl: string;
  puzzleId?: string;
  rows?: number;
  columns?: number;
  showNumbers?: boolean;
  showGuide?: boolean;
  isPremium?: boolean;
  onComplete?: (stats: { moves: number, time: number }) => void;
}

const PuzzleGame: React.FC<PuzzleGameProps> = ({
  imageUrl,
  puzzleId = 'demo',
  rows = 4,
  columns = 4,
  showNumbers = false,
  showGuide = true,
  isPremium = false,
  onComplete
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    const img = new Image();
    img.onload = () => setIsLoading(false);
    img.onerror = () => {
      toast({
        title: 'Error',
        description: 'Failed to load puzzle image',
        variant: 'destructive',
      });
      setIsLoading(false);
    };
    img.src = imageUrl;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl, toast]);

  const handlePuzzleComplete = (stats: { moves: number, time: number }) => {
    toast({
      title: '🎉 Puzzle Completed!',
      description: `You completed the puzzle in ${Math.floor(stats.time / 60)}:${(stats.time % 60).toString().padStart(2, '0')} with ${stats.moves} moves.`
    });
    
    if (onComplete) {
      onComplete(stats);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-64 bg-muted/20 rounded-lg">
        <div className="text-muted-foreground">Loading puzzle...</div>
      </div>
    );
  }

  return (
    <EnhancedJigsawPuzzle
      imageUrl={imageUrl}
      rows={rows}
      columns={columns}
      puzzleId={puzzleId}
      userId={user?.id}
      showNumbers={showNumbers}
      showGuide={showGuide}
      isPremium={isPremium}
      onComplete={handlePuzzleComplete}
    />
  );
};

export default PuzzleGame;
