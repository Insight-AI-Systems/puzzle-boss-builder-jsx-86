
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
    const loginDate = new Date(date);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - loginDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 30) {
      return formatDistanceToNow(loginDate, { addSuffix: true });
    }
    return format(loginDate, 'MMM d, yyyy');
  };

  const getInactiveStatus = (date: string | null) => {
    if (!date) return true;
    const loginDate = new Date(date);
    const now = new Date();
    return (now.getTime() - loginDate.getTime()) > (30 * 24 * 60 * 60 * 1000);
  };

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
