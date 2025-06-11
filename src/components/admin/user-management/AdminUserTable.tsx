import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { UserProfile, UserRole } from '@/types/userTypes';
import { UserLoginStatus } from './UserLoginStatus';
import { UserRoleMenu } from './UserRoleMenu';

interface AdminUserTableProps {
  users: UserProfile[];
  isLoading: boolean;
  error: any;
  selectedUsers: Set<string>;
  onUserSelection: (userId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onRoleChange: (userId: string, newRole: UserRole) => void;
  currentUserRole: UserRole;
  currentUserEmail?: string;
  // Pagination
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const AdminUserTable: React.FC<AdminUserTableProps> = ({
  users,
  isLoading,
  error,
  selectedUsers,
  onUserSelection,
  onSelectAll,
  onRoleChange,
  currentUserRole,
  currentUserEmail,
  currentPage,
  totalPages,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange
}) => {
  const allSelected = users.length > 0 && users.every(user => selectedUsers.has(user.id));
  const someSelected = users.some(user => selectedUsers.has(user.id));

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return 'bg-red-600 text-white';
      case 'admin':
        return 'bg-purple-600 text-white';
      case 'category_manager':
        return 'bg-blue-600 text-white';
      case 'social_media_manager':
        return 'bg-green-600 text-white';
      case 'partner_manager':
        return 'bg-amber-600 text-white';
      case 'cfo':
        return 'bg-emerald-600 text-white';
      case 'player':
        return 'bg-slate-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load users: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected ? true : someSelected ? "indeterminate" : false}
                  onCheckedChange={onSelectAll}
                />
              </TableHead>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tokens</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeleton
              [...Array(pageSize)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.has(user.id)}
                      onCheckedChange={(checked) => onUserSelection(user.id, !!checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.display_name || 'No Name'}</div>
                      <div className="text-xs text-muted-foreground">{user.id.substring(0, 8)}...</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{user.email || 'No email'}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <UserLoginStatus 
                      lastSignIn={user.last_sign_in} 
                      createdAt={user.created_at}
                      displayName={user.display_name}
                      currentUserEmail={currentUserEmail}
                      userEmail={user.email}
                    />
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">{user.tokens}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <UserRoleMenu
                      user={user}
                      canAssignRole={(role) => {
                        // Super admins can assign any role
                        if (currentUserRole === 'super_admin') return true;
                        // Admins can assign most roles except super_admin
                        if (currentUserRole === 'admin') return role !== 'super_admin';
                        // Others can't assign roles
                        return false;
                      }}
                      onRoleChange={onRoleChange}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalCount)} of {totalCount} users
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(0)}
            disabled={currentPage === 0}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm">
            Page {currentPage + 1} of {totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages - 1)}
            disabled={currentPage >= totalPages - 1}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
