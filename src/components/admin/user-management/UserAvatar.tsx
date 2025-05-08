
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface UserAvatarProps {
  avatarUrl?: string | null;
  displayName: string;
  userId: string;
}

export function UserAvatar({ avatarUrl, displayName, userId }: UserAvatarProps) {
  // Extract initials for the avatar fallback
  const getInitials = () => {
    if (!displayName) return '?';
    return displayName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Generate a background color based on the user ID
  const getBackgroundColor = () => {
    const colors = [
      'bg-blue-200', 'bg-green-200', 'bg-yellow-200', 
      'bg-purple-200', 'bg-pink-200', 'bg-indigo-200',
      'bg-red-200', 'bg-orange-200', 'bg-teal-200'
    ];
    
    // Use the last character of the user ID to determine the color
    const lastChar = userId.slice(-1);
    const index = parseInt(lastChar, 16) % colors.length;
    return colors[index];
  };

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatarUrl || undefined} alt={displayName} />
        <AvatarFallback className={getBackgroundColor()}>
          {getInitials()}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm font-medium">{displayName}</p>
      </div>
    </div>
  );
}
