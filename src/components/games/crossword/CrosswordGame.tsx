
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingGame, GameComplete } from '@/presentation/components/game';
import { useGameContext } from '@/shared/contexts/GameContext';
import { useUserContext } from '@/shared/contexts/UserContext';
import { usePayment } from '@/components/games/hooks/usePayment';
import { useCrosswordEngine } from './hooks/useCrosswordEngine';
import { useGameRepository } from './hooks/useGameRepository';
import { useToast } from '@/hooks/use-toast';
import { CrosswordGrid } from './components/CrosswordGrid';
import { CrosswordClues } from './components/CrosswordClues';
import { CrosswordTimer } from './components/CrosswordTimer';
import { CrosswordControls } from './components/CrosswordControls';

export function CrosswordGame() {
  const { userState } = useUserContext();
  const { toast } = useToast();
  const { gameState, startGame, pauseGame, resumeGame, endGame } = useGameContext();
  
  const entryFee = 2.99;
  const { paymentStatus, isProcessing, processPayment } = usePayment(entryFee);
  
  const { gameState: crosswordState, isLoading: engineLoading, error: engineError, handleCellClick, handleLetterInput, handleToggleDirection, handleTogglePause, handleReset, handleGetHint } = useCrosswordEngine();
  const { saveProgress, loadProgress } = useGameRepository();

  // Handle payment verification
  const handlePayment = async () => {
    if (!userState.user) {
      toast({ title: "Authentication Required", description: "Please log in to play", variant: "destructive" });
      return;
    }
    
    const success = await processPayment(`crossword-${Date.now()}`);
    if (success) {
      startGame('crossword', { entryFee, difficulty: 'medium' });
    }
  };

  // Handle game completion
  const handleComplete = () => {
    endGame({ score: crosswordState.score || 0, completed: true });
    toast({ title: "Congratulations!", description: "Crossword completed!" });
  };

  if (engineLoading) {
    return <LoadingGame message="Loading crossword puzzle..." />;
  }

  if (engineError) {
    return <Alert variant="destructive"><AlertDescription>Failed to load crossword</AlertDescription></Alert>;
  }

  if (entryFee > 0 && !paymentStatus.hasAccess && gameState.status !== 'playing') {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader><CardTitle>Crossword Puzzle</CardTitle></CardHeader>
        <CardContent className="text-center space-y-4">
          <p>Entry fee: ${entryFee.toFixed(2)}</p>
          <button onClick={handlePayment} disabled={isProcessing} className="btn-primary">
            {isProcessing ? 'Processing...' : `Play Now - $${entryFee.toFixed(2)}`}
          </button>
        </CardContent>
      </Card>
    );
  }

  if (gameState.status === 'completed') {
    return (
      <GameComplete
        score={gameState.score}
        timeElapsed={gameState.timeElapsed}
        onPlayAgain={() => startGame('crossword', { entryFee, difficulty: 'medium' })}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <CrosswordGrid
            grid={crosswordState.grid || []}
            onCellClick={handleCellClick}
            onCellInput={handleLetterInput}
          />
        </div>
        
        <div className="space-y-4">
          <CrosswordTimer
            startTime={gameState.startTime || Date.now()}
            isPaused={gameState.status === 'paused'}
            isCompleted={gameState.status === 'completed'}
          />
          
          <CrosswordControls
            isPaused={gameState.status === 'paused'}
            isCompleted={gameState.status === 'completed'}
            hintsUsed={crosswordState.hintsUsed || 0}
            selectedDirection={crosswordState.direction || 'across'}
            onTogglePause={handleTogglePause}
            onReset={handleReset}
            onGetHint={handleGetHint}
            onSave={() => saveProgress(gameState)}
            onToggleDirection={handleToggleDirection}
          />
          
          <CrosswordClues
            clues={crosswordState.clues || { across: [], down: [] }}
            onClueClick={() => {}}
          />
        </div>
      </div>
    </div>
  );
}

export default CrosswordGame;
