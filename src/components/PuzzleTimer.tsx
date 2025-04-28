
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface PuzzleTimerProps {
  seconds: number;
  className?: string;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export function PuzzleTimer({ seconds, className = '' }: PuzzleTimerProps) {
  return (
    <Card className={`inline-flex ${className}`}>
      <CardContent className="flex items-center gap-2 p-4">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="font-mono text-lg tabular-nums">
          {formatTime(seconds)}
        </span>
      </CardContent>
    </Card>
  );
}
