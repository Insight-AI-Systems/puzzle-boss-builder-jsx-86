
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Shield, Star, Users, Image, BarChart4, Landmark } from "lucide-react";
import { UserRole } from '@/types/userTypes';
import { PROTECTED_ADMIN_EMAIL } from '@/utils/constants';

interface UserRoleIndicatorProps {
  role: UserRole;
  email?: string | null;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Component to display a user's role with appropriate visual indicators
 */
export const UserRoleIndicator: React.FC<UserRoleIndicatorProps> = ({
  role,
  email,
  size = 'md'
}) => {
  // Check for protected admin status
  const isProtectedAdmin = email === PROTECTED_ADMIN_EMAIL;
  
  // Configure styles based on size
  const iconSizes = {
    sm: "h-3 w-3 mr-1",
    md: "h-4 w-4 mr-1.5",
    lg: "h-5 w-5 mr-2"
  };
  
  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };
  
  // For the badge itself
  const badgeSizes = {
    sm: "px-1.5 py-0.5 gap-0.5",
    md: "px-2.5 py-1 gap-1",
    lg: "px-3 py-1.5 gap-1.5"
  };
  
  // Get role configuration based on role type
  const getRoleConfig = () => {
    const baseClasses = `inline-flex items-center ${badgeSizes[size]}`;
    
    switch(role) {
      case 'super_admin':
        return {
          classes: `${baseClasses} bg-red-600 hover:bg-red-700`,
          icon: <Shield className={iconSizes[size]} />,
          label: isProtectedAdmin ? 'Protected Admin' : 'Super Admin'
        };
      case 'admin':
        return {
          classes: `${baseClasses} bg-amber-600 hover:bg-amber-700`,
          icon: <Star className={iconSizes[size]} />,
          label: 'Admin'
        };
      case 'category_manager':
        return {
          classes: `${baseClasses} bg-blue-600 hover:bg-blue-700`,
          icon: <Image className={iconSizes[size]} />,
          label: 'Category Manager'
        };
      case 'social_media_manager':
        return {
          classes: `${baseClasses} bg-purple-600 hover:bg-purple-700`,
          icon: <Users className={iconSizes[size]} />,
          label: 'Social Media'
        };
      case 'partner_manager':
        return {
          classes: `${baseClasses} bg-green-600 hover:bg-green-700`,
          icon: <Users className={iconSizes[size]} />,
          label: 'Partner Manager'
        };
      case 'cfo':
        return {
          classes: `${baseClasses} bg-teal-600 hover:bg-teal-700`,
          icon: <Landmark className={iconSizes[size]} />,
          label: 'CFO'
        };
      default:
        return {
          classes: `${baseClasses} bg-gray-600 hover:bg-gray-700`,
          icon: <Users className={iconSizes[size]} />,
          label: 'Player'
        };
    }
  };
  
  const { classes, icon, label } = getRoleConfig();
  
  return (
    <Badge className={classes} variant="outline">
      {icon}
      <span className={textSizes[size]}>
        {label}
      </span>
    </Badge>
  );
};
