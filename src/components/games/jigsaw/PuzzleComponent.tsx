import React, { useEffect, useMemo, useRef, useState } from 'react';
import { JigsawPuzzle } from 'react-jigsaw-puzzle/lib';
import 'react-jigsaw-puzzle/lib/jigsaw-puzzle.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface PuzzleComponentProps {
  imageUrl?: string;
  rows?: number;
  columns?: number;
  puzzleSlug?: string; // for leaderboard identification
}

// Minimal, focused component implementing steps 1-5
export function PuzzleComponent({
  imageUrl = 'https://placekitten.com/400/400',
  rows = 4,
  columns = 4,
  puzzleSlug = 'kitten-4x4'
}: PuzzleComponentProps) {
  const { user } = useAuth();

  // Step 3: Timer state
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  // Step 2 + 5: Completion state with persistence
  const storageKey = useMemo(() => `puzzle_completed_${puzzleSlug}`, [puzzleSlug]);
  const [completed, setCompleted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(storageKey) === 'true';
    } catch {
      return false;
    }
  });

  // Force re-mount to reset the puzzle (Step 4)
  const [instanceKey, setInstanceKey] = useState(0);

  // Timer effect
  useEffect(() => {
    if (completed) {
      setRunning(false);
      return; 
    }
    setRunning(true);
  }, [completed, instanceKey]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const reset = () => {
    setSeconds(0);
    setCompleted(false);
    try {
      localStorage.removeItem(storageKey);
    } catch {}
    setInstanceKey((k) => k + 1);
  };

  const handleSolved = async () => {
    setRunning(false);
    setCompleted(true);
    try {
      localStorage.setItem(storageKey, 'true');
    } catch {}

    // Step 2: Completion callback alert
    alert('Puzzle completed!');

    // Step 6: Leaderboard submission (will no-op if table not present)
    try {
      if (!user) {
        console.log('No user logged in, skipping leaderboard insert.');
        return;
      }
      const { error } = await (supabase as any).from('leaderboard').insert({
        user_id: user.id,
        puzzle_slug: puzzleSlug,
        completion_time_seconds: seconds,
        moves: null,
      });
      if (error) {
        console.warn('Leaderboard insert failed (table may not exist yet):', error);
      } else {
        console.log('Leaderboard insert ok');
      }
    } catch (e) {
      console.warn('Leaderboard insert exception:', e);
    }
  };

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60).toString().padStart(2, '0');
    const s = (t % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-4 flex flex-col gap-3">
        {/* Step 3: Simple timer */}
        <div className="flex items-center justify-between">
          <div className="font-mono font-semibold">Time: {formatTime(seconds)}</div>
          {completed && <div className="text-sm">Completed</div>}
        </div>

        {/* Step 1: Basic 4x4 puzzle using react-jigsaw-puzzle */}
        <div className="w-full">
          <JigsawPuzzle
            key={instanceKey}
            imageSrc={imageUrl}
            rows={rows}
            columns={columns}
            onSolved={handleSolved}
          />
        </div>

        {/* Step 4: Reset button */}
        <div className="flex justify-center">
          <Button variant="secondary" onClick={reset}>Reset Puzzle</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default PuzzleComponent;
