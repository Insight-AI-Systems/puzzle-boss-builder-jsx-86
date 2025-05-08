
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Clock } from 'lucide-react';

interface UserLastLoginProps {
  lastSignIn?: string | null;
}

export function UserLastLogin({ lastSignIn }: UserLastLoginProps) {
  if (!lastSignIn) {
    return <span className="text-gray-400 text-sm">Never</span>;
  }
  
  // Parse the date
  const lastLoginDate = new Date(lastSignIn);
  
  // Check if date is invalid
  if (isNaN(lastLoginDate.getTime())) {
    return <span className="text-gray-400 text-sm">Invalid date</span>;
  }
  
  // Get relative time string
  const relativeTime = getRelativeTimeString(lastLoginDate);
  
  // Format exact time for tooltip
  const exactTime = lastLoginDate.toLocaleString();
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-1 text-sm cursor-help">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span>{relativeTime}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Last login: {exactTime}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Helper function to get relative time string
function getRelativeTimeString(date: Date): string {
  const now = new Date();
  const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  // Handle cases: just now, minutes, hours, days, weeks, months, years
  if (diffSeconds < 60) return `Just now`;
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
  if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)}d ago`;
  if (diffSeconds < 2629800) return `${Math.floor(diffSeconds / 604800)}w ago`;
  if (diffSeconds < 31557600) return `${Math.floor(diffSeconds / 2629800)}mo ago`;
  return `${Math.floor(diffSeconds / 31557600)}y ago`;
}
