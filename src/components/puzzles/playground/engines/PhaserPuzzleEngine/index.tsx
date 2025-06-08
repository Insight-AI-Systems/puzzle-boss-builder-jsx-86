
import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Settings, Zap, Timer, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AuthSection } from './components/AuthSection';
import { createPuzzleScene } from './scenes/PuzzleScene';
import { useAuth } from '@/contexts/AuthContext';

interface PhaserPuzzleEngineProps {
  imageUrl: string;
  pieceCount: number;
  onComplete?: (time: number, moves: number) => void;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export const PhaserPuzzleEngine: React.FC<PhaserPuzzleEngineProps> = ({
  imageUrl,
  pieceCount,
  onComplete,
  difficulty = 'medium'
}) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<any>(null);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  
  const [gameState, setGameState] = useState({
    isPlaying: false,
    isPaused: false,
    timeElapsed: 0,
    movesCount: 0,
    completedPieces: 0,
    progress: 0
  });

  // Initialize Phaser game
  useEffect(() => {
    if (!gameRef.current || !isAuthenticated) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameRef.current,
      backgroundColor: '#1a1a1a',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false
        }
      },
      scene: {
        preload: function() {
          this.load.image('puzzle', imageUrl);
        },
        create: function() {
          sceneRef.current = createPuzzleScene(this, {
            imageKey: 'puzzle',
            pieceCount,
            onPieceMove: () => {
              setGameState(prev => ({ ...prev, movesCount: prev.movesCount + 1 }));
            },
            onPieceComplete: (completed: number, total: number) => {
              const progress = (completed / total) * 100;
              setGameState(prev => ({ 
                ...prev, 
                completedPieces: completed, 
                progress 
              }));
              
              if (completed === total) {
                setGameState(prev => ({ ...prev, isPlaying: false }));
                onComplete?.(gameState.timeElapsed, gameState.movesCount);
                toast({
                  title: "Puzzle Complete!",
                  description: `Completed in ${gameState.timeElapsed}s with ${gameState.movesCount} moves!`,
                });
              }
            }
          });
        }
      }
    };

    phaserGameRef.current = new Phaser.Game(config);

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, [imageUrl, pieceCount, isAuthenticated]);

  // Game timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState.isPlaying && !gameState.isPaused) {
      interval = setInterval(() => {
        setGameState(prev => ({ ...prev, timeElapsed: prev.timeElapsed + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState.isPlaying, gameState.isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setGameState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
    sceneRef.current?.startGame();
  };

  const handlePause = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
    sceneRef.current?.togglePause();
  };

  const handleReset = () => {
    setGameState({
      isPlaying: false,
      isPaused: false,
      timeElapsed: 0,
      movesCount: 0,
      completedPieces: 0,
      progress: 0
    });
    sceneRef.current?.resetGame();
  };

  const handleHint = () => {
    if (gameState.isPlaying && !gameState.isPaused) {
      sceneRef.current?.showHint();
      toast({
        title: "Hint activated!",
        description: "Look for the highlighted piece.",
      });
    }
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-puzzle-aqua';
    }
  };

  if (!isAuthenticated) {
    return (
      <Card className="bg-puzzle-black border-puzzle-border">
        <CardContent className="p-6">
          <AuthSection />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Game Header */}
      <Card className="bg-puzzle-black border-puzzle-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-puzzle-white flex items-center gap-2">
              <Target className="w-5 h-5 text-puzzle-aqua" />
              Jigsaw Puzzle
              <Badge className={getDifficultyColor()}>
                {difficulty} ({pieceCount} pieces)
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-puzzle-white/70">
              <div className="flex items-center gap-1">
                <Timer className="w-4 h-4" />
                {formatTime(gameState.timeElapsed)}
              </div>
              <div>Moves: {gameState.movesCount}</div>
              <div>Progress: {Math.round(gameState.progress)}%</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-2 mb-4">
            {!gameState.isPlaying ? (
              <Button onClick={handleStart} className="bg-puzzle-aqua hover:bg-puzzle-aqua/80">
                <Play className="w-4 h-4 mr-2" />
                Start Game
              </Button>
            ) : (
              <Button onClick={handlePause} variant="outline">
                <Pause className="w-4 h-4 mr-2" />
                {gameState.isPaused ? 'Resume' : 'Pause'}
              </Button>
            )}
            <Button onClick={handleReset} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleHint} variant="outline" disabled={!gameState.isPlaying || gameState.isPaused}>
              <Zap className="w-4 h-4 mr-2" />
              Hint
            </Button>
            <Button variant="outline">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-puzzle-aqua h-2 rounded-full transition-all duration-300"
              style={{ width: `${gameState.progress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Game Canvas */}
      <Card className="bg-puzzle-black border-puzzle-border">
        <CardContent className="p-4">
          <div 
            ref={gameRef} 
            className="w-full flex justify-center rounded-lg overflow-hidden bg-gray-900"
            style={{ minHeight: '600px' }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PhaserPuzzleEngine;
