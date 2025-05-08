
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  avatarUrl?: string | null;
  displayName?: string | null;
  userId: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Component to display a user's avatar with appropriate fallback
 */
export const UserAvatar: React.FC<UserAvatarProps> = ({
  avatarUrl,
  displayName,
  userId,
  size = 'md'
}) => {
  // Get user initials for the fallback
  const getInitials = () => {
    if (!displayName) return '?';
    
    const nameParts = displayName.trim().split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    
    return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase();
  };
  
  // Generate a deterministic background color based on user ID
  const getColorFromId = () => {
    // Simple hash function for the user ID to get a consistent color
    const hash = userId.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    // Generate HSL color with fixed saturation and lightness
    // Using HSL ensures all colors have similar brightness
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 65%, 55%)`;
  };
  
  // Size classes
  const avatarSizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base"
  };
  
  const wrapperSizes = {
    sm: "flex items-center space-x-2",
    md: "flex items-center space-x-3",
    lg: "flex items-center space-x-4"
  };
  
  // Styles for the avatar
  const avatarStyle = avatarUrl ? {} : {
    backgroundColor: getColorFromId()
  };
  
  return (
    <div className={wrapperSizes[size]}>
      <Avatar className={avatarSizes[size]}>
        <AvatarImage src={avatarUrl || undefined} alt={displayName || 'User'} />
        <AvatarFallback style={avatarStyle} className="text-white">
          {getInitials()}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium text-sm">{displayName || 'Unknown User'}</p>
        <p className="text-xs text-muted-foreground truncate max-w-[150px]">{userId.substring(0, 8)}...</p>
      </div>
    </div>
  );
};
