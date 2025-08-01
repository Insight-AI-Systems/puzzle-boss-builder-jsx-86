import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, RotateCcw, Lightbulb, Pause, Timer, Hash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatTime } from '@/utils/puzzleUtils';

const PuzzleGameEngine = ({ 
  imageUrl, 
  difficulty = 'medium', 
  onComplete,
  sessionId 
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const puzzleCoreRef = useRef(null);
  const pieceDetectionRef = useRef(null);
  const scoringEngineRef = useRef(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [gameState, setGameState] = useState('not_started'); // not_started, playing, paused, completed
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [moves, setMoves] = useState(0);
  const [hints, setHints] = useState(0);
  const [pieces, setPieces] = useState([]);
  
  const { toast } = useToast();

  // Load puzzle engine scripts
  useEffect(() => {
    const loadScripts = async () => {
      try {
        const scripts = [
          '/games/puzzle-engine/puzzle-core.js',
          '/games/puzzle-engine/piece-detection.js',
          '/games/puzzle-engine/collision-detection.js',
          '/games/puzzle-engine/scoring-engine.js'
        ];

        // Load scripts sequentially
        for (const script of scripts) {
          await new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${script}"]`)) {
              resolve();
              return;
            }
            
            const scriptEl = document.createElement('script');
            scriptEl.src = script;
            scriptEl.onload = resolve;
            scriptEl.onerror = reject;
            document.head.appendChild(scriptEl);
          });
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load puzzle engine:', error);
        toast({
          title: 'Error',
          description: 'Failed to load puzzle engine',
          variant: 'destructive'
        });
      }
    };

    loadScripts();
  }, [toast]);

  // Initialize puzzle when scripts are loaded
  useEffect(() => {
    if (isLoading || !window.PuzzleCore || !canvasRef.current) return;

    const initializePuzzle = async () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Set canvas size
      canvas.width = 800;
      canvas.height = 600;
      
      try {
        // Load image
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = imageUrl;
        });

        // Initialize puzzle core
        puzzleCoreRef.current = new window.PuzzleCore({
          imageUrl,
          difficulty,
          onComplete: handlePuzzleComplete,
          onPiecePlace: handlePiecePlace
        });

        // Initialize pieces
        const initialPieces = await puzzleCoreRef.current.initialize(img);
        setPieces(initialPieces);

        // Initialize piece detection
        pieceDetectionRef.current = new window.PieceDetection(canvas, puzzleCoreRef.current);

        // Initialize scoring engine
        scoringEngineRef.current = new window.ScoringEngine();

        // Start render loop
        startRenderLoop();
        
      } catch (error) {
        console.error('Failed to initialize puzzle:', error);
        toast({
          title: 'Error',
          description: 'Failed to initialize puzzle',
          variant: 'destructive'
        });
      }
    };

    initializePuzzle();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (pieceDetectionRef.current) {
        pieceDetectionRef.current.cleanup();
      }
    };
  }, [isLoading, imageUrl, difficulty, toast]);

  const startRenderLoop = useCallback(() => {
    const render = () => {
      if (!canvasRef.current || !puzzleCoreRef.current) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Clear canvas
      ctx.fillStyle = 'rgb(var(--puzzle-black))';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw puzzle pieces
      pieces.forEach(piece => {
        drawPiece(ctx, piece);
      });
      
      // Update game state
      if (gameState === 'playing' && scoringEngineRef.current) {
        setElapsedTime(scoringEngineRef.current.getElapsedTime());
        setProgress(puzzleCoreRef.current.getProgress());
      }
      
      animationRef.current = requestAnimationFrame(render);
    };
    
    render();
  }, [pieces, gameState]);

  const drawPiece = (ctx, piece) => {
    if (!piece) return;
    
    // Create image element if not exists
    if (!piece.imageElement) {
      piece.imageElement = new Image();
      piece.imageElement.src = imageUrl;
    }
    
    // Draw piece from source image
    ctx.save();
    
    // Add visual effects for different states
    if (piece.isDragging) {
      ctx.shadowColor = 'rgba(168, 239, 255, 0.5)';
      ctx.shadowBlur = 10;
    } else if (piece.isCorrect) {
      ctx.shadowColor = 'rgba(0, 255, 128, 0.3)';
      ctx.shadowBlur = 5;
    }
    
    // Draw the piece
    if (piece.imageElement.complete) {
      ctx.drawImage(
        piece.imageElement,
        piece.col * piece.width, piece.row * piece.height, piece.width, piece.height,
        piece.currentX, piece.currentY, piece.width, piece.height
      );
    }
    
    // Draw border
    ctx.strokeStyle = piece.isCorrect ? 'rgb(var(--puzzle-aqua))' : 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = piece.isDragging ? 3 : 1;
    ctx.strokeRect(piece.currentX, piece.currentY, piece.width, piece.height);
    
    ctx.restore();
  };

  const handleGameStart = () => {
    if (scoringEngineRef.current) {
      scoringEngineRef.current.startTimer();
      setGameState('playing');
      toast({
        title: 'Game Started',
        description: 'Good luck with your puzzle!'
      });
    }
  };

  const handleGamePause = () => {
    setGameState(gameState === 'paused' ? 'playing' : 'paused');
  };

  const handleGameReset = () => {
    if (puzzleCoreRef.current && scoringEngineRef.current) {
      puzzleCoreRef.current.reset();
      scoringEngineRef.current.reset();
      setPieces([...puzzleCoreRef.current.pieces]);
      setGameState('not_started');
      setProgress(0);
      setElapsedTime(0);
      setMoves(0);
      setHints(0);
      
      toast({
        title: 'Puzzle Reset',
        description: 'Starting fresh!'
      });
    }
  };

  const handleHint = () => {
    if (scoringEngineRef.current && puzzleCoreRef.current) {
      scoringEngineRef.current.recordHint();
      setHints(prev => prev + 1);
      
      // Find a piece that's not in correct position
      const incorrectPiece = puzzleCoreRef.current.pieces.find(p => !p.isCorrect);
      if (incorrectPiece) {
        // Highlight the correct position briefly
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        ctx.save();
        ctx.strokeStyle = 'rgb(var(--puzzle-aqua))';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(incorrectPiece.correctX, incorrectPiece.correctY, incorrectPiece.width, incorrectPiece.height);
        ctx.restore();
        
        setTimeout(() => {
          // Clear hint after 2 seconds
        }, 2000);
      }
      
      toast({
        title: 'Hint Used',
        description: 'The correct position is highlighted'
      });
    }
  };

  const handlePiecePlace = (piece) => {
    if (scoringEngineRef.current) {
      scoringEngineRef.current.recordCorrectPlacement();
      setMoves(scoringEngineRef.current.moves);
      
      toast({
        title: 'Perfect Fit!',
        description: 'Piece placed correctly'
      });
    }
  };

  const handlePuzzleComplete = () => {
    if (scoringEngineRef.current) {
      scoringEngineRef.current.stopTimer();
      setGameState('completed');
      
      const stats = scoringEngineRef.current.getStats();
      const score = scoringEngineRef.current.calculateScore(pieces.length, difficulty);
      
      toast({
        title: '🎉 Puzzle Completed!',
        description: `Completed in ${formatTime(stats.elapsedTime)} with ${stats.moves} moves`
      });
      
      if (onComplete) {
        onComplete({
          sessionId,
          score,
          time: stats.elapsedTime,
          moves: stats.moves,
          hints: stats.hints,
          difficulty
        });
      }
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading puzzle engine...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      {/* Game Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Jigsaw Puzzle</span>
            <Badge variant="default">{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Timer className="h-4 w-4" />
                <span className="text-sm font-mono">{formatTime(elapsedTime)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Hash className="h-4 w-4" />
                <span className="text-sm">Moves: {moves}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lightbulb className="h-4 w-4" />
                <span className="text-sm">Hints: {hints}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {gameState === 'not_started' && (
                <Button onClick={handleGameStart} size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </Button>
              )}
              
              {(gameState === 'playing' || gameState === 'paused') && (
                <>
                  <Button onClick={handleGamePause} variant="outline" size="sm">
                    <Pause className="h-4 w-4 mr-2" />
                    {gameState === 'paused' ? 'Resume' : 'Pause'}
                  </Button>
                  <Button onClick={handleHint} variant="outline" size="sm">
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Hint
                  </Button>
                </>
              )}
              
              <Button onClick={handleGameReset} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Game Canvas */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              className="border border-border rounded-lg bg-puzzle-black"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PuzzleGameEngine;