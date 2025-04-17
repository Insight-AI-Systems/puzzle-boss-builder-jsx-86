
import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Clock, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const [timeLeft, setTimeLeft] = useState(timeLimit - timeSpent);
  const [warning, setWarning] = useState(false);
  
  // Calculate percentage of time remaining
  const percentRemaining = Math.max(0, Math.min(100, (timeLeft / timeLimit) * 100));
  
  // Format time for display
  const formatTime = (seconds: number): string => {
    if (seconds <= 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  useEffect(() => {
    // Update time left based on timeSpent
    setTimeLeft(timeLimit - timeSpent);
    
    // Show warning when less than 20% time remains
    setWarning(percentRemaining < 20 && percentRemaining > 0);
    
    // Check if time is up
    if (timeSpent >= timeLimit && isActive) {
      onTimeUp();
    }
  }, [timeLimit, timeSpent, percentRemaining, isActive, onTimeUp]);
  
  // Timer effect
  useEffect(() => {
    let interval: number | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            if (interval !== null) clearInterval(interval);
            onTimeUp();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (interval !== null) clearInterval(interval);
    };
  }, [isActive, timeLeft, onTimeUp]);
  
  return (
    <div className={`w-full ${warning ? 'animate-pulse' : ''}`}>
      <Alert variant={warning ? "destructive" : "default"} className="mb-2">
        <div className="flex items-center">
          {warning ? <AlertTriangle className="h-4 w-4 mr-2" /> : <Clock className="h-4 w-4 mr-2" />}
          <span className="font-medium">
            {warning ? 'Time running out!' : 'Timed Challenge'}
          </span>
        </div>
        <AlertDescription className="mt-1">
          {isActive ? `Time remaining: ${formatTime(timeLeft)}` : 'Paused'}
        </AlertDescription>
      </Alert>
      
      <Progress 
        value={percentRemaining} 
        className={warning ? 'bg-red-200' : 'bg-gray-200'} 
      />
    </div>
  );
};

export default TimedModeBanner;
