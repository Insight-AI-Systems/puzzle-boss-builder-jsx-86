import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, Trophy, Square, AlertCircle, Coins } from 'lucide-react';
import { useGameTimer } from './hooks/useGameTimer';
import { useGameSession } from './hooks/useGameSession';
import { useLeaderboard } from './hooks/useLeaderboard';
import { usePaymentVerification } from './hooks/usePaymentVerification';
import { useGameSounds } from './hooks/useGameSounds';
import { GameConfig, GameHooks, GameResult } from './types/GameTypes';
import { GameCongratulationsScreen } from './components/GameCongratulationsScreen';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface GameStateProps {
  gameState: string;
  startGame: () => void;
  timer: any;
  payment: any;
  session: any;
  onScoreUpdate: (score: number) => void;
  onMoveUpdate: (moves: number) => void;
  onComplete: (stats?: any) => void;
  onError: (error: string) => void;
  isActive: boolean;
}

interface BaseGameWrapperProps {
  config: GameConfig;
  hooks?: GameHooks;
  children: React.ReactNode | ((props: GameStateProps) => React.ReactNode);
  className?: string;
}

export function BaseGameWrapper({ config, hooks, children, className = '' }: BaseGameWrapperProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [gameStats, setGameStats] = useState<any>({});

  // Initialize hooks
  const timer = useGameTimer(config.timeLimit);
  const session = useGameSession(config);
  const leaderboard = useLeaderboard(config.gameType);
  const payment = usePaymentVerification(config.entryFee);
  const sounds = useGameSounds();

  // Error recovery
  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    hooks?.onError?.(errorMessage);
    timer.stop();
    sounds.playError();
    if (session.session?.state === 'playing') {
      session.updateState('completed');
    }
  }, [hooks, timer, session, sounds]);

  // Game state management
  const startGame = useCallback(async () => {
    try {
      setError(null);
      setShowCongratulations(false);
      
      // Verify payment if required
      if (config.requiresPayment && config.gameType) {
        const hasAccess = await payment.verifyPayment(config.gameType, false);
        if (!hasAccess) return;
      }

      // Create or resume session
      if (!session.session) {
        session.createSession();
      }
      
      session.startSession();
      timer.start();
      hooks?.onGameStart?.();
      
      toast({
        title: "Game started!",
        description: "Good luck!",
      });
    } catch (err) {
      handleError(err instanceof Error ? err.message : 'Failed to start game');
    }
  }, [config.requiresPayment, config.gameType, payment, session, timer, hooks, toast, handleError]);

  const resetGame = useCallback(() => {
    timer.reset();
    session.resetSession();
    setError(null);
    setShowCongratulations(false);
    setGameStats({});
    hooks?.onGameReset?.();
  }, [timer, session, hooks]);

  const completeGame = useCallback(async (passedStats?: any) => {
    timer.stop();
    session.endSession();
    
    // Use passed stats if available, otherwise fall back to session data
    const finalStats = passedStats || {
      score: session.session?.score || 0,
      timeElapsed: timer.timeElapsed,
      moves: session.session?.moves || 0,
      completed: true,
      gameType: config.gameType,
      difficulty: config.difficulty || 'normal'
    };

    const result: GameResult = {
      sessionId: session.session?.sessionId || '',
      score: finalStats.score || 0,
      timeElapsed: finalStats.timeElapsed || timer.timeElapsed,
      moves: finalStats.moves || 0,
      completed: true,
      gameType: config.gameType
    };

    // Store stats for congratulations screen - use passed stats directly
    setGameStats(finalStats);

    // Play completion sound and show congratulations
    sounds.playComplete();
    setShowCongratulations(true);

    hooks?.onGameComplete?.(result);

    // Submit to leaderboard
    setIsSubmitting(true);
    try {
      await leaderboard.submitScore(result);
      session.updateState('submitted');
    } catch (err) {
      handleError('Failed to submit score');
    } finally {
      setIsSubmitting(false);
    }
  }, [timer, session, hooks, config.gameType, config.difficulty, leaderboard, handleError, sounds]);

  // Update session with timer - Fixed to prevent infinite loop
  useEffect(() => {
    if (session.session && timer.isRunning && session.session.state === 'playing') {
      // Only update if there's a meaningful time change (every second)
      const currentSeconds = Math.floor(timer.timeElapsed / 1000);
      const sessionSeconds = Math.floor((session.session.timeElapsed || 0) / 1000);
      
      if (currentSeconds !== sessionSeconds) {
        session.updateTime(timer.timeElapsed);
      }
    }
  }, [Math.floor(timer.timeElapsed / 1000), timer.isRunning, session.session?.state]);

  // Handle time limit
  useEffect(() => {
    if (config.timeLimit && timer.timeElapsed >= config.timeLimit * 1000 && timer.isRunning) {
      completeGame();
    }
  }, [timer.timeElapsed, timer.isRunning, config.timeLimit, completeGame]);

  // Score and moves update handlers
  const updateScore = useCallback((score: number) => {
    session.updateScore(score);
    hooks?.onScoreUpdate?.(score);
  }, [session, hooks]);

  const updateMoves = useCallback((moves: number) => {
    session.updateMoves(moves);
    hooks?.onMoveUpdate?.(moves);
  }, [session, hooks]);

  const handlePaymentClick = useCallback(async () => {
    if (config.gameType) {
      await payment.processPayment(config.gameType, false);
    }
  }, [config.gameType, payment]);

  const canPlay = !config.requiresPayment || payment.paymentStatus.hasAccess;
  const gameState = session.session?.state || 'not_started';

  const gameStateProps: GameStateProps = {
    gameState,
    startGame,
    timer,
    payment,
    session: session.session,
    onScoreUpdate: updateScore,
    onMoveUpdate: updateMoves,
    onComplete: completeGame,
    onError: handleError,
    isActive: gameState === 'playing'
  };

  return (
    <div className={`w-full h-full ${className}`}>
      {/* Game Header */}
      <Card className="mb-4 bg-gray-900 border-gray-700">
        <CardHeader className="pb-4">
          <CardTitle className="text-puzzle-white flex items-center gap-2">
            <Trophy className="h-5 w-5 text-puzzle-gold" />
            {config.gameType.charAt(0).toUpperCase() + config.gameType.slice(1)} Game
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {/* Payment Status */}
          {config.requiresPayment && !payment.paymentStatus.hasAccess && (
            <Alert className="mb-4 border-puzzle-gold bg-puzzle-gold/10">
              <Coins className="h-4 w-4" />
              <AlertDescription>
                This game requires {config.entryFee} credits to play. 
                You have {payment.paymentStatus.credits} credits available.
              </AlertDescription>
            </Alert>
          )}

          {/* Error Display */}
          {error && (
            <Alert className="mb-4 border-red-500 bg-red-500/10">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-400">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Game Controls - Simplified without pause functionality */}
          {(gameState === 'completed' || gameState === 'submitted') && !showCongratulations && (
            <div className="flex flex-wrap gap-2 mb-4">
              <Button 
                onClick={resetGame}
                className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black"
              >
                Play Again
              </Button>
            </div>
          )}

          {config.requiresPayment && !payment.paymentStatus.hasAccess && (
            <Button 
              onClick={handlePaymentClick}
              disabled={payment.isVerifying}
              className="bg-puzzle-gold hover:bg-puzzle-gold/80 text-puzzle-black"
            >
              <Coins className="h-4 w-4 mr-2" />
              {payment.isVerifying ? 'Processing...' : 'Pay to Play'}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Game Content */}
      <div className="relative">
        {typeof children === 'function' ? children(gameStateProps) : children}
      </div>

      {/* Spectacular Congratulations Screen */}
      <GameCongratulationsScreen
        show={showCongratulations}
        stats={gameStats}
        onPlayAgain={() => {
          setShowCongratulations(false);
          resetGame();
        }}
        onClose={() => setShowCongratulations(false)}
      />
    </div>
  );
}

export default BaseGameWrapper;
