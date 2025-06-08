
import React from 'react';
import { GameControls } from '@/presentation/components/game';

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
    <GameControls
      isPaused={isPaused}
      isCompleted={isCompleted}
      onPause={onTogglePause}
      onResume={onTogglePause}
      onReset={onReset}
      onSave={onSave}
      onHint={onGetHint}
      onToggleDirection={onToggleDirection}
      hintsUsed={hintsUsed}
      selectedDirection={selectedDirection}
      showDirectionToggle={true}
      showHint={true}
      showSave={true}
    />
  );
}
