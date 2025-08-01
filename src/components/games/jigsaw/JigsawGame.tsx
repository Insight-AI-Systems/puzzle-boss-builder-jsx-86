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

      console.log('🧩 Available files:', files.map(f => f.filename));

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
          console.log(`🧩 Injecting script: ${scriptName}`);
          await injectScript(file.content, scriptName);
          
          // Debug: Check what globals are available after each script
          if (scriptName === 'jquery-3.6.0.min.js') {
            console.log('🧩 jQuery available:', typeof (window as any).$);
          }
          if (scriptName === 'createjs.min.js') {
            console.log('🧩 CreateJS available:', typeof (window as any).createjs);
            console.log('🧩 CreateJS Stage:', typeof (window as any).createjs?.Stage);
          }
          if (scriptName === 'CGame.js') {
            console.log('🧩 CGame available:', typeof (window as any).CGame);
            console.log('🧩 Available window keys containing "game":', Object.keys(window).filter(k => k.toLowerCase().includes('game')));
          }
        } else {
          console.warn(`🧩 Script not found: ${scriptName}`);
        }
      }

      // Load any remaining scripts
      for (const file of files) {
        if (!scriptOrder.includes(file.filename) && file.filename.endsWith('.js')) {
          console.log(`🧩 Injecting additional script: ${file.filename}`);
          await injectScript(file.content, file.filename);
        }
      }

      setScriptsLoaded(true);
      console.log('🧩 All jigsaw puzzle scripts loaded successfully');
      
      // Debug: Final check of available globals
      console.log('🧩 Final globals check:');
      console.log('- jQuery:', typeof (window as any).$);
      console.log('- CreateJS:', typeof (window as any).createjs);
      console.log('- CGame:', typeof (window as any).CGame);
      console.log('- All window keys with "game":', Object.keys(window).filter(k => k.toLowerCase().includes('game')));
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load game';
      console.error('🧩 Error loading jigsaw scripts:', errorMessage);
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to inject script content directly
  const injectScript = (content: string, name: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if (document.querySelector(`script[data-name="${name}"]`)) {
        resolve();
        return;
      }

      try {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.text = content; // Inject content directly
        script.setAttribute('data-name', name);
        
        document.head.appendChild(script);
        console.log(`🧩 Injected script: ${name}`);
        resolve();
      } catch (error) {
        const errorMessage = `Failed to inject script: ${name}`;
        console.error(`🧩 ${errorMessage}`, error);
        reject(new Error(errorMessage));
      }
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
      console.log('🧩 imageUrl:', imageUrl);
      console.log('🧩 pieceCount:', pieceCount);
      console.log('🧩 difficulty:', difficulty);
      
      // Clear the container
      gameContainerRef.current.innerHTML = '';
      
      // Check if the CreateJS game engine is available
      if (typeof window !== 'undefined' && (window as any).createjs) {
        console.log('🧩 CreateJS detected, initializing basic puzzle...');
        
        // Create a canvas element for the game
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        canvas.style.maxWidth = '800px';
        canvas.style.display = 'block';
        canvas.style.margin = '0 auto';
        canvas.style.border = '2px solid #00bcd4';
        gameContainerRef.current.appendChild(canvas);
        
        // Initialize CreateJS stage
        const stage = new (window as any).createjs.Stage(canvas);
        (window as any).createjs.Touch.enable(stage);
        stage.enableMouseOver(10);
        
        // Create a simple puzzle demonstration
        await createSimplePuzzle(stage, canvas, imageUrl || '/placeholder.svg');
        
        const gameInstance = {
          stage,
          canvas,
          reset: () => {
            console.log('🧩 Resetting puzzle...');
            stage.removeAllChildren();
            createSimplePuzzle(stage, canvas, imageUrl || '/placeholder.svg');
          },
          togglePreview: () => {
            console.log('🧩 Toggle preview');
            setShowPreview(!showPreview);
          }
        };
        
        setGameInstance(gameInstance);
        console.log('🧩 Basic jigsaw puzzle initialized successfully');
        
      } else if ((window as any).CGame) {
        console.log('🧩 CGame detected, attempting to use game engine...');
        
        // Try to use the actual CGame if available
        const gameContainer = document.createElement('div');
        gameContainer.style.width = '100%';
        gameContainer.style.height = '600px';
        gameContainer.style.position = 'relative';
        gameContainerRef.current.appendChild(gameContainer);
        
        // Attempt to initialize the actual game
        try {
          const gameInstance = new (window as any).CGame({
            container: gameContainer,
            image: imageUrl || '/placeholder.svg',
            pieces: pieceCount,
            difficulty: difficulty
          });
          
          setGameInstance(gameInstance);
          console.log('🧩 CGame puzzle initialized successfully');
        } catch (cgameError) {
          console.error('🧩 CGame initialization failed:', cgameError);
          // Fallback to basic implementation
          const canvas = document.createElement('canvas');
          canvas.width = 800;
          canvas.height = 600;
          gameContainer.appendChild(canvas);
          
          if ((window as any).createjs) {
            const stage = new (window as any).createjs.Stage(canvas);
            await createSimplePuzzle(stage, canvas, imageUrl || '/placeholder.svg');
            setGameInstance({ stage, canvas, reset: () => {}, togglePreview: () => {} });
          }
        }
        
      } else {
        console.log('🧩 No game engine detected, creating fallback puzzle...');
        
        // Create a fallback HTML-based puzzle
        const puzzleContainer = document.createElement('div');
        puzzleContainer.style.width = '100%';
        puzzleContainer.style.height = '500px';
        puzzleContainer.style.background = '#1a1a1a';
        puzzleContainer.style.borderRadius = '8px';
        puzzleContainer.style.display = 'flex';
        puzzleContainer.style.alignItems = 'center';
        puzzleContainer.style.justifyContent = 'center';
        puzzleContainer.style.position = 'relative';
        puzzleContainer.style.border = '2px solid #00bcd4';
        
        // Add image
        const img = document.createElement('img');
        img.src = imageUrl || '/placeholder.svg';
        img.style.maxWidth = '400px';
        img.style.maxHeight = '400px';
        img.style.objectFit = 'contain';
        img.style.opacity = '0.7';
        
        // Add overlay text
        const overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.top = '50%';
        overlay.style.left = '50%';
        overlay.style.transform = 'translate(-50%, -50%)';
        overlay.style.color = '#00bcd4';
        overlay.style.fontSize = '24px';
        overlay.style.fontWeight = 'bold';
        overlay.style.textAlign = 'center';
        overlay.style.background = 'rgba(0,0,0,0.8)';
        overlay.style.padding = '20px';
        overlay.style.borderRadius = '8px';
        overlay.innerHTML = `
          <div>🧩 ${pieceCount} Piece Puzzle</div>
          <div style="font-size: 16px; margin-top: 10px; opacity: 0.8;">
            Game engine loading...
          </div>
        `;
        
        puzzleContainer.appendChild(img);
        puzzleContainer.appendChild(overlay);
        gameContainerRef.current.appendChild(puzzleContainer);
        
        setGameInstance({
          container: puzzleContainer,
          reset: () => console.log('Reset fallback puzzle'),
          togglePreview: () => {
            img.style.opacity = showPreview ? '0.7' : '1';
            overlay.style.display = showPreview ? 'block' : 'none';
          }
        });
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize game';
      console.error('🧩 Error initializing game:', errorMessage);
      setError(errorMessage);
      onError(errorMessage);
    }
  };

  // Helper function to create a simple puzzle
  const createSimplePuzzle = async (stage: any, canvas: HTMLCanvasElement, imageSrc: string) => {
    try {
      console.log('🧩 Creating simple puzzle with CreateJS...');
      
      // Create background
      const bg = new (window as any).createjs.Shape();
      bg.graphics.beginFill("#1a1a1a").drawRect(0, 0, canvas.width, canvas.height);
      stage.addChild(bg);
      
      // Load and display image
      const bitmap = new (window as any).createjs.Bitmap(imageSrc);
      bitmap.x = 50;
      bitmap.y = 50;
      bitmap.scaleX = 0.5;
      bitmap.scaleY = 0.5;
      
      // Create some simple "puzzle pieces" (rectangles for now)
      const pieceSize = Math.sqrt((canvas.width * canvas.height) / pieceCount);
      const cols = Math.ceil(canvas.width / pieceSize);
      const rows = Math.ceil(canvas.height / pieceSize);
      
      for (let row = 0; row < Math.min(rows, 4); row++) {
        for (let col = 0; col < Math.min(cols, 5); col++) {
          const piece = new (window as any).createjs.Shape();
          piece.graphics.beginFill(`hsl(${(row * cols + col) * 20}, 70%, 50%)`);
          piece.graphics.drawRect(0, 0, pieceSize - 5, pieceSize - 5);
          piece.x = col * pieceSize + 100;
          piece.y = row * pieceSize + 100;
          
          // Make pieces draggable
          piece.on("mousedown", function (evt: any) {
            this.parent.addChild(this);
            this.offset = { x: this.x - evt.stageX, y: this.y - evt.stageY };
          });
          
          piece.on("pressmove", function (evt: any) {
            this.x = evt.stageX + this.offset.x;
            this.y = evt.stageY + this.offset.y;
            stage.update();
          });
          
          stage.addChild(piece);
        }
      }
      
      // Add instruction text
      const text = new (window as any).createjs.Text(
        `${pieceCount} Piece Puzzle - Drag the colored pieces!`, 
        "20px Arial", 
        "#00bcd4"
      );
      text.x = 10;
      text.y = 10;
      stage.addChild(text);
      
      stage.addChild(bitmap);
      stage.update();
      
      console.log('🧩 Simple puzzle created successfully');
      
    } catch (error) {
      console.error('🧩 Error creating simple puzzle:', error);
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