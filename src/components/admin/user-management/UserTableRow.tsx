
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from './UserAvatar';
import { UserRoleMenu } from './UserRoleMenu';
import { UserLoginStatus } from './UserLoginStatus';
import { UserRowProps } from '@/types/userTableTypes';
import { ROLE_DEFINITIONS } from '@/types/userTypes';

export const UserTableRow: React.FC<UserRowProps> = ({
  user,
  canAssignRole,
  onRoleChange,
  isSelected,
  onSelect,
  selectionEnabled
}) => {
  const getRoleBadgeClass = (role?: string) => {
    switch (role) {
      case 'super_admin': return 'bg-red-600';
      case 'admin': return 'bg-purple-600';
      case 'category_manager': return 'bg-blue-600';
      case 'social_media_manager': return 'bg-green-600';
      case 'partner_manager': return 'bg-amber-600';
      case 'cfo': return 'bg-emerald-600';
      default: return 'bg-slate-600';
    }
  };

  return (
    <TableRow className={isSelected ? "bg-muted/20" : undefined}>
      {selectionEnabled && (
        <TableCell>
          <Checkbox 
            checked={isSelected}
            onCheckedChange={(checked) => onSelect?.(!!checked)}
            aria-label={`Select ${user.display_name || 'user'}`}
          />
        </TableCell>
      )}
      <TableCell>
        <UserAvatar 
          avatarUrl={user.avatar_url} 
          displayName={user.display_name || 'N/A'} 
          userId={user.id}
        />
      </TableCell>
      <TableCell className="font-mono text-xs">
        {(user as any).email || 'N/A'}
      </TableCell>
      <TableCell>
        <Badge className={getRoleBadgeClass(user.role)}>
          {user.role ? (ROLE_DEFINITIONS[user.role]?.label || user.role) : 'Player'}
        </Badge>
      </TableCell>
      <TableCell>
        <UserLoginStatus 
          lastSignIn={user.last_sign_in} 
          createdAt={user.created_at}
          displayName={user.display_name}
        />
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
