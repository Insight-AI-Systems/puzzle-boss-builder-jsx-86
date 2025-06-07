
import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, Trophy, Play, Pause, Square, AlertCircle, Coins } from 'lucide-react';
import { useGameTimer } from './hooks/useGameTimer';
import { useGameSession } from './hooks/useGameSession';
import { useLeaderboard } from './hooks/useLeaderboard';
import { usePaymentVerification } from './hooks/usePaymentVerification';
import { GameConfig, GameHooks, GameResult } from './types/GameTypes';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface BaseGameWrapperProps {
  config: GameConfig;
  hooks?: GameHooks;
  children: React.ReactNode;
  className?: string;
}

export function BaseGameWrapper({ config, hooks, children, className = '' }: BaseGameWrapperProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize hooks
  const timer = useGameTimer(config.timeLimit);
  const session = useGameSession(config);
  const leaderboard = useLeaderboard(config.gameType);
  const payment = usePaymentVerification(config.entryFee);

  // Error recovery
  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    hooks?.onError?.(errorMessage);
    timer.pause();
    if (session.session?.state === 'playing') {
      session.updateState('paused');
    }
  }, [hooks, timer, session]);

  // Game state management
  const startGame = useCallback(async () => {
    try {
      setError(null);
      
      // Verify payment if required
      if (config.requiresPayment) {
        const hasAccess = await payment.verifyPayment();
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
  }, [config.requiresPayment, payment, session, timer, hooks, toast, handleError]);

  const pauseGame = useCallback(() => {
    timer.pause();
    session.updateState('paused');
    hooks?.onGamePause?.();
  }, [timer, session, hooks]);

  const resumeGame = useCallback(() => {
    timer.resume();
    session.updateState('playing');
    hooks?.onGameResume?.();
  }, [timer, session, hooks]);

  const completeGame = useCallback(async () => {
    timer.stop();
    session.endSession();
    
    const result: GameResult = {
      sessionId: session.session?.sessionId || '',
      score: session.session?.score || 0,
      timeElapsed: timer.timeElapsed,
      moves: session.session?.moves || 0,
      completed: true,
      gameType: config.gameType
    };

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
  }, [timer, session, hooks, config.gameType, leaderboard, handleError]);

  // Update session with timer
  useEffect(() => {
    if (session.session && timer.isRunning) {
      session.updateTime(timer.timeElapsed);
    }
  }, [timer.timeElapsed, timer.isRunning, session]);

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

  const canPlay = !config.requiresPayment || payment.paymentStatus.hasAccess;
  const gameState = session.session?.state || 'not_started';

  return (
    <div className={`w-full h-full ${className}`}>
      {/* Game Header */}
      <Card className="mb-4 bg-gray-900 border-gray-700">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-puzzle-white flex items-center gap-2">
              <Trophy className="h-5 w-5 text-puzzle-gold" />
              {config.gameType.charAt(0).toUpperCase() + config.gameType.slice(1)} Game
            </CardTitle>
            
            <div className="flex flex-wrap items-center gap-3">
              {config.hasTimer && (
                <Badge variant="outline" className="text-puzzle-aqua border-puzzle-aqua">
                  <Clock className="h-3 w-3 mr-1" />
                  {timer.formattedTime}
                </Badge>
              )}
              
              {config.hasScore && session.session && (
                <Badge variant="outline" className="text-puzzle-gold border-puzzle-gold">
                  Score: {session.session.score.toLocaleString()}
                </Badge>
              )}
              
              {config.hasMoves && session.session && (
                <Badge variant="outline" className="text-puzzle-white border-gray-400">
                  Moves: {session.session.moves}
                </Badge>
              )}
              
              {config.requiresPayment && (
                <Badge variant="outline" className="text-puzzle-aqua border-puzzle-aqua">
                  <Coins className="h-3 w-3 mr-1" />
                  {config.entryFee} credits
                </Badge>
              )}
            </div>
          </div>
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

          {/* Game Controls */}
          <div className="flex flex-wrap gap-2">
            {gameState === 'not_started' && (
              <Button 
                onClick={startGame}
                disabled={!canPlay || !user}
                className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Game
              </Button>
            )}
            
            {gameState === 'playing' && (
              <Button 
                onClick={pauseGame}
                variant="outline"
                className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua hover:text-puzzle-black"
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            )}
            
            {gameState === 'paused' && (
              <>
                <Button 
                  onClick={resumeGame}
                  className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Resume
                </Button>
                <Button 
                  onClick={() => {
                    session.resetSession();
                    timer.reset();
                  }}
                  variant="outline"
                  className="border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-gray-900"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </>
            )}
            
            {(gameState === 'completed' || gameState === 'submitted') && (
              <Button 
                onClick={() => {
                  session.resetSession();
                  timer.reset();
                }}
                className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black"
              >
                Play Again
              </Button>
            )}

            {config.requiresPayment && !payment.paymentStatus.hasAccess && (
              <Button 
                onClick={payment.processPayment}
                disabled={payment.isVerifying}
                className="bg-puzzle-gold hover:bg-puzzle-gold/80 text-puzzle-black"
              >
                <Coins className="h-4 w-4 mr-2" />
                {payment.isVerifying ? 'Processing...' : 'Pay to Play'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Game Content */}
      <div className="relative">
        {React.cloneElement(children as React.ReactElement, {
          gameState,
          onScoreUpdate: updateScore,
          onMoveUpdate: updateMoves,
          onComplete: completeGame,
          onError: handleError,
          isActive: gameState === 'playing',
          session: session.session
        })}
        
        {/* Game Overlay for non-playing states */}
        {gameState !== 'playing' && gameState !== 'not_started' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <Card className="bg-gray-900 border-gray-700 text-center">
              <CardContent className="p-6">
                {gameState === 'paused' && (
                  <>
                    <h3 className="text-xl font-bold text-puzzle-white mb-2">Game Paused</h3>
                    <p className="text-gray-400 mb-4">Click Resume to continue playing</p>
                  </>
                )}
                {gameState === 'completed' && (
                  <>
                    <h3 className="text-xl font-bold text-puzzle-gold mb-2">Game Complete!</h3>
                    <p className="text-gray-400 mb-4">
                      {isSubmitting ? 'Submitting your score...' : 'Your score has been submitted to the leaderboard'}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default BaseGameWrapper;
