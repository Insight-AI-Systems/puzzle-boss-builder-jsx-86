
import React from 'react';
import { cn } from '@/lib/utils';

interface PasswordStrengthIndicatorProps {
  score: number;
  label: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  score,
  label
}) => {
  // Function to determine color based on score
  const getColorForScore = (score: number) => {
    if (score < 25) return 'bg-red-500';
    if (score < 50) return 'bg-orange-500';
    if (score < 75) return 'bg-yellow-500';
    if (score < 90) return 'bg-green-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="space-y-1">
      <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-300", getColorForScore(score))}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground flex justify-between">
        <span>Password strength:</span> 
        <span className={cn(
          score < 25 ? 'text-red-500' : 
          score < 50 ? 'text-orange-500' : 
          score < 75 ? 'text-yellow-500' : 
          score < 90 ? 'text-green-500' : 'text-emerald-500'
        )}>
          {label}
        </span>
      </p>
    </div>
  );
};
