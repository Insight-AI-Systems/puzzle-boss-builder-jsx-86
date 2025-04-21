import React, { useState, useEffect, useRef } from 'react';
import { JigsawPuzzle } from 'react-jigsaw-puzzle/lib';
import 'react-jigsaw-puzzle/lib/jigsaw-puzzle.css';
import { Image as ImageIcon } from 'lucide-react';
import { PuzzleTimerDisplay } from './components/PuzzleTimerDisplay';
import { PuzzleControlsBar } from './components/PuzzleControlsBar';
import { PuzzleCompleteBanner } from './components/PuzzleCompleteBanner';
import { usePuzzleTimer } from './usePuzzleTimer';
import { usePuzzleImagePreload } from './hooks/usePuzzleImagePreload';
import FirstMoveOverlay from './FirstMoveOverlay';
import { PuzzleHeaderAndControls } from './components/PuzzleHeaderAndControls';
import { PuzzleContainer } from './components/PuzzleContainer';
import { PuzzleFooter } from './components/PuzzleFooter';
import { PuzzleCongratulationSplash } from './components/PuzzleCongratulationSplash';
import { PuzzleSidebarLeaderboard } from './components/PuzzleSidebarLeaderboard';
import { supabase } from '@/integrations/supabase/client';

interface ReactJigsawPuzzleEngine2Props {
  imageUrl: string;
  rows: number;
  columns: number;
}

const ReactJigsawPuzzleEngine2: React.FC<ReactJigsawPuzzleEngine2Props> = ({
  imageUrl, rows, columns
}) => {
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [solveTime, setSolveTime] = useState<number | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [showBorder, setShowBorder] = useState(true);
  const [key, setKey] = useState(Date.now());
  const puzzleContainerRef = useRef<HTMLDivElement>(null);

  const {
    elapsed, start, stop, reset, isRunning,
    startTime, setElapsed, setStartTime
  } = usePuzzleTimer();

  usePuzzleImagePreload({
    imageUrl,
    onLoad: () => {
      console.log('Image preloaded successfully:', imageUrl);
      setLoading(false);
      setElapsed(0);
      setHasStarted(false);
      setCompleted(false);
      setSolveTime(null);
    },
    onError: (error) => {
      console.error('Error loading puzzle image:', error);
      setLoading(false);
    }
  });

  const handleStartIfFirstMove = () => {
    if (!hasStarted && !completed) {
      setHasStarted(true);
      start();
      setStartTime(Date.now());
    }
  };

  const savePuzzleCompletion = async (completionTime: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('User not authenticated, completion data not saved');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('puzzle_completions')
        .insert([
          {
            user_id: user.id,
            puzzle_id: imageUrl, // Using imageUrl as puzzle_id for now
            completion_time: completionTime,
            moves_count: 0,
            difficulty_level: `${rows}x${columns}`,
            game_mode: 'classic'
          }
        ]);

      if (error) {
        console.error('Error saving puzzle completion:', error);
      } else {
        console.log('Puzzle completion saved successfully:', data);
      }
    } catch (error) {
      console.error('Error in savePuzzleCompletion:', error);
    }
  };

  const handlePuzzleComplete = () => {
    if (!completed) {
      setCompleted(true);
      const endTime = Date.now();
      if (startTime) {
        const totalTime = (endTime - startTime) / 1000;
        setSolveTime(totalTime);
        setElapsed(Math.floor(totalTime));
        savePuzzleCompletion(totalTime);
      }
      stop();
    }
  };

  const handleReset = () => {
    setKey(Date.now());
    setElapsed(0);
    setHasStarted(false);
    setCompleted(false);
    setSolveTime(null);
    reset();
    setStartTime(null);
  };

  const handleToggleBorder = () => {
    setShowBorder(prev => !prev);
  };

  const handlePlayAgain = () => {
    handleReset();
  };

  useEffect(() => {
    const container = puzzleContainerRef.current;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasStarted && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight' || 
          e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        handleStartIfFirstMove();
      }
    };
    
    if (container) {
      container.addEventListener('keydown', handleKeyDown);
      return () => {
        container.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [hasStarted, completed]);

  const showFirstMoveOverlay = !hasStarted && !loading && !completed;

  const puzzleContainerStyle: React.CSSProperties = {
    width: '100vw',
    maxWidth: 'calc(100vw - 48px)',
    minWidth: '320px',
    height: '80vh',
    minHeight: '500px',
    maxHeight: '90vh',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 auto',
    background: 'var(--background, #18181B)',
    borderRadius: '1.5rem',
    boxShadow: '0 4px 32px rgba(0,0,0,0.14)',
    overflow: 'visible'
  };

  useEffect(() => {
    console.log('Current image URL:', imageUrl);
  }, [imageUrl]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full relative">
      <PuzzleSidebarLeaderboard solveTime={solveTime} />

      <PuzzleHeaderAndControls
        elapsed={elapsed}
        onReset={handleReset}
        onToggleBorder={handleToggleBorder}
        showBorder={showBorder}
      />

      <PuzzleContainer
        puzzleContainerRef={puzzleContainerRef}
        puzzleContainerStyle={puzzleContainerStyle}
        showFirstMoveOverlay={showFirstMoveOverlay}
        loading={loading}
        handleStartIfFirstMove={handleStartIfFirstMove}
        imageUrl={imageUrl}
        rows={rows}
        columns={columns}
        keyProp={key}
        onSolved={handlePuzzleComplete}
        showBorder={showBorder}
      />

      <PuzzleFooter
        solveTime={solveTime}
        showBorder={showBorder}
        rows={rows}
        columns={columns}
      />

      <PuzzleCongratulationSplash 
        show={completed} 
        solveTime={solveTime} 
        onPlayAgain={handlePlayAgain}
      />
    </div>
  );
};

export default ReactJigsawPuzzleEngine2;
