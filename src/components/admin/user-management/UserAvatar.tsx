
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface UserAvatarProps {
  avatarUrl: string | null;
  displayName: string | null;
  userId: string;
}

export function UserAvatar({ avatarUrl, displayName, userId }: UserAvatarProps) {
  return (
    <div className="flex items-center space-x-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatarUrl || ''} alt={displayName || ''} />
        <AvatarFallback>
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div>
        <div className="font-medium">
          {displayName || 'Anonymous'}
        </div>
        <div className="text-xs text-muted-foreground">
          ID: {userId.substring(0, 8)}...
        </div>
      </div>
    </div>
  );
}
