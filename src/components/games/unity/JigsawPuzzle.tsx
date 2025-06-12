
import React, { useEffect, useRef, useState } from 'react';
import { UnityGameLoader } from './UnityGameLoader';
import { PaymentGate } from '@/components/payments/PaymentGate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Puzzle, AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// TypeScript declarations for Unity callback functions
declare global {
  interface Window {
    onPuzzleComplete?: (data: string) => void;
    onPuzzleProgress?: (progress: number) => void;
    onHintUsed?: () => void;
  }
}

interface JigsawPuzzleProps {
  puzzleId: string;
  puzzlePrice?: number;
  isPaid?: boolean;
  onComplete?: (data: any) => void;
  onPaymentRequired?: (data: any) => void;
}

const JigsawPuzzle: React.FC<JigsawPuzzleProps> = ({
  puzzleId,
  puzzlePrice = 0,
  isPaid = false,
  onComplete,
  onPaymentRequired
}) => {
  const [hasAccess, setHasAccess] = useState(isPaid);
  const [gameReady, setGameReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState('Initializing...');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  console.log('JigsawPuzzle component initialized', { puzzleId, isPaid, hasAccess });

  const handlePaymentSuccess = (transactionId?: string) => {
    console.log('Payment successful for puzzle:', puzzleId, 'Transaction:', transactionId);
    setHasAccess(true);
    setError(null);
  };

  const handlePaymentError = (errorMessage: string) => {
    console.error('Payment error:', errorMessage);
    setError(`Payment failed: ${errorMessage}`);
    onPaymentRequired?.({ puzzleId, price: puzzlePrice, error: errorMessage });
  };

  const handleGameReady = () => {
    console.log('Unity game is ready');
    setGameReady(true);
    setError(null);
    setLoadingStatus('Game loaded successfully!');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleGameComplete = (stats: any) => {
    console.log('Puzzle completed with stats:', stats);
    onComplete?.(stats);
  };

  const handleGameError = (errorMessage: string) => {
    console.error('Unity game error:', errorMessage);
    setError(errorMessage);
    setLoadingStatus('Failed to load');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleScoreUpdate = (score: number) => {
    console.log('Score updated:', score);
  };

  const handleMoveUpdate = (moves: number) => {
    console.log('Moves updated:', moves);
  };

  const resetGame = () => {
    setError(null);
    setGameReady(false);
    setLoadingProgress(0);
    setLoadingStatus('Reinitializing...');
    // Force component remount by changing key
    window.location.reload();
  };

  // Set up Unity callback functions
  useEffect(() => {
    if (hasAccess) {
      // Set up loading timeout
      timeoutRef.current = setTimeout(() => {
        if (!gameReady) {
          setError('Game loading timed out. Please try again.');
          setLoadingStatus('Loading timeout');
        }
      }, 30000); // 30 second timeout

      window.onPuzzleComplete = (data: string) => {
        try {
          const completionData = JSON.parse(data);
          handleGameComplete(completionData);
        } catch (e) {
          console.error('Error parsing completion data:', e);
          handleGameComplete({ completed: true, data });
        }
      };

      window.onPuzzleProgress = (progress: number) => {
        console.log('Puzzle progress:', progress);
        setLoadingProgress(progress);
        if (progress < 50) {
          setLoadingStatus('Loading assets...');
        } else if (progress < 90) {
          setLoadingStatus('Preparing game...');
        } else {
          setLoadingStatus('Almost ready...');
        }
      };

      window.onHintUsed = () => {
        console.log('Hint used in puzzle');
      };

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        delete window.onPuzzleComplete;
        delete window.onPuzzleProgress;
        delete window.onHintUsed;
      };
    }
  }, [hasAccess, gameReady]);

  if (!hasAccess) {
    return (
      <PaymentGate
        gameId={puzzleId}
        gameName={`Unity Jigsaw Puzzle - ${puzzleId}`}
        entryFee={puzzlePrice}
        testMode={true}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
      />
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Puzzle Loading Error
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertDescription>
              <div className="space-y-2">
                <p><strong>Failed to load puzzle game:</strong> {error}</p>
                <p className="text-sm">
                  The Unity build files might be corrupted or incompatible. 
                  Please check that all Unity WebGL files are properly uploaded to: 
                  <code className="ml-1">/unity-games/jigsaw-puzzle/Build/</code>
                </p>
                <p className="text-sm">
                  Required files:
                </p>
                <ul className="text-xs ml-4 list-disc">
                  <li>build.loader.js</li>
                  <li>webgl.data</li>
                  <li>webgl.framework.js</li>
                  <li>webgl.wasm</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
          
          <Button onClick={resetGame} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Puzzle className="h-5 w-5 text-blue-400" />
            Unity Jigsaw Puzzle - {puzzleId}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
            <UnityGameLoader
              gamePath="/unity-games/jigsaw-puzzle"
              gameTitle={`Unity Jigsaw Puzzle ${puzzleId}`}
              onGameReady={handleGameReady}
              onGameComplete={handleGameComplete}
              onScoreUpdate={handleScoreUpdate}
              onMoveUpdate={handleMoveUpdate}
              isActive={hasAccess}
            />
          </div>
          
          {!gameReady && (
            <div className="mt-4 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Puzzle className="h-4 w-4 text-blue-400" />
                <p className="text-blue-400 text-sm">Loading Your Puzzle...</p>
              </div>
              <div className="space-y-2">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400">{loadingStatus}</p>
                <p className="text-xs text-gray-500">
                  Please wait while we prepare your jigsaw puzzle experience...
                </p>
              </div>
            </div>
          )}

          {gameReady && (
            <div className="mt-4 p-4 bg-green-900/20 border border-green-700 rounded-lg">
              <p className="text-green-400 text-sm flex items-center gap-2">
                <Puzzle className="h-4 w-4" />
                Game loaded successfully! You can now start playing.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JigsawPuzzle;
