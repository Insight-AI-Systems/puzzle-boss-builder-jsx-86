
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Lightbulb, 
  Save,
  ArrowLeftRight
} from 'lucide-react';

interface CrosswordControlsProps {
  isPaused: boolean;
  isCompleted: boolean;
  hintsUsed: number;
  selectedDirection: 'across' | 'down';
  onTogglePause: () => void;
  onReset: () => void;
  onGetHint: () => void;
  onSave: () => void;
  onToggleDirection: () => void;
}

export function CrosswordControls({
  isPaused,
  isCompleted,
  hintsUsed,
  selectedDirection,
  onTogglePause,
  onReset,
  onGetHint,
  onSave,
  onToggleDirection
}: CrosswordControlsProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🧩 Crossword Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Game State Controls */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={onTogglePause}
            disabled={isCompleted}
            variant="outline"
            size="sm"
          >
            {isPaused ? <Play className="w-4 h-4 mr-1" /> : <Pause className="w-4 h-4 mr-1" />}
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
          
          <Button
            onClick={onSave}
            variant="outline"
            size="sm"
          >
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
        </div>

        {/* Direction Toggle */}
        <div className="space-y-2">
          <div className="text-sm font-semibold">Current Direction</div>
          <Button
            onClick={onToggleDirection}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <ArrowLeftRight className="w-4 h-4 mr-1" />
            {selectedDirection === 'across' ? 'Across' : 'Down'}
          </Button>
        </div>

        {/* Hint System */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Hints</span>
            <Badge variant="secondary">{hintsUsed} used</Badge>
          </div>
          <Button
            onClick={onGetHint}
            disabled={isCompleted || isPaused}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <Lightbulb className="w-4 h-4 mr-1" />
            Get Hint
          </Button>
        </div>

        {/* Reset */}
        <Button
          onClick={onReset}
          variant="destructive"
          size="sm"
          className="w-full"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset Puzzle
        </Button>

        {/* Instructions */}
        <div className="text-xs text-gray-600 space-y-1">
          <div className="font-semibold">How to play:</div>
          <div>• Click a cell to select it</div>
          <div>• Type letters to fill in answers</div>
          <div>• Click clues to jump to words</div>
          <div>• Use Tab to toggle direction</div>
        </div>
      </CardContent>
    </Card>
  );
}
