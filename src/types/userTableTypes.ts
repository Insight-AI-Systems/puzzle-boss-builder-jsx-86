
import { UserProfile, UserRole } from './userTypes';

export interface UserRowProps {
  user: UserProfile;
  canAssignRole: (role: UserRole, userId: string) => boolean;
  onRoleChange: (userId: string, newRole: UserRole) => void;
  isSelected?: boolean;
  onSelect?: (checked: boolean) => void;
  selectionEnabled?: boolean;
}

export interface UserTableProps {
  users: UserProfile[];
  currentUserRole: UserRole;
  currentUserEmail?: string | null;
  onRoleChange: (userId: string, newRole: UserRole) => void;
  onSortByRole?: () => void;
  onSortByLastLogin?: () => void;
  selectedUsers?: Set<string>;
  onUserSelection?: (userId: string, isSelected: boolean) => void;
  onSelectAll?: (selectAll: boolean) => void;
  lastLoginSortDirection?: 'asc' | 'desc';
  onRefresh?: () => void;
}

export interface UserRoleMenuProps {
  user: UserProfile;
  canAssignRole: (role: UserRole, userId: string) => boolean;
  onRoleChange: (userId: string, newRole: UserRole) => void;
}
