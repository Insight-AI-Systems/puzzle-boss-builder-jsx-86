
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Save, Eye, ArrowLeft, ArrowRight } from 'lucide-react';

interface GameControlsProps {
  isPaused?: boolean;
  isCompleted?: boolean;
  onPause?: () => void;
  onResume?: () => void;
  onReset?: () => void;
  onSave?: () => void;
  onHint?: () => void;
  onToggleDirection?: () => void;
  hintsUsed?: number;
  selectedDirection?: 'across' | 'down';
  showDirectionToggle?: boolean;
  showHint?: boolean;
  showSave?: boolean;
  className?: string;
}

export function GameControls({
  isPaused = false,
  isCompleted = false,
  onPause,
  onResume,
  onReset,
  onSave,
  onHint,
  onToggleDirection,
  hintsUsed = 0,
  selectedDirection = 'across',
  showDirectionToggle = false,
  showHint = false,
  showSave = false,
  className = ''
}: GameControlsProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Game Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={isPaused ? onResume : onPause}
            variant="outline"
            disabled={isCompleted}
            className="w-full"
          >
            {isPaused ? (
              <>
                <Play className="w-4 h-4 mr-2" />
                Resume
              </>
            ) : (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            )}
          </Button>

          <Button
            onClick={onReset}
            variant="outline"
            className="w-full"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {showSave && onSave && (
          <Button
            onClick={onSave}
            variant="outline"
            className="w-full"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Game
          </Button>
        )}

        {showHint && onHint && (
          <Button
            onClick={onHint}
            variant="outline"
            disabled={isCompleted}
            className="w-full"
          >
            <Eye className="w-4 h-4 mr-2" />
            Hint ({hintsUsed} used)
          </Button>
        )}

        {showDirectionToggle && onToggleDirection && (
          <Button
            onClick={onToggleDirection}
            variant="outline"
            disabled={isCompleted}
            className="w-full"
          >
            {selectedDirection === 'across' ? (
              <>
                <ArrowRight className="w-4 h-4 mr-2" />
                Across
              </>
            ) : (
              <>
                <ArrowLeft className="w-4 h-4 mr-2 rotate-90" />
                Down
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
