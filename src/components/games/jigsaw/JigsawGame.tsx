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
  console.log('🧩 JigsawGame component loaded with props:', {
    difficulty,
    pieceCount,
    imageUrl,
    isActive,
    gameState
  });
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
      
      // Check if CGame engine is available (our uploaded JS engine)
      if (typeof window !== 'undefined' && (window as any).CGame) {
        console.log('🧩 CGame engine detected, initializing professional puzzle...');
        
        // Create the game container
        const gameContainer = document.createElement('div');
        gameContainer.id = 'puzzle-game-container';
        gameContainer.style.width = '100%';
        gameContainer.style.height = '600px';
        gameContainer.style.position = 'relative';
        gameContainer.style.backgroundColor = '#1a1a2e';
        gameContainer.style.borderRadius = '8px';
        gameContainer.style.overflow = 'hidden';
        gameContainerRef.current.appendChild(gameContainer);
        
        try {
          // Initialize the professional puzzle engine
          console.log('🧩 Creating CGame instance with:', {
            container: gameContainer,
            image: imageUrl || '/placeholder.svg',
            pieces: pieceCount,
            difficulty: difficulty
          });
          
          const gameInstance = new (window as any).CGame({
            container: gameContainer,
            image: imageUrl || '/placeholder.svg',
            pieces: pieceCount,
            difficulty: difficulty,
            onComplete: (stats: any) => {
              console.log('🎉 Puzzle completed!', stats);
              onComplete({
                ...stats,
                moves: moves,
                time: Date.now() - (stats.startTime || Date.now()),
                score: calculateScore(stats)
              });
            },
            onPieceMove: () => {
              const newMoves = moves + 1;
              setMoves(newMoves);
              onMoveUpdate(newMoves);
            }
          });
          
          setGameInstance(gameInstance);
          console.log('🧩 Professional puzzle engine initialized successfully');
          
        } catch (cgameError) {
          console.error('🧩 CGame initialization failed:', cgameError);
          throw cgameError;
        }
        
      } else if (typeof window !== 'undefined' && (window as any).createjs) {
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
        canvas.style.borderRadius = '8px';
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
            setMoves(0);
            onMoveUpdate(0);
          },
          togglePreview: () => {
            console.log('🧩 Toggle preview');
            setShowPreview(!showPreview);
          }
        };
        
        setGameInstance(gameInstance);
        console.log('🧩 Basic CreateJS puzzle initialized successfully');
        
      } else {
        console.log('🧩 No game engine detected, creating HTML fallback...');
        
        // Create a fallback HTML-based puzzle
        const puzzleContainer = document.createElement('div');
        puzzleContainer.style.width = '100%';
        puzzleContainer.style.height = '600px';
        puzzleContainer.style.backgroundColor = '#1a1a2e';
        puzzleContainer.style.borderRadius = '8px';
        puzzleContainer.style.display = 'flex';
        puzzleContainer.style.flexDirection = 'column';
        puzzleContainer.style.alignItems = 'center';
        puzzleContainer.style.justifyContent = 'center';
        puzzleContainer.style.color = '#00bcd4';
        puzzleContainer.style.fontSize = '18px';
        puzzleContainer.style.textAlign = 'center';
        
        // Show image if available
        if (imageUrl) {
          const img = document.createElement('img');
          img.src = imageUrl;
          img.style.maxWidth = '300px';
          img.style.maxHeight = '300px';
          img.style.borderRadius = '8px';
          img.style.marginBottom = '20px';
          puzzleContainer.appendChild(img);
        }
        
        const message = document.createElement('div');
        message.innerHTML = `
          <h3>Jigsaw Puzzle: ${pieceCount} pieces</h3>
          <p>Difficulty: ${difficulty}</p>
          <p style="margin-top: 20px; color: #ffa726;">JavaScript puzzle engine is loading...</p>
          <p style="color: #666; font-size: 14px;">Please wait while the puzzle engine initializes.</p>
        `;
        puzzleContainer.appendChild(message);
        
        gameContainerRef.current.appendChild(puzzleContainer);
        
        const gameInstance = {
          reset: () => console.log('🧩 Reset fallback puzzle'),
          togglePreview: () => setShowPreview(!showPreview)
        };
        
        setGameInstance(gameInstance);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize game';
      console.error('🧩 Error initializing game:', errorMessage);
      setError(errorMessage);
      onError(errorMessage);
    }
  };

  // Helper function to calculate score based on game stats
  const calculateScore = (stats: any) => {
    const baseScore = 1000;
    const timePenalty = Math.floor((stats.timeElapsed || 0) / 1000) * 2;
    const movePenalty = moves * 5;
    return Math.max(100, baseScore - timePenalty - movePenalty);
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