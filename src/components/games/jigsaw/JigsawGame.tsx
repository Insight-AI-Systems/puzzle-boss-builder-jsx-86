import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Puzzle, RotateCcw, Eye } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

interface JigsawGameProps {
  difficulty: 'easy' | 'medium' | 'hard';
  pieceCount: 20 | 100 | 500;
  imageUrl?: string;
  gameState: string;
  isActive: boolean;
  onComplete: (stats: any) => void;
  onScoreUpdate: (score: number) => void;
  onMoveUpdate: (moves: number) => void;
  onError: (error: string) => void;
}

export function JigsawGame({
  difficulty,
  pieceCount,
  imageUrl,
  gameState,
  isActive,
  onComplete,
  onScoreUpdate,
  onMoveUpdate,
  onError
}: JigsawGameProps) {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [gameInstance, setGameInstance] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [moves, setMoves] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  // Load JavaScript files for the jigsaw game
  const loadGameScripts = async () => {
    if (scriptsLoaded) return;
    
    setIsLoading(true);
    setError(null);

    try {
      console.log('🧩 Loading jigsaw puzzle scripts...');
      
      // Get the list of required JavaScript files
      const { data: files, error: filesError } = await supabase.functions.invoke('admin-puzzle-files', {
        method: 'GET'
      });

      if (filesError) {
        throw new Error(`Failed to load game files: ${filesError.message}`);
      }

      if (!files || !Array.isArray(files)) {
        throw new Error('No game files found');
      }

      // Load scripts from database files in order of dependency
      const scriptOrder = [
        'jquery-3.6.0.min.js',
        'createjs.min.js', 
        'howler.min.js',
        'platform.js',
        'CGame.js'
      ];

      for (const scriptName of scriptOrder) {
        const file = files.find(f => f.filename === scriptName);
        if (file) {
          const scriptUrl = `${window.location.origin}/functions/v1/admin-puzzle-files/file/${file.filename}`;
          await loadScript(scriptUrl, scriptName);
        } else {
          console.warn(`🧩 Script not found: ${scriptName}`);
        }
      }

      // Load any remaining scripts
      for (const file of files) {
        if (!scriptOrder.includes(file.filename) && file.filename.endsWith('.js')) {
          const scriptUrl = `${window.location.origin}/functions/v1/admin-puzzle-files/file/${file.filename}`;
          await loadScript(scriptUrl, file.filename);
        }
      }

      setScriptsLoaded(true);
      console.log('🧩 All jigsaw puzzle scripts loaded successfully');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load game';
      console.error('🧩 Error loading jigsaw scripts:', errorMessage);
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to load individual scripts
  const loadScript = (url: string, name: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if (document.querySelector(`script[data-name="${name}"]`)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = url;
      script.async = false; // Ensure scripts load in order
      script.setAttribute('data-name', name);
      
      script.onload = () => {
        console.log(`🧩 Loaded script: ${name}`);
        resolve();
      };
      
      script.onerror = () => {
        const error = `Failed to load script: ${name}`;
        console.error(`🧩 ${error}`);
        reject(new Error(error));
      };
      
      document.head.appendChild(script);
    });
  };

  // Initialize the game once scripts are loaded
  useEffect(() => {
    if (scriptsLoaded && gameContainerRef.current && !gameInstance && isActive) {
      initializeGame();
    }
  }, [scriptsLoaded, isActive, gameInstance]);

  const initializeGame = async () => {
    if (!gameContainerRef.current) return;

    try {
      console.log('🧩 Initializing jigsaw puzzle game...');
      
      // Clear the container
      gameContainerRef.current.innerHTML = '';
      
      // Check if the CreateJS game engine is available
      if (typeof window !== 'undefined' && (window as any).createjs && (window as any).CGame) {
        console.log('🧩 CreateJS and game engine detected, initializing...');
        
        // Create a canvas element for the game
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        canvas.style.maxWidth = '800px';
        canvas.style.display = 'block';
        canvas.style.margin = '0 auto';
        gameContainerRef.current.appendChild(canvas);
        
        // Initialize CreateJS stage
        const stage = new (window as any).createjs.Stage(canvas);
        (window as any).createjs.Touch.enable(stage);
        stage.enableMouseOver(10);
        
        // Store stage reference for game controls
        const gameConfig = {
          stage,
          canvas,
          difficulty,
          pieceCount,
          imageUrl: imageUrl || '/placeholder.svg',
          onMove: (moveCount: number) => {
            setMoves(moveCount);
            onMoveUpdate(moveCount);
          },
          onComplete: (gameStats: any) => {
            const finalStats = {
              score: Math.max(0, 1000 - moves * 2),
              moves,
              time: gameStats.time || 0,
              difficulty
            };
            onComplete(finalStats);
          }
        };
        
        // Try to initialize the game (the actual game initialization will depend on the CGame structure)
        try {
          // This is a placeholder - actual game initialization depends on how CGame is structured
          const gameInstance = {
            stage,
            canvas,
            config: gameConfig,
            reset: () => {
              console.log('🧩 Game reset');
              // Game reset logic will be implemented based on actual game structure
            },
            togglePreview: () => {
              console.log('🧩 Toggle preview');
              // Preview toggle logic will be implemented based on actual game structure
            }
          };
          
          setGameInstance(gameInstance);
          console.log('🧩 Jigsaw puzzle game initialized successfully');
        } catch (gameError) {
          console.error('🧩 Error initializing game instance:', gameError);
          throw gameError;
        }
        
      } else {
        const availableGlobals = Object.keys(window).filter(key => 
          key.toLowerCase().includes('game') || 
          key.toLowerCase().includes('createjs') ||
          key.toLowerCase().includes('puzzle')
        );
        console.log('🧩 Available game-related globals:', availableGlobals);
        throw new Error('Game engine not found. Available globals: ' + availableGlobals.join(', '));
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize game';
      console.error('🧩 Error initializing game:', errorMessage);
      setError(errorMessage);
      onError(errorMessage);
    }
  };

  // Start loading scripts when component mounts
  useEffect(() => {
    loadGameScripts();
  }, []);

  // Handle game reset
  const handleReset = () => {
    if (gameInstance && gameInstance.reset) {
      gameInstance.reset();
      setMoves(0);
      onMoveUpdate(0);
    }
  };

  // Handle preview toggle
  const togglePreview = () => {
    setShowPreview(!showPreview);
    if (gameInstance && gameInstance.togglePreview) {
      gameInstance.togglePreview();
    }
  };

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
          <Button 
            onClick={loadGameScripts} 
            className="mt-4"
            disabled={isLoading}
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {/* Game Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Puzzle className="h-5 w-5 text-puzzle-aqua" />
            <h3 className="text-lg font-semibold text-puzzle-white">Jigsaw Puzzle</h3>
            <Badge variant="outline">
              {pieceCount} pieces
            </Badge>
            <Badge variant="secondary">
              {difficulty}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-puzzle-white/70">
              Moves: {moves}
            </span>
          </div>
        </div>

        {/* Game Controls */}
        {scriptsLoaded && !isLoading && (
          <div className="flex gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={!gameInstance}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={togglePreview}
              disabled={!gameInstance}
            >
              <Eye className="h-4 w-4 mr-1" />
              {showPreview ? 'Hide' : 'Show'} Preview
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-puzzle-aqua mx-auto mb-2"></div>
              <p className="text-puzzle-white/70">Loading puzzle game...</p>
            </div>
          </div>
        )}

        {/* Game Container */}
        <div 
          ref={gameContainerRef}
          className="w-full min-h-[500px] bg-puzzle-black/50 rounded-lg border border-puzzle-border"
          style={{ 
            opacity: isLoading ? 0.5 : 1,
            transition: 'opacity 0.3s ease'
          }}
        />

        {/* Instructions */}
        {!isLoading && scriptsLoaded && (
          <div className="mt-4 text-sm text-puzzle-white/70">
            <p>Drag and drop puzzle pieces to complete the image. Use the preview button to see the target image.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default JigsawGame;