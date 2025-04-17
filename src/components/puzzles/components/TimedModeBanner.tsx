
import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Clock, AlertTriangle } from 'lucide-react';

interface TimedModeBannerProps {
  timeLimit: number;
  timeSpent: number;
  isActive: boolean;
  onTimeUp: () => void;
  isMobile: boolean;
}

const TimedModeBanner: React.FC<TimedModeBannerProps> = ({
  timeLimit,
  timeSpent,
  isActive,
  onTimeUp,
  isMobile
}) => {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit - timeSpent);
  const [isWarning, setIsWarning] = useState(false);
  
  // Update time remaining
  useEffect(() => {
    setTimeRemaining(timeLimit - timeSpent);
  }, [timeLimit, timeSpent]);
  
  // Set warning state when time is running low
  useEffect(() => {
    const warningThreshold = timeLimit * 0.25; // 25% of time remaining
    setIsWarning(timeRemaining <= warningThreshold && timeRemaining > 0);
  }, [timeRemaining, timeLimit]);
  
  // Check if time is up
  useEffect(() => {
    if (timeRemaining <= 0 && isActive) {
      onTimeUp();
    }
  }, [timeRemaining, isActive, onTimeUp]);
  
  // Format time for display (mm:ss)
  const formatTime = (seconds: number): string => {
    const mins = Math.max(0, Math.floor(seconds / 60));
    const secs = Math.max(0, seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentage
  const progressPercentage = Math.max(0, (timeRemaining / timeLimit) * 100);
  
  return (
    <div className={`w-full ${isWarning ? 'animate-pulse' : ''}`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1 text-sm font-medium">
          <Clock className={`h-4 w-4 ${isWarning ? 'text-red-500' : ''}`} />
          <span className={isWarning ? 'text-red-500' : ''}>Time Remaining:</span>
        </div>
        <div className={`font-bold ${isWarning ? 'text-red-500' : ''}`}>
          {formatTime(timeRemaining)}
        </div>
      </div>
      
      <Progress 
        value={progressPercentage} 
        className={`h-2 ${isWarning ? 'bg-red-200' : ''}`}
        indicatorClassName={isWarning ? 'bg-red-500' : undefined}
      />
      
      {isWarning && (
        <div className="flex items-center gap-1 mt-1 text-xs text-red-500">
          <AlertTriangle className="h-3 w-3" />
          <span>Time is running out!</span>
        </div>
      )}
    </div>
  );
};

export default TimedModeBanner;
