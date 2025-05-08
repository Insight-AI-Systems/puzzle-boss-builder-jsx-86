
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, Crown, User, UserCog, PieChart, Users, Building2 } from 'lucide-react';
import { UserRole } from '@/types/userTypes';
import { isProtectedAdmin } from '@/utils/constants';

interface UserRoleIndicatorProps {
  role: UserRole;
  email?: string | null;
  size?: 'sm' | 'md' | 'lg';
}

export function UserRoleIndicator({ role, email, size = 'md' }: UserRoleIndicatorProps) {
  // Icon mappings
  const iconMap = {
    'super_admin': Crown,
    'admin': Shield,
    'category_manager': PieChart,
    'social_media_manager': Users,
    'partner_manager': Building2,
    'cfo': UserCog,
    'player': User
  };
  
  // Color mappings
  const colorMap = {
    'super_admin': 'bg-red-500 hover:bg-red-600',
    'admin': 'bg-amber-500 hover:bg-amber-600',
    'category_manager': 'bg-blue-500 hover:bg-blue-600',
    'social_media_manager': 'bg-green-500 hover:bg-green-600',
    'partner_manager': 'bg-purple-500 hover:bg-purple-600',
    'cfo': 'bg-emerald-500 hover:bg-emerald-600',
    'player': 'bg-gray-500 hover:bg-gray-600'
  };
  
  // Badge text
  const badgeText = {
    'super_admin': 'Super Admin',
    'admin': 'Admin',
    'category_manager': 'Category Mgr',
    'social_media_manager': 'Social Media',
    'partner_manager': 'Partner Mgr',
    'cfo': 'CFO',
    'player': 'Player'
  };
  
  // Determine if this is the protected admin
  const isProtectedAdminUser = isProtectedAdmin(email);
  
  // Get the correct icon component
  const IconComponent = iconMap[role] || User;
  
  // For the smallest size, just show the icon
  if (size === 'sm') {
    return (
      <span className="inline-flex items-center">
        <IconComponent 
          className={`h-4 w-4 ${isProtectedAdminUser ? 'text-red-500' : ''}`} 
        />
      </span>
    );
  }
  
  // Default rendering (md, lg)
  return (
    <Badge 
      className={`gap-1 ${isProtectedAdminUser ? 'bg-red-500 hover:bg-red-600' : colorMap[role]}`}
    >
      <IconComponent className="h-3 w-3" />
      <span>{badgeText[role]}</span>
      {isProtectedAdminUser && <span className="text-xs">★</span>}
    </Badge>
  );
}
