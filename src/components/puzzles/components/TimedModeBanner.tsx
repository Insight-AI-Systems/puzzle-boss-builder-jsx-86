
import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';

interface TimedModeBannerProps {
  timeLimit: number;
  timeSpent: number;
  isActive: boolean;
  onTimeUp: () => void;
  isMobile?: boolean;
}

const TimedModeBanner: React.FC<TimedModeBannerProps> = ({
  timeLimit,
  timeSpent,
  isActive,
  onTimeUp,
  isMobile = false
}) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit - timeSpent);
  const [warningLevel, setWarningLevel] = useState<'normal' | 'warning' | 'critical'>('normal');
  
  // Update time left and check for time up
  useEffect(() => {
    const remaining = timeLimit - timeSpent;
    setTimeLeft(remaining);
    
    // Set warning levels
    if (remaining <= timeLimit * 0.25) {
      setWarningLevel('critical');
    } else if (remaining <= timeLimit * 0.5) {
      setWarningLevel('warning');
    } else {
      setWarningLevel('normal');
    }
    
    // Check if time is up
    if (remaining <= 0 && isActive) {
      onTimeUp();
    }
  }, [timeLimit, timeSpent, isActive, onTimeUp]);
  
  // Format time for display (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(Math.max(0, seconds) / 60);
    const secs = Math.max(0, seconds) % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentage
  const progressPercent = Math.max(0, Math.min(100, (timeLeft / timeLimit) * 100));
  
  // Get color based on warning level
  const getProgressColor = () => {
    switch (warningLevel) {
      case 'critical':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-green-500';
    }
  };
  
  return (
    <div className={`w-full p-2 rounded-lg bg-black/20 ${isMobile ? 'text-xs' : 'text-sm'}`}>
      <div className="flex justify-between items-center mb-1">
        <span>Timed Mode: {formatTime(timeLeft)} remaining</span>
        <span className={`font-bold ${warningLevel === 'critical' ? 'text-red-500 animate-pulse' : ''}`}>
          {!isActive && '(Paused)'}
        </span>
      </div>
      
      <Progress 
        value={progressPercent} 
        className={`h-2 ${isMobile ? 'h-1.5' : 'h-2'} ${getProgressColor()}`}
      />
    </div>
  );
};

export default TimedModeBanner;
