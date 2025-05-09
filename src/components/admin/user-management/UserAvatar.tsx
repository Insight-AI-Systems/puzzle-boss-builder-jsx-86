
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  avatarUrl: string | null;
  displayName: string | null;
  userId: string;
}

export function UserAvatar({ avatarUrl, displayName, userId }: UserAvatarProps) {
  // Create a fallback from the display name or user ID
  const getFallback = () => {
    if (displayName) {
      return displayName.charAt(0).toUpperCase();
    }
    // Use first character of the user ID if available
    return userId.charAt(0).toUpperCase();
  };

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-9 w-9">
        <AvatarImage src={avatarUrl || undefined} alt={displayName || 'User'} />
        <AvatarFallback>{getFallback()}</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm font-medium leading-none">
          {displayName || 'Anonymous User'}
        </p>
        <p className="text-xs text-muted-foreground">
          {userId.substring(0, 8)}...
        </p>
      </div>
    </div>
  );
}
