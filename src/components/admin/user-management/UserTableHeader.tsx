
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDownUp, ArrowDown, ArrowUp, Shield } from "lucide-react";

interface UserTableHeaderProps {
  selectionEnabled?: boolean;
  onSelectAll?: (checked: boolean) => void;
  onSortByRole?: () => void;
  onSortByLastLogin: () => void;
  lastLoginSortDirection?: 'asc' | 'desc';
  showAccountStatus?: boolean;
}

export function UserTableHeader({
  selectionEnabled,
  onSelectAll,
  onSortByRole,
  onSortByLastLogin,
  lastLoginSortDirection,
  showAccountStatus = false
}: UserTableHeaderProps) {
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
        <TableHead>User</TableHead>
        <TableHead>Email/ID</TableHead>
        <TableHead className="cursor-pointer" onClick={onSortByRole}>
          <div className="flex items-center">
            Role
            {onSortByRole && <ArrowDownUp className="ml-1 h-4 w-4" />}
          </div>
        </TableHead>
        <TableHead>Country</TableHead>
        <TableHead className="cursor-pointer" onClick={onSortByLastLogin}>
          <div className="flex items-center">
            Last Login
            {lastLoginSortDirection === 'asc' && <ArrowUp className="ml-1 h-4 w-4" />}
            {lastLoginSortDirection === 'desc' && <ArrowDown className="ml-1 h-4 w-4" />}
            {!lastLoginSortDirection && <ArrowDownUp className="ml-1 h-4 w-4" />}
          </div>
        </TableHead>
        <TableHead>Created</TableHead>
        {showAccountStatus && (
          <TableHead>Status</TableHead>
        )}
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}
