
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
import { useLeaderboard } from './hooks/usePuzzleLeaderboard';
import { useAuth } from '@/contexts/AuthContext';

interface ReactJigsawPuzzleEngine2Props {
  imageUrl: string;
  rows: number;
  columns: number;
  puzzleId?: string | null;
}

const ReactJigsawPuzzleEngine2: React.FC<ReactJigsawPuzzleEngine2Props> = ({
  imageUrl, rows, columns, puzzleId = "test-external-jigsaw" // fallback to static if not available
}) => {
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [solveTime, setSolveTime] = useState<number | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [showBorder, setShowBorder] = useState(true);
  const [key, setKey] = useState(Date.now());
  const puzzleContainerRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth?.() ?? { user: null }; // fallback if auth context isn't present
  const currentPlayerId = user?.id ?? null;
  const currentPlayerName = user?.user_metadata?.username || user?.email || "Anonymous";

  const {
    elapsed, start, stop, reset, isRunning,
    startTime, setElapsed, setStartTime
  } = usePuzzleTimer();

  const {
    leaderboard,
    leaderboardLoading,
    submitTime,
    refetch: refetchLeaderboard
  } = useLeaderboard(puzzleId);

  usePuzzleImagePreload({
    imageUrl,
    onLoad: () => {
      setLoading(false);
      setElapsed(0);
      setHasStarted(false);
      setCompleted(false);
      setSolveTime(null);
    },
    onError: (error) => {
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

  const handlePuzzleComplete = async () => {
    if (!completed) {
      setCompleted(true);
      const endTime = Date.now();
      if (startTime) {
        const totalTime = (endTime - startTime) / 1000;
        setSolveTime(totalTime);
        setElapsed(Math.floor(totalTime));
        stop();

        // Submit time to leaderboard in Supabase
        if (currentPlayerId && puzzleId) {
          await submitTime({
            puzzle_id: puzzleId,
            player_id: currentPlayerId,
            player_name: currentPlayerName,
            time_seconds: totalTime
          });
          refetchLeaderboard();
        }
      }
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
    maxWidth: 'calc(100vw - 32px - 220px)', // Account for narrower sidebar!
    minWidth: '320px',
    height: '85vh',
    minHeight: '600px',
    maxHeight: '94vh',
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
    // ... same as before, if needed ...
  }, [imageUrl]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full relative">
      <PuzzleSidebarLeaderboard
        solveTime={solveTime}
        puzzleId={puzzleId}
        currentPlayerId={currentPlayerId}
      />

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

      <PuzzleCongratulationSplash show={completed} solveTime={solveTime} />
    </div>
  );
};

export default ReactJigsawPuzzleEngine2;
