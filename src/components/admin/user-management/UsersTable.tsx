
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserProfile, UserRole, ROLE_DEFINITIONS } from '@/types/userTypes';
import { Edit, Mail } from 'lucide-react';
import { UserLoginStatus } from './UserLoginStatus';

interface UsersTableProps {
  users: UserProfile[];
  currentUserRole: UserRole;
  currentUserEmail?: string;
  onSortByRole: () => void;
  selectedUsers: Set<string>;
  onUserSelection: (userId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onEditProfile: (user: UserProfile) => void;
}

export function UsersTable({
  users,
  currentUserRole,
  currentUserEmail,
  onSortByRole,
  selectedUsers,
  onUserSelection,
  onSelectAll,
  onEditProfile
}: UsersTableProps) {
  const allSelected = users.length > 0 && users.every(user => selectedUsers.has(user.id));

  const handleSelectAll = (checked: boolean) => {
    onSelectAll(checked);
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'super-admin':
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

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="cursor-pointer" onClick={onSortByRole}>
              Role
            </TableHead>
            <TableHead>Login Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
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
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.email || 'No email'}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getRoleBadgeColor(user.role)}>
                  {ROLE_DEFINITIONS[user.role]?.label || user.role}
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
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditProfile(user)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
