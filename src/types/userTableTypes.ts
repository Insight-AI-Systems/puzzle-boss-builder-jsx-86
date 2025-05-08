
import { UserProfile, UserRole } from './userTypes';

// Props for the UsersTable component
export interface UserTableProps {
  users: UserProfile[];
  currentUserRole: UserRole;
  currentUserEmail?: string;
  onRoleChange: (userId: string, newRole: UserRole) => void;
  onSortByRole?: () => void;
  onSortByLastLogin?: () => void;
  selectedUsers?: Set<string>;
  onUserSelection?: (userId: string, isSelected: boolean) => void;
  onSelectAll?: (selectAll: boolean) => void;
  lastLoginSortDirection?: 'asc' | 'desc';
  onRefresh?: () => void;
}

// Props for the UserTableRow component
export interface UserRowProps {
  user: UserProfile;
  canAssignRole: (role: UserRole, userId: string) => boolean;
  onRoleChange: (userId: string, newRole: UserRole) => void;
  isSelected?: boolean;
  onSelect?: (checked: boolean) => void;
  selectionEnabled?: boolean;
}

// Props for the UserTableHeader component
export interface UserTableHeaderProps {
  selectionEnabled?: boolean;
  onSelectAll?: (selectAll: boolean) => void;
  onSortByRole?: () => void;
  onSortByLastLogin?: () => void;
  lastLoginSortDirection?: 'asc' | 'desc';
}

// Props for UserRoleMenu component
export interface UserRoleMenuProps {
  user: UserProfile;
  canAssignRole: (role: UserRole, userId: string) => boolean;
  onRoleChange: (userId: string, newRole: UserRole) => void;
}

// Props for UserActionBar component
export interface UserActionBarProps {
  selectedCount: number;
  onEmailSelected: () => void;
  onChangeRoleSelected: () => void;
  onExportUsers: () => void;
  onRefresh: () => void;
  showEmailOption?: boolean;
  showRoleOption?: boolean;
}

// Props for UserTableFilters component
export interface UserTableFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedRole: string | null;
  onRoleChange: (role: string | null) => void;
  selectedCountry: string | null;
  onCountryChange: (country: string | null) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

// Props for UserPagination component
export interface UserPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  currentCount?: number;
  totalCount?: number;
}

// Props for EmailDialog component 
export interface EmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSendEmail: (subject: string, message: string) => Promise<boolean>;
  selectedCount: number;
}

// Props for BulkRoleDialog component
export interface BulkRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (role: UserRole) => void;
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  isLoading: boolean;
  selectedCount: number;
}
