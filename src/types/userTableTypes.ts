
import { UserRole, UserProfile } from './userTypes';

export interface UserTableProps {
  users: UserProfile[];
  currentUserRole: UserRole;
  currentUserEmail?: string;
  onRoleChange: (userId: string, newRole: UserRole) => void;
  onSortByRole: () => void;
  onSortByLastLogin?: (direction: 'asc' | 'desc') => void;
  selectedUsers?: Set<string>;
  onUserSelection?: (userId: string, isSelected: boolean) => void;
  onSelectAll?: (isSelected: boolean) => void;
  lastLoginSortDirection?: 'asc' | 'desc';
}

export interface UserRowProps {
  user: UserProfile;
  canAssignRole: (role: UserRole, userId: string) => boolean;
  onRoleChange: (userId: string, newRole: UserRole) => void;
  isSelected?: boolean;
  onSelect?: (isSelected: boolean) => void;
  selectionEnabled: boolean;
}

export interface UserRoleMenuProps {
  user: UserProfile;
  canAssignRole: (role: UserRole, userId: string) => boolean;
  onRoleChange: (userId: string, newRole: UserRole) => void;
}

export interface UserLastLoginProps {
  lastSignIn: string | null;
}
