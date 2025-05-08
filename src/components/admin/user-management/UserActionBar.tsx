
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, RefreshCw, UserPlus, Download, Users, Shield } from "lucide-react";

interface UserActionBarProps {
  selectedCount: number;
  onEmailSelected: () => void;
  onChangeRoleSelected: () => void;
  onExportUsers: () => void;
  onRefresh: () => void;
  showEmailOption?: boolean;
  showRoleOption?: boolean;
}

export function UserActionBar({
  selectedCount,
  onEmailSelected,
  onChangeRoleSelected,
  onExportUsers,
  onRefresh,
  showEmailOption = true,
  showRoleOption = true
}: UserActionBarProps) {
  return (
    <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="default" className="gap-1">
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
        
        <Button variant="secondary" className="gap-1" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
        
        <Button variant="outline" className="gap-1" onClick={onExportUsers}>
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        {selectedCount > 0 && (
          <Badge variant="secondary" className="gap-1">
            <Users className="h-3 w-3" />
            {selectedCount} selected
          </Badge>
        )}
        
        {selectedCount > 0 && showEmailOption && (
          <Button variant="outline" size="sm" onClick={onEmailSelected} className="gap-1">
            <Mail className="h-4 w-4" />
            Email Selected
          </Button>
        )}
        
        {selectedCount > 0 && showRoleOption && (
          <Button variant="outline" size="sm" onClick={onChangeRoleSelected} className="gap-1">
            <Shield className="h-4 w-4" />
            Change Role
          </Button>
        )}
      </div>
    </div>
  );
}
