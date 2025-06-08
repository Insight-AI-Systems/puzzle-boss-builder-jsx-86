import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingGame, GameComplete } from '@/presentation/components/game';
import { useGameContext } from '@/shared/contexts/GameContext';
import { usePayment } from '@/components/games/hooks/usePayment';
import { useCrosswordEngine } from './hooks/useCrosswordEngine';
import { useGameRepository } from './hooks/useGameRepository';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { CrosswordGrid } from './components/CrosswordGrid';
import { CrosswordClues } from './components/CrosswordClues';
import { CrosswordTimer } from './components/CrosswordTimer';
import { CrosswordControls } from './components/CrosswordControls';

export function CrosswordGameRefactored() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { gameState, startGame, pauseGame, resumeGame, endGame } = useGameContext();
  
  const entryFee = 2.99;
  const { paymentStatus, isProcessing, processPayment } = usePayment(entryFee);
  
  const { engine, isLoading: engineLoading, error: engineError } = useCrosswordEngine();
  const { saveProgress, loadProgress } = useGameRepository();

  // Handle payment verification
  const handlePayment = async () => {
    if (!user) {
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
    endGame({ score: engine?.getScore() || 0, completed: true });
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
            grid={engine?.getGrid() || []}
            selectedCell={engine?.getSelectedCell()}
            onCellClick={(row, col) => engine?.selectCell(row, col)}
            onCellInput={(value) => engine?.inputLetter(value)}
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
            hintsUsed={engine?.getHintsUsed() || 0}
            selectedDirection={engine?.getDirection() || 'across'}
            onTogglePause={() => gameState.status === 'paused' ? resumeGame() : pauseGame()}
            onReset={() => startGame('crossword', { entryFee, difficulty: 'medium' })}
            onGetHint={() => engine?.useHint()}
            onSave={() => saveProgress(gameState)}
            onToggleDirection={() => engine?.toggleDirection()}
          />
          
          <CrosswordClues
            clues={engine?.getClues() || { across: [], down: [] }}
            selectedClue={engine?.getSelectedClue()}
            onClueClick={(clue) => engine?.selectClue(clue)}
          />
        </div>
      </div>
    </div>
  );
}

export default CrosswordGameRefactored;
