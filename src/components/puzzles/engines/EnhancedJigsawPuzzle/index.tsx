
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usePuzzleState } from './hooks/usePuzzleState';
import { useTimer } from '@/hooks/useTimer';
import { usePuzzleSaveState } from './hooks/usePuzzleSaveState';
import PuzzleBoard from './components/PuzzleBoard';
import PuzzleControls from './components/PuzzleControls';
import StagingArea from './components/StagingArea';
import GameCompletionOverlay from './components/GameCompletionOverlay';
import FirstMoveOverlay from './components/FirstMoveOverlay';
import ResumeGameDialog from './components/ResumeGameDialog';
import LoadingOverlay from './components/LoadingOverlay';
import { formatTime } from './utils/timeUtils';
import './styles/jigsaw-puzzle.css';

export interface EnhancedJigsawPuzzleProps {
  imageUrl: string;
  rows?: number;
  columns?: number;
  puzzleId?: string;
  userId?: string;
  showNumbers?: boolean;
  showGuide?: boolean;
  isPremium?: boolean;
  onComplete?: (stats: { moves: number, time: number }) => void;
}

const EnhancedJigsawPuzzle: React.FC<EnhancedJigsawPuzzleProps> = ({
  imageUrl,
  rows = 3,
  columns = 3,
  puzzleId = 'demo-puzzle',
  userId,
  showNumbers = false,
  showGuide: initialShowGuide = true,
  isPremium = false,
  onComplete
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [showGuide, setShowGuide] = useState(initialShowGuide);
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const { toast } = useToast();
  const imageRef = useRef<HTMLImageElement>(null);

  // Set up puzzle state
  const {
    pieces,
    boardPieces,
    stagingPieces,
    isComplete,
    resetPuzzle,
    placePiece,
    removePiece,
    moves,
    checkCompletion,
    loadSavedState
  } = usePuzzleState(rows, columns, imageUrl, puzzleId);

  // Set up timer
  const {
    elapsed,
    isRunning,
    start: startTimer,
    stop: stopTimer,
    reset: resetTimer,
    setElapsed
  } = useTimer();

  // Set up save/resume functionality
  const { hasSavedState, saveState, loadState, clearSavedState } = 
    usePuzzleSaveState(puzzleId, userId);

  // Check for saved game on component mount
  useEffect(() => {
    if (hasSavedState && userId) {
      setShowResumeDialog(true);
    }
  }, [hasSavedState, userId]);

  // Handle image loading
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

  // Handle first move to start the game
  const handleFirstMove = useCallback(() => {
    if (!hasStarted) {
      setHasStarted(true);
      startTimer();
      
      // Track game start
      try {
        // Optional: Track analytics event
        console.log('Game started', { puzzleId, userId, timestamp: new Date().toISOString() });
      } catch (error) {
        console.error('Failed to track game start:', error);
      }
    }
  }, [hasStarted, puzzleId, startTimer, userId]);

  // Handle puzzle completion
  useEffect(() => {
    if (isComplete && hasStarted) {
      stopTimer();
      clearSavedState();
      
      // Save completion stats
      if (userId && puzzleId) {
        // We'd save to Supabase here in a real implementation
        console.log('Saving completion stats:', { 
          userId, 
          puzzleId, 
          moves, 
          time: elapsed 
        });
      }
      
      if (onComplete) {
        onComplete({ moves, time: elapsed });
      }
      
      toast({
        title: '🎉 Puzzle Completed!',
        description: `You completed the puzzle in ${formatTime(elapsed)} with ${moves} moves.`,
      });
    }
  }, [isComplete, hasStarted, elapsed, moves, userId, puzzleId, stopTimer, toast, clearSavedState, onComplete]);

  // Auto-save progress periodically
  useEffect(() => {
    if (!hasStarted || isComplete || !userId) return;
    
    const saveInterval = setInterval(() => {
      if (pieces.length > 0) {
        saveState({
          pieces,
          moves,
          elapsed,
          showGuide
        });
      }
    }, 10000); // Save every 10 seconds
    
    return () => clearInterval(saveInterval);
  }, [pieces, moves, elapsed, showGuide, hasStarted, isComplete, userId, saveState]);

  // Handle resume game
  const handleResume = useCallback(() => {
    const savedData = loadState();
    if (savedData) {
      loadSavedState(savedData);
      setElapsed(savedData.elapsed || 0);
      setShowGuide(savedData.showGuide !== undefined ? savedData.showGuide : initialShowGuide);
      setHasStarted(true);
      startTimer();
      toast({
        title: 'Game Resumed',
        description: 'Your progress has been restored',
      });
    }
    setShowResumeDialog(false);
  }, [loadState, loadSavedState, setElapsed, startTimer, toast, initialShowGuide]);

  // Handle new game
  const handleNewGame = useCallback(() => {
    resetPuzzle();
    resetTimer();
    setHasStarted(false);
    clearSavedState();
    setShowResumeDialog(false);
  }, [resetPuzzle, resetTimer, clearSavedState]);

  // Toggle guide visibility
  const toggleGuide = useCallback(() => {
    setShowGuide(prev => !prev);
  }, []);

  return (
    <div className="enhanced-jigsaw-puzzle w-full max-w-5xl mx-auto my-4">
      {/* Resume dialog */}
      <ResumeGameDialog 
        open={showResumeDialog}
        onResume={handleResume}
        onNewGame={handleNewGame}
      />
      
      {/* Controls section */}
      <PuzzleControls
        moves={moves}
        elapsed={elapsed}
        isComplete={isComplete}
        showGuide={showGuide}
        toggleGuide={toggleGuide}
        onResetGame={handleNewGame}
        isPremium={isPremium}
      />
      
      <div className="relative mt-4 mb-6">
        {/* Loading overlay */}
        {isLoading && <LoadingOverlay />}
        
        {/* First move overlay */}
        {!isLoading && !hasStarted && !isComplete && (
          <FirstMoveOverlay onFirstMove={handleFirstMove} />
        )}
        
        {/* Main puzzle board */}
        <PuzzleBoard
          imageUrl={imageUrl}
          rows={rows}
          columns={columns}
          boardPieces={boardPieces}
          showGuide={showGuide}
          showNumbers={showNumbers}
          isComplete={isComplete}
          onPlacePiece={(pieceId, position) => {
            handleFirstMove();
            placePiece(pieceId, position);
            checkCompletion();
          }}
          onRemovePiece={removePiece}
          snapThreshold={20}
        />
        
        {/* Staging area */}
        {!isLoading && !isComplete && stagingPieces.length > 0 && (
          <StagingArea
            pieces={stagingPieces}
            imageUrl={imageUrl}
            rows={rows}
            columns={columns}
            showNumbers={showNumbers}
            onPlacePiece={(pieceId, position) => {
              handleFirstMove();
              placePiece(pieceId, position);
              checkCompletion();
            }}
          />
        )}
        
        {/* Completion overlay */}
        {isComplete && (
          <GameCompletionOverlay
            moves={moves}
            time={elapsed}
            onPlayAgain={handleNewGame}
          />
        )}
      </div>
    </div>
  );
};

export default EnhancedJigsawPuzzle;
