
import React from 'react';
import { UserRole } from '@/types/userTypes';
import { ROLE_DEFINITIONS } from '@/types/userTypes';
import { Shield, User, Users, Calendar, Briefcase, DollarSign } from 'lucide-react';
import { adminService } from '@/services/adminService';

interface UserRoleIndicatorProps {
  role: UserRole;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showIcon?: boolean;
  email?: string | null;
}

export const UserRoleIndicator: React.FC<UserRoleIndicatorProps> = ({
  role,
  size = 'md',
  showLabel = true,
  showIcon = true,
  email
}) => {
  // Special case for protected admin
  const isProtectedAdmin = email ? adminService.isProtectedAdminEmail(email) : false;
  
  // Icon sizing
  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };
  
  // Font sizing
  const fontSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
  
  // Get background color based on role
  const getBgColor = () => {
    if (isProtectedAdmin) return 'bg-red-600 text-white';
    
    switch (role) {
      case 'super_admin': return 'bg-red-600 text-white';
      case 'admin': return 'bg-purple-600 text-white';
      case 'category_manager': return 'bg-blue-600 text-white';
      case 'social_media_manager': return 'bg-green-600 text-white';
      case 'partner_manager': return 'bg-amber-600 text-white';
      case 'cfo': return 'bg-emerald-600 text-white';
      default: return 'bg-slate-600 text-white';
    }
  };
  
  // Get icon based on role
  const getIcon = () => {
    switch (role) {
      case 'super_admin': return <Shield className={iconSizes[size]} />;
      case 'admin': return <Shield className={iconSizes[size]} />;
      case 'category_manager': return <Calendar className={iconSizes[size]} />;
      case 'social_media_manager': return <Users className={iconSizes[size]} />;
      case 'partner_manager': return <Briefcase className={iconSizes[size]} />;
      case 'cfo': return <DollarSign className={iconSizes[size]} />;
      default: return <User className={iconSizes[size]} />;
    }
  };
  
  // Get label based on role
  const getLabel = () => {
    if (isProtectedAdmin) return 'Protected Admin';
    return ROLE_DEFINITIONS[role]?.label || role;
  };

  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full ${getBgColor()} ${fontSizes[size]}`}>
      {showIcon && (
        <span className="mr-1">
          {getIcon()}
        </span>
      )}
      {showLabel && getLabel()}
    </div>
  );
};
