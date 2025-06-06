
import React from 'react';
import { formatDistanceToNow, format, isToday, isValid } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface UserLoginStatusProps {
  lastSignIn: string | null;
  createdAt: string;
  displayName?: string | null;
}

export const UserLoginStatus: React.FC<UserLoginStatusProps> = ({ 
  lastSignIn, 
  createdAt, 
  displayName 
}) => {
  const getLoginStatus = (date: string | null) => {
    if (!date) return { 
      indicator: '⚫', 
      text: 'Never', 
      color: 'text-gray-500',
      isOnline: false,
      badge: 'offline'
    };
    
    try {
      const loginDate = new Date(date);
      
      if (!isValid(loginDate)) {
        return { 
          indicator: '⚫', 
          text: 'Never', 
          color: 'text-gray-500',
          isOnline: false,
          badge: 'offline'
        };
      }
      
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - loginDate.getTime()) / (1000 * 60));
      const diffInDays = Math.floor(diffInMinutes / (60 * 24));
      
      if (diffInMinutes < 15) {
        return { 
          indicator: '🟢', 
          text: 'Online', 
          color: 'text-green-600',
          isOnline: true,
          badge: 'online'
        };
      } else if (isToday(loginDate)) {
        return { 
          indicator: '🟡', 
          text: 'Today', 
          color: 'text-yellow-600',
          isOnline: false,
          badge: 'today'
        };
      } else if (diffInDays === 1) {
        return { 
          indicator: '🟠', 
          text: '1d ago', 
          color: 'text-orange-600',
          isOnline: false,
          badge: 'recent'
        };
      } else if (diffInDays < 7) {
        return { 
          indicator: '🟠', 
          text: `${diffInDays}d ago`, 
          color: 'text-orange-600',
          isOnline: false,
          badge: 'recent'
        };
      } else {
        return { 
          indicator: '🔴', 
          text: `${diffInDays}d ago`, 
          color: 'text-red-600',
          isOnline: false,
          badge: 'inactive'
        };
      }
    } catch (error) {
      console.error('Error determining login status:', error);
      return { 
        indicator: '⚫', 
        text: 'Error', 
        color: 'text-gray-500',
        isOnline: false,
        badge: 'offline'
      };
    }
  };

  const formatTooltipContent = () => {
    const joinedDate = createdAt ? format(new Date(createdAt), 'PPpp') : 'Unknown';
    
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
          <div><strong>Last Login:</strong> {formattedLogin}</div>
          <div><strong>Relative:</strong> {relativeTime}</div>
          <div><strong>Joined:</strong> {joinedDate}</div>
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

  const getBadgeVariant = (badge: string) => {
    switch (badge) {
      case 'online': return 'default';
      case 'today': return 'secondary';
      case 'recent': return 'outline';
      case 'inactive': return 'destructive';
      default: return 'outline';
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'online': return 'bg-green-100 text-green-800 border-green-200';
      case 'today': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'recent': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'inactive': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const status = getLoginStatus(lastSignIn);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 cursor-help">
            <div className={`flex items-center gap-2 ${status.color}`}>
              <span className="text-sm">{status.indicator}</span>
              <span className="text-sm font-medium">{status.text}</span>
            </div>
            <Badge 
              variant={getBadgeVariant(status.badge)}
              className={`text-xs ${getBadgeColor(status.badge)}`}
            >
              {status.isOnline ? 'ONLINE' : status.badge.toUpperCase()}
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          {formatTooltipContent()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
