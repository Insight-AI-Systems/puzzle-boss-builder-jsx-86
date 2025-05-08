
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserTableRow } from './UserTableRow';
import { Checkbox } from "@/components/ui/checkbox";
import { UserProfile } from '@/types/userTypes';
import { EmptyState } from '../EmptyState';
import { userPipelineDebugger } from '@/utils/admin/userPipelineDebugger';

interface UsersTableProps {
  users: UserProfile[];
  isLoading: boolean;
  canAssignRole: (role: string, userId: string) => boolean;
  onRoleChange: (userId: string, newRole: string) => void;
  selectedUsers: string[];
  onSelectUser: (userId: string, isSelected: boolean) => void;
  onSelectAllUsers: (isSelected: boolean) => void;
  userType: 'admin' | 'regular' | 'player';
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  isLoading,
  canAssignRole,
  onRoleChange,
  selectedUsers,
  onSelectUser,
  onSelectAllUsers,
  userType
}) => {
  // Log the current state for debugging
  userPipelineDebugger.logUserLoadingState(
    'UsersTable', 
    users, 
    isLoading, 
    null
  );
  
  // Filter users based on userType
  const filteredUsers = React.useMemo(() => {
    if (!users) return [];
    
    if (userType === 'admin') {
      // Admin includes all administrative roles
      return users.filter(user => 
        user.role === 'admin' || 
        user.role === 'super_admin' ||
        user.role === 'category_manager' ||
        user.role === 'social_media_manager' ||
        user.role === 'partner_manager' ||
        user.role === 'cfo'
      );
    }
    
    if (userType === 'player') {
      // Only show players
      return users.filter(user => user.role === 'player');
    }
    
    if (userType === 'regular') {
      // Show non-admin, non-player users (or any users that don't fit elsewhere)
      return users.filter(user => 
        user.role !== 'admin' && 
        user.role !== 'super_admin' &&
        user.role !== 'category_manager' &&
        user.role !== 'social_media_manager' &&
        user.role !== 'partner_manager' &&
        user.role !== 'cfo'
      );
    }
    
    // Default: return all users
    return users;
  }, [users, userType]);

  // Calculate if all visible users are selected
  const allSelected = filteredUsers.length > 0 && 
    filteredUsers.every(user => selectedUsers.includes(user.id));
    
  // Check if some users are selected (for indeterminate state)
  const someSelected = !allSelected && 
    filteredUsers.some(user => selectedUsers.includes(user.id));

  const handleSelectAllChange = (checked: boolean) => {
    onSelectAllUsers(checked);
  };

  if (!users || users.length === 0) {
    return (
      <EmptyState 
        title={isLoading ? "Loading users..." : "No users found"}
        description={isLoading ? "Please wait while we load the user data." : "Try adjusting your filters or search criteria."}
      />
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox 
                checked={allSelected} 
                indeterminate={someSelected}
                onCheckedChange={handleSelectAllChange}
                aria-label="Select all users"
                className="translate-y-[2px]"
              />
            </TableHead>
            <TableHead className="min-w-[180px]">User</TableHead>
            <TableHead className="min-w-[180px]">Email/ID</TableHead>
            <TableHead className="min-w-[120px]">Role</TableHead>
            <TableHead className="min-w-[100px]">Country</TableHead>
            <TableHead className="min-w-[140px]">Last Login</TableHead>
            <TableHead className="min-w-[100px]">Created</TableHead>
            <TableHead className="min-w-[100px]">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map(user => (
            <UserTableRow
              key={user.id}
              user={user}
              canAssignRole={canAssignRole}
              onRoleChange={onRoleChange}
              isSelected={selectedUsers.includes(user.id)}
              onSelect={(checked) => onSelectUser(user.id, checked)}
              selectionEnabled={true}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
