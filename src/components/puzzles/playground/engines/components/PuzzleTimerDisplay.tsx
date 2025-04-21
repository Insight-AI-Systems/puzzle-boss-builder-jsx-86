
import React from "react";
import { Clock } from "lucide-react";

interface PuzzleTimerDisplayProps {
  seconds: number;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const PuzzleTimerDisplay: React.FC<PuzzleTimerDisplayProps> = ({ seconds }) => (
  <div className="flex items-center gap-1 text-sm rounded px-2 py-1">
    <Clock className="h-4 w-4 mr-1 text-primary/80" />
    <span className="font-mono tabular-nums">{formatTime(seconds)}</span>
  </div>
);
