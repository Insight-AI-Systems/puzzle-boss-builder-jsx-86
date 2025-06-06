
import React from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";

interface UserTableHeaderProps {
  selectionEnabled: boolean;
  onSelectAll?: (checked: boolean) => void;
  onSortByRole: () => void;
}

export const UserTableHeader: React.FC<UserTableHeaderProps> = ({
  selectionEnabled,
  onSelectAll,
  onSortByRole
}) => {
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
        <TableHead>Email</TableHead>
        <TableHead>
          <Button variant="ghost" onClick={onSortByRole} className="flex items-center gap-1">
            Role
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </TableHead>
        <TableHead>Online Status</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};
