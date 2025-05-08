
import React from 'react';
import { Clock } from "lucide-react";
import { format, formatDistanceToNow, isValid } from "date-fns";

interface UserLastLoginProps {
  lastSignIn?: string | null;
}

/**
 * Component to display a user's last login time with appropriate formatting
 */
export const UserLastLogin: React.FC<UserLastLoginProps> = ({ lastSignIn }) => {
  // If no login time is available
  if (!lastSignIn) {
    return (
      <span className="text-muted-foreground text-xs flex items-center">
        <Clock className="h-3 w-3 mr-1 opacity-70" />
        Never
      </span>
    );
  }
  
  // Parse the date
  const date = new Date(lastSignIn);
  
  // Check if the date is valid
  if (!isValid(date)) {
    return (
      <span className="text-muted-foreground text-xs flex items-center">
        <Clock className="h-3 w-3 mr-1 opacity-70" />
        Invalid date
      </span>
    );
  }
  
  // Format the date appropriately
  const timeAgo = formatDistanceToNow(date, { addSuffix: true });
  const exactTime = format(date, "MMM d, yyyy 'at' h:mm a");
  
  return (
    <div className="flex flex-col">
      <span className="text-sm">{timeAgo}</span>
      <span className="text-xs text-muted-foreground">{exactTime}</span>
    </div>
  );
};
