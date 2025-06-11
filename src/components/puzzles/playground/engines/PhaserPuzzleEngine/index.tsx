import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Volume2, 
  VolumeX,
  Zap,
  Trophy
} from 'lucide-react';
import { useClerkAuth } from '@/hooks/useClerkAuth';

interface PhaserPuzzleEngineProps {
  gameConfig?: any;
  onComplete?: (result: any) => void;
  onError?: (error: string) => void;
}

export function PhaserPuzzleEngine({ 
  gameConfig, 
  onComplete, 
  onError 
}: PhaserPuzzleEngineProps) {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<any>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'paused' | 'completed'>('idle');
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { user } = useClerkAuth();

  useEffect(() => {
    if (!gameConfig || !gameRef.current) return;

    const loadPhaser = async () => {
      const Phaser = (await import('phaser')).default;

      const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: gameRef.current,
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 300 },
            debug: false
          }
        },
        scene: {
          preload: preload,
          create: create,
          update: update
        }
      };

      phaserGameRef.current = new Phaser.Game(config);

      function preload() {
        this.load.setBaseURL('http://labs.phaser.io');

        this.load.image('sky', 'assets/skies/space3.png');
        this.load.image('logo', 'assets/sprites/phaser3-logo.png');
        this.load.image('red', 'assets/particles/red.png');
      }

      function create() {
        this.add.image(400, 300, 'sky');

        const particles = this.add.particles('red');

        const emitter = particles.createEmitter({
          speed: 100,
          scale: { start: 1, end: 0 },
          blendMode: 'ADD'
        });

        const logo = this.physics.add.image(400, 100, 'logo');

        logo.setVelocity(100, 200);
        logo.setBounce(1, 1);
        logo.setCollideWorldBounds(true);

        emitter.startFollow(logo);
      }

      function update(time, delta) {
        if (gameState === 'playing') {
          setTimeElapsed(prevTime => prevTime + delta / 1000);
        }
      }
    };

    loadPhaser();

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
      }
    };
  }, [gameConfig, gameState]);

  return (
    <div className="w-full space-y-4">
      {/* Game Controls */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-puzzle-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-puzzle-gold" />
              Phaser Puzzle Engine
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-puzzle-aqua">
                Score: {score}
              </Badge>
              <Badge variant="outline" className="text-puzzle-white">
                Time: {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button
              onClick={() => setGameState(gameState === 'playing' ? 'paused' : 'playing')}
              className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black"
            >
              {gameState === 'playing' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            
            <Button
              onClick={() => {
                setGameState('idle');
                setScore(0);
                setTimeElapsed(0);
              }}
              variant="outline"
              className="border-gray-600 text-gray-400"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={() => setSoundEnabled(!soundEnabled)}
              variant="outline"
              className="border-gray-600 text-gray-400"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </div>

          {!user && (
            <Alert className="mb-4 border-puzzle-gold bg-puzzle-gold/10">
              <Trophy className="h-4 w-4" />
              <AlertDescription className="text-puzzle-gold">
                Sign in to save your progress and compete on leaderboards!
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Game Canvas Container */}
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-4">
          <div 
            ref={gameRef}
            className="w-full h-96 bg-gray-800 rounded-lg flex items-center justify-center"
          >
            <div className="text-center text-gray-400">
              <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Phaser game will load here</p>
              <p className="text-sm">Click Play to start</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PhaserPuzzleEngine;
