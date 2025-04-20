
import { Button } from "@/components/ui/button";
import { Mail, Shield, Download } from "lucide-react";

interface UserActionButtonsProps {
  selectedUsers: Set<string>;
  onEmailClick: () => void;
  onRoleClick: () => void;
  onExportClick: () => void;
}

export function UserActionButtons({ 
  selectedUsers, 
  onEmailClick, 
  onRoleClick, 
  onExportClick 
}: UserActionButtonsProps) {
  return (
    <div className="flex gap-2">
      {selectedUsers.size > 0 && (
        <>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={onEmailClick}
          >
            <Mail className="h-4 w-4" />
            <span>Email Selected ({selectedUsers.size})</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={onRoleClick}
          >
            <Shield className="h-4 w-4" />
            <span>Change Roles ({selectedUsers.size})</span>
          </Button>
        </>
      )}
      
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1"
        onClick={onExportClick}
      >
        <Download className="h-4 w-4" />
        <span>Export Users</span>
      </Button>
    </div>
  );
}
