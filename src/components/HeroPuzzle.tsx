
import React, { useState, useCallback } from 'react';
import { useHeroPuzzle } from '@/hooks/useHeroPuzzle';
import { usePuzzleTimer } from '@/components/puzzles/playground/engines/hooks/usePuzzleTimer';
import { usePuzzleCompletion } from '@/components/puzzles/playground/engines/hooks/usePuzzleCompletion';
import CustomPuzzleEngine from '@/components/puzzles/playground/engines/CustomPuzzleEngine';
import { PuzzleCongratulationSplash } from '@/components/puzzles/playground/engines/components/PuzzleCongratulationSplash';
import { PuzzleTimerDisplay } from '@/components/puzzles/playground/engines/components/PuzzleTimerDisplay';
import { Loader2, PuzzleIcon, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb';

const difficultyToRowsMap = {
  'easy': 3,
  'medium': 4,
  'hard': 5
};

const HeroPuzzle: React.FC = () => {
  const { puzzleConfig, isLoading } = useHeroPuzzle();
  const [resetKey, setResetKey] = useState(0);
  
  const {
    elapsed,
    start: startTimer,
    stop: stopTimer,
    reset: resetTimer,
    isRunning
  } = usePuzzleTimer();
  
  const imageUrl = puzzleConfig?.image_url || FALLBACK_IMAGE;
  const difficulty = puzzleConfig?.difficulty || 'medium';
  const rows = difficultyToRowsMap[difficulty as keyof typeof difficultyToRowsMap] || 3;
  
  const { completed, solveTime, handlePuzzleComplete } = usePuzzleCompletion({
    imageUrl,
    rows,
    columns: rows
  });
  
  const handleGameStart = useCallback(() => {
    if (!isRunning) startTimer();
  }, [isRunning, startTimer]);
  
  const handlePuzzleSolved = useCallback((timeElapsedSeconds: number) => {
    stopTimer();
    handlePuzzleComplete(timeElapsedSeconds * 1000); // Convert to milliseconds
  }, [stopTimer, handlePuzzleComplete]);
  
  const handlePlayAgain = useCallback(() => {
    resetTimer();
    setResetKey(prev => prev + 1);
  }, [resetTimer]);

  // For debugging
  console.log('HeroPuzzle rendering', { 
    puzzleConfig, 
    isLoading, 
    imageUrl, 
    rows, 
    completed, 
    solveTime 
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48 bg-black/30 rounded-lg">
        <Loader2 className="w-8 h-8 text-puzzle-aqua animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-xl mx-auto bg-gradient-to-b from-black/60 to-black/80 rounded-xl shadow-xl border border-puzzle-aqua/30 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-puzzle-aqua/10 via-transparent to-transparent opacity-50"></div>
      
      <header className="flex items-center justify-between p-3 border-b border-puzzle-aqua/20">
        <div className="flex items-center gap-2">
          <PuzzleIcon className="w-5 h-5 text-puzzle-aqua" />
          <span className="font-bold text-puzzle-aqua">{puzzleConfig?.title || "Welcome Puzzle"}</span>
        </div>
        <PuzzleTimerDisplay seconds={elapsed} />
      </header>
      
      <div className="relative p-4">
        <CustomPuzzleEngine 
          key={`hero-puzzle-${resetKey}`}
          imageUrl={imageUrl}
          rows={rows} 
          columns={rows} 
          showGuideImage={true}
          onComplete={handlePuzzleSolved}
        />
        
        <PuzzleCongratulationSplash 
          show={completed} 
          solveTime={solveTime} 
          onPlayAgain={handlePlayAgain} 
        />
      </div>
      
      <footer className="flex justify-between items-center p-3 bg-black/40 border-t border-puzzle-aqua/20">
        <div className="text-xs text-puzzle-gold">
          Difficulty: <span className="capitalize">{difficulty}</span>
        </div>
        <Button className="bg-puzzle-gold hover:bg-puzzle-gold/80 text-puzzle-black" size="sm" asChild>
          <Link to="/puzzles">
            More Puzzles <ExternalLink className="ml-1 w-3 h-3" />
          </Link>
        </Button>
      </footer>
    </div>
  );
};

export default HeroPuzzle;
