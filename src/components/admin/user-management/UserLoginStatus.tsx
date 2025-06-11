
import React from 'react';
import { formatDistanceToNow, format, isToday, isValid } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

interface MemberLoginStatusProps {
  lastSignIn: string | null;
  createdAt: string;
  displayName?: string | null;
  currentUserEmail?: string;
  userEmail?: string | null;
}

export const UserLoginStatus: React.FC<MemberLoginStatusProps> = ({ 
  lastSignIn, 
  createdAt, 
  displayName,
  currentUserEmail,
  userEmail
}) => {
  const getLoginStatus = (date: string | null) => {
    // Check if this is the currently logged-in user
    const isCurrentUser = currentUserEmail && userEmail && currentUserEmail === userEmail;
    
    if (!date) return { 
      indicator: '⚫', 
      text: 'Never', 
      color: 'text-gray-500'
    };
    
    try {
      const loginDate = new Date(date);
      
      if (!isValid(loginDate)) {
        return { 
          indicator: '⚫', 
          text: 'Never', 
          color: 'text-gray-500'
        };
      }
      
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - loginDate.getTime()) / (1000 * 60));
      const diffInDays = Math.floor(diffInMinutes / (60 * 24));
      
      // If this is the current user, show as "Now" regardless of last sign in time
      if (isCurrentUser) {
        return { 
          indicator: '🟢', 
          text: 'Now', 
          color: 'text-green-600'
        };
      }
      
      // Enhanced thresholds for better real-time detection
      if (diffInMinutes < 10) {
        return { 
          indicator: '🟢', 
          text: 'Now', 
          color: 'text-green-600'
        };
      } else if (diffInMinutes < 30) {
        return { 
          indicator: '🟢', 
          text: 'Active', 
          color: 'text-green-600'
        };
      } else if (isToday(loginDate)) {
        return { 
          indicator: '🟡', 
          text: 'Today', 
          color: 'text-yellow-600'
        };
      } else if (diffInDays === 1) {
        return { 
          indicator: '🟠', 
          text: '1d ago', 
          color: 'text-orange-600'
        };
      } else if (diffInDays < 7) {
        return { 
          indicator: '🟠', 
          text: `${diffInDays}d ago`, 
          color: 'text-orange-600'
        };
      } else {
        return { 
          indicator: '🔴', 
          text: `${diffInDays}d ago`, 
          color: 'text-red-600'
        };
      }
    } catch (error) {
      console.error('Error determining login status:', error);
      return { 
        indicator: '⚫', 
        text: 'Error', 
        color: 'text-gray-500'
      };
    }
  };

  const formatTooltipContent = () => {
    const joinedDate = createdAt ? format(new Date(createdAt), 'PPpp') : 'Unknown';
    const isCurrentUser = currentUserEmail && userEmail && currentUserEmail === userEmail;
    
    if (!lastSignIn) {
      return (
        <div className="space-y-1">
          <div><strong>Status:</strong> Never logged in</div>
          <div><strong>Joined:</strong> {joinedDate}</div>
        </div>
      );
    }

    try {
      const loginDate = new Date(lastSignIn);
      
      if (!isValid(loginDate)) {
        return (
          <div className="space-y-1">
            <div><strong>Status:</strong> Invalid login date</div>
            <div><strong>Joined:</strong> {joinedDate}</div>
          </div>
        );
      }

      const formattedLogin = format(loginDate, 'PPpp');
      const relativeTime = formatDistanceToNow(loginDate, { addSuffix: true });
      
      return (
        <div className="space-y-1">
          {isCurrentUser && <div><strong>Status:</strong> Currently logged in (You)</div>}
          <div><strong>Last Login:</strong> {formattedLogin}</div>
          <div><strong>Relative:</strong> {relativeTime}</div>
          <div><strong>Joined:</strong> {joinedDate}</div>
          {displayName && <div><strong>User:</strong> {displayName}</div>}
        </div>
      );
    } catch (error) {
      return (
        <div className="space-y-1">
          <div><strong>Status:</strong> Error parsing date</div>
          <div><strong>Joined:</strong> {joinedDate}</div>
        </div>
      );
    }
  };

  const status = getLoginStatus(lastSignIn);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center gap-2 cursor-help ${status.color}`}>
            <span className="text-sm">{status.indicator}</span>
            <span className="text-sm font-medium">{status.text}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          {formatTooltipContent()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
