
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TetrisControls as Controls } from '../types/tetrisTypes';
import { RotateCcw, Pause, Play, RotateCw, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface TetrisControlsProps {
  controls: Controls;
  isPaused: boolean;
  isGameOver: boolean;
  onReset: () => void;
}

export function TetrisControls({ controls, isPaused, isGameOver, onReset }: TetrisControlsProps) {
  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isGameOver) return;

      switch (event.code) {
        case 'ArrowLeft':
        case 'KeyA':
          event.preventDefault();
          controls.moveLeft();
          break;
        case 'ArrowRight':
        case 'KeyD':
          event.preventDefault();
          controls.moveRight();
          break;
        case 'ArrowDown':
        case 'KeyS':
          event.preventDefault();
          controls.moveDown();
          break;
        case 'ArrowUp':
        case 'KeyW':
          event.preventDefault();
          controls.rotate();
          break;
        case 'Space':
          event.preventDefault();
          controls.hardDrop();
          break;
        case 'KeyC':
          event.preventDefault();
          controls.hold();
          break;
        case 'KeyP':
        case 'Escape':
          event.preventDefault();
          controls.pause();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [controls, isGameOver]);

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white text-lg">Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Game Controls */}
        <div className="flex gap-2">
          <Button
            onClick={controls.pause}
            disabled={isGameOver}
            variant="outline"
            className="flex-1"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
          <Button onClick={onReset} variant="destructive">
            Reset
          </Button>
        </div>

        {/* Movement Controls */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            onMouseDown={controls.moveLeft}
            onTouchStart={controls.moveLeft}
            disabled={isGameOver || isPaused}
            variant="outline"
            className="aspect-square"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button
            onMouseDown={controls.moveDown}
            onTouchStart={controls.moveDown}
            disabled={isGameOver || isPaused}
            variant="outline"
            className="aspect-square"
          >
            <ArrowDown className="w-4 h-4" />
          </Button>
          <Button
            onMouseDown={controls.moveRight}
            onTouchStart={controls.moveRight}
            disabled={isGameOver || isPaused}
            variant="outline"
            className="aspect-square"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={controls.rotate}
            disabled={isGameOver || isPaused}
            variant="outline"
          >
            <RotateCw className="w-4 h-4 mr-2" />
            Rotate
          </Button>
          <Button
            onClick={controls.hardDrop}
            disabled={isGameOver || isPaused}
            variant="outline"
          >
            Drop
          </Button>
        </div>

        <Button
          onClick={controls.hold}
          disabled={isGameOver || isPaused}
          variant="outline"
          className="w-full"
        >
          Hold
        </Button>

        {/* Keyboard shortcuts */}
        <div className="text-xs text-gray-400 space-y-1">
          <div>Arrow Keys / WASD: Move & Rotate</div>
          <div>Space: Hard Drop</div>
          <div>C: Hold | P/Esc: Pause</div>
        </div>
      </CardContent>
    </Card>
  );
}
