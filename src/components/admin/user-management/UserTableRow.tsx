
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow } from "@/components/ui/table";
import { UserAvatar } from './UserAvatar';
import { UserRoleMenu } from './UserRoleMenu';
import { UserLastLogin } from './UserLastLogin';
import { Badge } from "@/components/ui/badge";
import { UserRowProps } from '@/types/userTableTypes';
import { UserRoleIndicator } from './UserRoleIndicator';
import { adminService } from '@/services/adminService';
import { ShieldAlert, Shield, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  
  // Determine account status - ensure these optional properties are handled
  const isActive = !!user.last_sign_in;
  const recentLogin = user.last_sign_in && new Date(user.last_sign_in).getTime() > Date.now() - (30 * 24 * 60 * 60 * 1000); // 30 days
  const accountLocked = user.account_locked || false;
  
  // Format creation date
  const creationDate = new Date(user.created_at).toLocaleDateString();
  const creationTime = new Date(user.created_at).toLocaleTimeString();
  
  return (
    <TableRow className={`
      ${isSelected ? "bg-muted/20" : undefined}
      ${isProtectedAdmin ? "bg-red-50/10" : undefined}
      ${accountLocked ? "bg-red-950/10" : undefined}
      hover:bg-accent/5
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
        <div className="flex items-center space-x-2">
          <UserAvatar 
            avatarUrl={user.avatar_url} 
            displayName={user.display_name || 'N/A'} 
            userId={user.id}
          />
          <div>
            <div className="font-medium flex items-center">
              {user.display_name || 'Anonymous User'}
              {isProtectedAdmin && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <ShieldAlert className="h-3.5 w-3.5 ml-1 text-red-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Protected Admin Account</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            {user.bio && <p className="text-xs text-muted-foreground line-clamp-1">{user.bio}</p>}
          </div>
        </div>
      </TableCell>
      <TableCell className="font-mono text-xs">
        <div>
          {(user.email) || user.id}
          {user.email && (
            <div className="text-[10px] text-muted-foreground mt-1 truncate max-w-[140px]">
              {user.id}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <UserRoleIndicator 
          role={user.role}
          email={user.email} 
          size="md"
        />
      </TableCell>
      <TableCell>
        {user.country ? (
          <Badge variant="outline" className="font-normal">
            {user.country}
          </Badge>
        ) : 'Not specified'}
      </TableCell>
      <TableCell>
        <UserLastLogin lastSignIn={user.last_sign_in} />
      </TableCell>
      <TableCell>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>{creationDate}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Created at: {creationDate} {creationTime}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          {accountLocked ? (
            <Badge variant="destructive" className="flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              <span>Locked</span>
            </Badge>
          ) : isActive ? (
            recentLogin ? (
              <Badge variant="default" className="flex items-center gap-1 bg-green-600">
                <CheckCircle2 className="h-3 w-3" />
                <span>Active</span>
              </Badge>
            ) : (
              <Badge variant="secondary" className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                <span>Inactive</span>
              </Badge>
            )
          ) : (
            <Badge variant="outline" className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              <span>New</span>
            </Badge>
          )}
        </div>
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
}
