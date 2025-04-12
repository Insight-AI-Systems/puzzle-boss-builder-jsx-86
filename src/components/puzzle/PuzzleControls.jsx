
import React from 'react';
import { Shuffle, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PuzzleControls = ({ shufflePuzzle, resetPuzzle, muted, setMuted }) => {
  return (
    <div className="flex justify-center gap-2 w-full max-w-xs">
      <Button 
        variant="outline" 
        size="sm"
        className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10"
        onClick={shufflePuzzle}
      >
        <Shuffle className="mr-1 w-4 h-4" />
        Shuffle
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10"
        onClick={resetPuzzle}
      >
        Reset
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10 ml-auto"
        onClick={() => setMuted(!muted)}
      >
        {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </Button>
    </div>
  );
};

export default PuzzleControls;
