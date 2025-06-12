
import React, { useEffect, useRef, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertTriangle } from 'lucide-react';

interface UnityGameLoaderProps {
  gamePath: string;
  gameTitle?: string;
  onGameReady?: () => void;
  onGameComplete?: (stats: any) => void;
  onScoreUpdate?: (score: number) => void;
  onMoveUpdate?: (moves: number) => void;
  isActive?: boolean;
}

declare global {
  interface Window {
    unityInstance?: any;
    createUnityInstance?: (canvas: HTMLCanvasElement, config: any) => Promise<any>;
  }
}

export const UnityGameLoader: React.FC<UnityGameLoaderProps> = ({
  gamePath,
  gameTitle = 'Unity Game',
  onGameReady,
  onGameComplete,
  onScoreUpdate,
  onMoveUpdate,
  isActive = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unityInstance, setUnityInstance] = useState<any>(null);

  useEffect(() => {
    if (!isActive) return;

    const loadUnityGame = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load Unity build loader script
        const loaderScript = document.createElement('script');
        loaderScript.src = `${gamePath}/Build/build.loader.js`;
        loaderScript.onerror = () => setError('Failed to load Unity loader script');
        loaderScript.onload = () => initializeUnity();
        document.head.appendChild(loaderScript);

        const initializeUnity = async () => {
          if (!canvasRef.current || !window.createUnityInstance) return;

          try {
            // Unity WebGL configuration
            const buildConfig = {
              dataUrl: `${gamePath}/Build/webgl.data`,
              frameworkUrl: `${gamePath}/Build/webgl.framework.js`,
              codeUrl: `${gamePath}/Build/webgl.wasm`,
              streamingAssetsUrl: "StreamingAssets",
              companyName: "PuzzleBoss",
              productName: gameTitle,
              productVersion: "1.0",
            };

            // Initialize Unity instance using the build loader
            const instance = await window.createUnityInstance(canvasRef.current, buildConfig);

            setUnityInstance(instance);
            window.unityInstance = instance;

            // Set up Unity message listeners for game events
            if (instance && instance.SendMessage) {
              // Listen for game events from Unity
              (window as any).unityGameComplete = (stats: string) => {
                try {
                  const gameStats = JSON.parse(stats);
                  onGameComplete?.(gameStats);
                } catch (e) {
                  console.error('Error parsing Unity game stats:', e);
                }
              };

              (window as any).unityScoreUpdate = (score: number) => {
                onScoreUpdate?.(score);
              };

              (window as any).unityMoveUpdate = (moves: number) => {
                onMoveUpdate?.(moves);
              };
            }

            setIsLoading(false);
            onGameReady?.();
            
          } catch (err) {
            console.error('Unity initialization error:', err);
            setError(`Failed to initialize Unity game: ${err instanceof Error ? err.message : 'Unknown error'}`);
            setIsLoading(false);
          }
        };

      } catch (err) {
        console.error('Unity loading error:', err);
        setError(`Failed to load Unity game: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setIsLoading(false);
      }
    };

    loadUnityGame();

    // Cleanup
    return () => {
      if (unityInstance && unityInstance.Quit) {
        unityInstance.Quit();
      }
      window.unityInstance = undefined;
    };
  }, [gamePath, gameTitle, isActive, onGameReady, onGameComplete, onScoreUpdate, onMoveUpdate]);

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p>{error}</p>
            <p className="text-sm">
              Please ensure Unity WebGL files are uploaded to: <code>{gamePath}</code>
            </p>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="text-center text-white">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p>Loading {gameTitle}...</p>
          </div>
        </div>
      )}
      
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: '#000000' }}
      />
    </div>
  );
};
