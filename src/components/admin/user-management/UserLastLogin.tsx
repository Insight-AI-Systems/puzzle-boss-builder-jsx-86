
import React from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { UserLastLoginProps } from '@/types/userTableTypes';

export const UserLastLogin: React.FC<UserLastLoginProps> = ({ lastSignIn }) => {
  const formatLastLogin = (date: string | null) => {
    if (!date) return 'Never';
    
    try {
      const loginDate = new Date(date);
      
      // Check if date is valid
      if (isNaN(loginDate.getTime())) {
        console.error('Invalid date format:', date);
        return 'Invalid date';
      }
      
      const now = new Date();
      const diffInDays = Math.floor((now.getTime() - loginDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffInDays < 30) {
        return formatDistanceToNow(loginDate, { addSuffix: true });
      }
      return format(loginDate, 'MMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error, date);
      return 'Error';
    }
  };

  const getInactiveStatus = (date: string | null) => {
    if (!date) return true;
    
    try {
      const loginDate = new Date(date);
      
      // Check if date is valid
      if (isNaN(loginDate.getTime())) {
        return true;
      }
      
      const now = new Date();
      return (now.getTime() - loginDate.getTime()) > (30 * 24 * 60 * 60 * 1000);
    } catch (error) {
      console.error('Error determining inactive status:', error);
      return true;
    }
  };
  
  // Debug logging
  if (lastSignIn) {
    console.log('Last sign in value:', lastSignIn, 'Formatted as:', formatLastLogin(lastSignIn));
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="flex items-center gap-2">
            {getInactiveStatus(lastSignIn) && (
              <span className="w-2 h-2 rounded-full bg-red-500" />
            )}
            {formatLastLogin(lastSignIn)}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {lastSignIn 
            ? format(new Date(lastSignIn), 'PPpp')
            : 'User has never logged in'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
