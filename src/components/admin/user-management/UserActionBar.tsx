
import { Button } from "@/components/ui/button";
import { SearchBar } from './SearchBar';
import { UserActionButtons } from './UserActionButtons';

export interface UserActionBarProps {
  onSearch?: (term: string) => void;
  selectedUsers?: Set<string>;
  onEmailClick?: () => void;
  onRoleClick?: () => void;
  onExportClick?: () => void;
  selectedCount: number;
  onEmailSelected: () => void;
  onChangeRoleSelected: () => void;
  onExportUsers: () => void;
  onRefresh: () => void;
  showEmailOption: boolean;
  showRoleOption: boolean;
}

export function UserActionBar({
  selectedCount,
  onEmailSelected,
  onChangeRoleSelected,
  onExportUsers,
  onRefresh,
  showEmailOption,
  showRoleOption
}: UserActionBarProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-between mb-4">
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onRefresh}
          size="sm"
        >
          Refresh
        </Button>
        
        <Button
          variant="outline"
          onClick={onExportUsers}
          size="sm"
        >
          Export
        </Button>
      </div>
      
      {selectedCount > 0 && (
        <div className="flex gap-2">
          {showEmailOption && (
            <Button size="sm" variant="secondary" onClick={onEmailSelected}>
              Email ({selectedCount})
            </Button>
          )}
          {showRoleOption && (
            <Button size="sm" variant="secondary" onClick={onChangeRoleSelected}>
              Change Role ({selectedCount})
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
