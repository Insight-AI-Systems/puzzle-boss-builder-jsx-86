
import { SearchBar } from './SearchBar';
import { UserActionButtons } from './UserActionButtons';

interface UserActionBarProps {
  onSearch: (term: string) => void;
  selectedUsers: Set<string>;
  onEmailClick: () => void;
  onRoleClick: () => void;
  onExportClick: () => void;
}

export function UserActionBar({
  onSearch,
  selectedUsers,
  onEmailClick,
  onRoleClick,
  onExportClick
}: UserActionBarProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-between">
      <SearchBar 
        onSearch={onSearch}
        placeholder="Search by email, name or ID..."
      />
      
      <UserActionButtons
        selectedUsers={selectedUsers}
        onEmailClick={onEmailClick}
        onRoleClick={onRoleClick}
        onExportClick={onExportClick}
      />
    </div>
  );
}
