
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TetrisControls } from '../types/tetrisTypes';
import { 
  Play, 
  Pause, 
  RotateCw, 
  ArrowLeft, 
  ArrowRight, 
  ArrowDown, 
  ArrowDownToLine,
  Square,
  RefreshCw 
} from 'lucide-react';

interface TetrisControlsProps {
  controls: TetrisControls;
  isPaused: boolean;
  isGameOver: boolean;
  onReset: () => void;
}

export function TetrisControls({ 
  controls, 
  isPaused, 
  isGameOver, 
  onReset 
}: TetrisControlsProps) {
  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isGameOver) return;

      switch (event.key.toLowerCase()) {
        case 'a':
        case 'arrowleft':
          event.preventDefault();
          controls.moveLeft();
          break;
        case 'd':
        case 'arrowright':
          event.preventDefault();
          controls.moveRight();
          break;
        case 's':
        case 'arrowdown':
          event.preventDefault();
          controls.moveDown();
          break;
        case 'w':
        case 'arrowup':
        case ' ':
          event.preventDefault();
          controls.rotate();
          break;
        case 'shift':
          event.preventDefault();
          controls.hold();
          break;
        case 'enter':
          event.preventDefault();
          controls.hardDrop();
          break;
        case 'p':
        case 'escape':
          event.preventDefault();
          controls.pause();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [controls, isGameOver]);

  // Touch controls for mobile
  const handleTouchStart = (action: () => void) => {
    return (e: React.TouchEvent) => {
      e.preventDefault();
      action();
    };
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white text-lg flex items-center gap-2">
          🎮 Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Game State Controls */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={controls.pause}
            disabled={isGameOver}
            variant="outline"
            size="sm"
            className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
          
          <Button
            onClick={onReset}
            variant="outline"
            size="sm"
            className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>

        {/* Movement Controls */}
        <div className="space-y-2">
          <div className="text-sm text-gray-400 font-semibold">Movement</div>
          <div className="grid grid-cols-3 gap-1">
            <div></div>
            <Button
              onTouchStart={handleTouchStart(controls.rotate)}
              onClick={controls.rotate}
              disabled={isGameOver || isPaused}
              variant="outline"
              size="sm"
              className="bg-blue-600 border-blue-500 text-white hover:bg-blue-500"
            >
              <RotateCw className="w-4 h-4" />
            </Button>
            <div></div>
            
            <Button
              onTouchStart={handleTouchStart(controls.moveLeft)}
              onClick={controls.moveLeft}
              disabled={isGameOver || isPaused}
              variant="outline"
              size="sm"
              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            
            <Button
              onTouchStart={handleTouchStart(controls.moveDown)}
              onClick={controls.moveDown}
              disabled={isGameOver || isPaused}
              variant="outline"
              size="sm"
              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              <ArrowDown className="w-4 h-4" />
            </Button>
            
            <Button
              onTouchStart={handleTouchStart(controls.moveRight)}
              onClick={controls.moveRight}
              disabled={isGameOver || isPaused}
              variant="outline"
              size="sm"
              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Special Actions */}
        <div className="space-y-2">
          <div className="text-sm text-gray-400 font-semibold">Actions</div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onTouchStart={handleTouchStart(controls.hardDrop)}
              onClick={controls.hardDrop}
              disabled={isGameOver || isPaused}
              variant="outline"
              size="sm"
              className="bg-red-600 border-red-500 text-white hover:bg-red-500"
            >
              <ArrowDownToLine className="w-4 h-4 mr-1" />
              Drop
            </Button>
            
            <Button
              onTouchStart={handleTouchStart(controls.hold)}
              onClick={controls.hold}
              disabled={isGameOver || isPaused}
              variant="outline"
              size="sm"
              className="bg-yellow-600 border-yellow-500 text-white hover:bg-yellow-500"
            >
              <Square className="w-4 h-4 mr-1" />
              Hold
            </Button>
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="text-xs text-gray-500 space-y-1">
          <div className="font-semibold">Keyboard:</div>
          <div>WASD/Arrows: Move • Space: Rotate</div>
          <div>Enter: Hard Drop • Shift: Hold</div>
          <div>P/Esc: Pause</div>
        </div>
      </CardContent>
    </Card>
  );
}
