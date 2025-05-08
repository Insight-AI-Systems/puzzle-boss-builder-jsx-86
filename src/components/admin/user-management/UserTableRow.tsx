
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { IndeterminateCheckbox } from "@/components/ui/indeterminate-checkbox";
import { UserRoleMenu } from './UserRoleMenu';
import { UserProfile, UserRole, ROLE_DEFINITIONS } from '@/types/userTypes';
import { formatDistanceToNow } from 'date-fns';
import { isProtectedAdmin } from '@/config/securityConfig';
import { debugLog, DebugLevel } from '@/utils/debug';

interface UserTableRowProps {
  user: UserProfile;
  canAssignRole: (role: string, userId: string) => boolean;
  onRoleChange: (userId: string, newRole: string) => void;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  selectionEnabled: boolean;
}

export const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  canAssignRole,
  onRoleChange,
  isSelected,
  onSelect,
  selectionEnabled = true
}) => {
  // Check if user is a protected admin
  const isUserProtectedAdmin = isProtectedAdmin(user.email);
  
  // Debug log for role menu
  debugLog('UserRoleMenu', `Rendering role menu for user: ${user.id}`, DebugLevel.INFO, {
    userId: user.id,
    email: user.email,
    currentRole: user.role,
    isProtectedAdmin: isUserProtectedAdmin
  });
  
  // Format dates
  const getFormattedDate = (dateString?: string | null) => {
    if (!dateString) return "Never";
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return "Invalid date";
    }
  };
  
  // Get role label
  const getRoleLabel = (role: UserRole) => {
    return ROLE_DEFINITIONS[role]?.label || role;
  };
  
  // Get role color
  const getRoleBadgeClass = (role: UserRole) => {
    switch(role) {
      case 'super_admin': return 'bg-red-600';
      case 'admin': return 'bg-orange-600';
      case 'category_manager': return 'bg-blue-600';
      case 'social_media_manager': return 'bg-green-600';
      case 'partner_manager': return 'bg-amber-600';
      case 'cfo': return 'bg-emerald-600';
      default: return 'bg-slate-600';
    }
  };

  return (
    <TableRow key={user.id} className={isSelected ? "bg-muted/50" : undefined}>
      <TableCell className="w-12">
        {selectionEnabled && !isUserProtectedAdmin && (
          <IndeterminateCheckbox 
            checked={isSelected} 
            onCheckedChange={onSelect}
            aria-label={`Select user ${user.display_name}`}
          />
        )}
      </TableCell>
      
      <TableCell>
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            {user.display_name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="font-medium">
              {user.display_name || 'Anonymous User'}
              {isUserProtectedAdmin && (
                <Badge variant="outline" className="ml-2 bg-green-900 text-white border-green-700">Protected</Badge>
              )}
            </div>
            <div className="text-xs text-muted-foreground">{user.id.substring(0, 8)}...</div>
          </div>
        </div>
      </TableCell>
      
      <TableCell className="w-56 max-w-[200px] truncate">
        {user.email || 'No email'}
      </TableCell>
      
      <TableCell>
        <Badge className={getRoleBadgeClass(user.role)}>
          {getRoleLabel(user.role)}
        </Badge>
      </TableCell>
      
      <TableCell>{user.country || 'N/A'}</TableCell>
      
      <TableCell>{getFormattedDate(user.last_sign_in)}</TableCell>
      
      <TableCell>{getFormattedDate(user.created_at)}</TableCell>
      
      <TableCell>
        {user.account_locked ? (
          <Badge variant="outline" className="bg-red-900 text-white border-red-700">Locked</Badge>
        ) : (
          <Badge variant="outline" className="bg-green-900 text-white border-green-700">Active</Badge>
        )}
      </TableCell>
      
      <TableCell className="text-right">
        <UserRoleMenu 
          user={user}
          canAssignRole={canAssignRole}
          onRoleChange={onRoleChange}
        />
      </TableCell>
    </TableRow>
  );
};
