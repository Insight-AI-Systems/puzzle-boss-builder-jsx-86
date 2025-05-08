
import { UserProfile, UserRole } from './userTypes';

export interface UserRowProps {
  user: UserProfile;
  canAssignRole: (role: UserRole, userId: string) => boolean;
  onRoleChange: (userId: string, newRole: UserRole) => void;
  isSelected?: boolean;
  onSelect?: (isSelected: boolean) => void;
  selectionEnabled?: boolean;
}

export interface UserRoleMenuProps {
  user: {
    id: string;
    role: UserRole;
    email?: string | null;
  };
  canAssignRole: (role: UserRole, userId: string) => boolean;
  onRoleChange: (userId: string, newRole: UserRole) => void;
}

export interface UserActionsProps {
  userId: string;
  onDelete?: (userId: string) => void;
  onViewDetails?: (userId: string) => void;
  onEditUser?: (userId: string) => void;
}

export interface UserFilterState {
  searchQuery: string;
  selectedRole: UserRole | null;
  selectedCountry: string | null;
  userType: 'all' | 'admin' | 'player';
  page: number;
  pageSize: number;
}
