
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDownUp, ArrowUp, ArrowDown } from "lucide-react";

interface UserTableHeaderProps {
  selectionEnabled?: boolean;
  onSelectAll?: (selected: boolean) => void;
  onSortByRole?: () => void;
  onSortByLastLogin?: () => void;
  lastLoginSortDirection?: 'asc' | 'desc';
}

export const UserTableHeader: React.FC<UserTableHeaderProps> = ({
  selectionEnabled = false,
  onSelectAll,
  onSortByRole,
  onSortByLastLogin,
  lastLoginSortDirection
}) => {
  const renderSortIcon = () => {
    if (!lastLoginSortDirection) {
      return <ArrowDownUp className="h-4 w-4 ml-1" />;
    }
    
    return lastLoginSortDirection === 'asc' 
      ? <ArrowUp className="h-4 w-4 ml-1" /> 
      : <ArrowDown className="h-4 w-4 ml-1" />;
  };
  
  return (
    <TableHeader>
      <TableRow>
        {selectionEnabled && (
          <TableHead className="w-12">
            <Checkbox 
              onCheckedChange={onSelectAll}
              aria-label="Select all users"
            />
          </TableHead>
        )}
        <TableHead className="w-[250px]">User</TableHead>
        <TableHead className="w-[220px]">Email/ID</TableHead>
        <TableHead className="w-[150px]">
          <button 
            className="flex items-center text-sm font-medium focus:outline-none"
            onClick={onSortByRole}
          >
            Role
            {onSortByRole && <ArrowDownUp className="h-4 w-4 ml-1" />}
          </button>
        </TableHead>
        <TableHead>Country</TableHead>
        <TableHead>
          <button 
            className="flex items-center text-sm font-medium focus:outline-none"
            onClick={onSortByLastLogin}
          >
            Last Login
            {onSortByLastLogin && renderSortIcon()}
          </button>
        </TableHead>
        <TableHead>Created</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};
