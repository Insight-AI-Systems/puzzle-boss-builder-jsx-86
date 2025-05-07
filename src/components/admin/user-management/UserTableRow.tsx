
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow } from "@/components/ui/table";
import { UserAvatar } from './UserAvatar';
import { UserRoleMenu } from './UserRoleMenu';
import { UserLastLogin } from './UserLastLogin';
import { UserRowProps } from '@/types/userTableTypes';
import { UserRoleIndicator } from './UserRoleIndicator';
import { adminService } from '@/services/adminService';

export const UserTableRow: React.FC<UserRowProps> = ({
  user,
  canAssignRole,
  onRoleChange,
  isSelected,
  onSelect,
  selectionEnabled
}) => {
  // Detect protected admin status
  const isProtectedAdmin = adminService.isProtectedAdminEmail(user.email);
  
  return (
    <TableRow className={`
      ${isSelected ? "bg-muted/20" : undefined}
      ${isProtectedAdmin ? "bg-red-50/10" : undefined}
    `}>
      {selectionEnabled && (
        <TableCell>
          <Checkbox 
            checked={isSelected}
            onCheckedChange={(checked) => onSelect?.(!!checked)}
            aria-label={`Select ${user.display_name || 'user'}`}
            disabled={isProtectedAdmin} // Can't select protected admin
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
        {(user.email) || user.id}
      </TableCell>
      <TableCell>
        <UserRoleIndicator 
          role={user.role}
          email={user.email} 
          size="sm"
        />
      </TableCell>
      <TableCell>{user.country || 'Not specified'}</TableCell>
      <TableCell>
        <UserLastLogin lastSignIn={user.last_sign_in} />
      </TableCell>
      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
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
