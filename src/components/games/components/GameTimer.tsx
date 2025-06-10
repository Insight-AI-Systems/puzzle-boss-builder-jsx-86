
import React from 'react';
import { Clock } from 'lucide-react';

interface GameTimerProps {
  timeElapsed: number;
  className?: string;
}

export const GameTimer: React.FC<GameTimerProps> = ({ timeElapsed, className = '' }) => {
  const minutes = Math.floor(timeElapsed / 60);
  const seconds = timeElapsed % 60;
  
  return (
    <div className={`flex items-center gap-2 text-puzzle-white ${className}`}>
      <Clock className="h-4 w-4" />
      <span className="font-mono">
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
};
