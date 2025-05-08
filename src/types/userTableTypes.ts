
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

// Add the missing UserTableProps interface
export interface UserTableProps {
  users: UserProfile[];
  currentUserRole: UserRole;
  currentUserEmail: string;
  onRoleChange: (userId: string, newRole: UserRole) => void;
  onSortByRole?: () => void;
  onSortByLastLogin?: () => void;
  selectedUsers?: Set<string>;
  onUserSelection?: (userId: string, checked: boolean) => void;
  onSelectAll?: (selectAll: boolean) => void;
  lastLoginSortDirection?: 'asc' | 'desc';
  onRefresh?: () => void;
}

// New interfaces for enhanced user visualization
export interface UserStatsDisplayProps {
  stats: {
    regularCount: number;
    adminCount: number;
    totalCount: number;
    activeUsers?: number;
    inactiveUsers?: number;
    roleCounts?: Record<string, number>;
    genderBreakdown?: Record<string, number>;
    signupsByPeriod?: Array<{ period: string; count: number }>;
  };
}
