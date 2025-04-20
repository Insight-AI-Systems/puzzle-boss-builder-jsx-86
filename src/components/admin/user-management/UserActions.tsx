
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download } from "lucide-react";

interface UserActionsProps {
  localSearchTerm: string;
  setLocalSearchTerm: (term: string) => void;
  handleSearchSubmit: (e: React.FormEvent) => void;
  selectedUsers: Set<string>;
  setEmailDialogOpen: (open: boolean) => void;
  setConfirmRoleDialogOpen: (open: boolean) => void;
  handleExportUsers: () => void;
}

export function UserActions({
  localSearchTerm,
  setLocalSearchTerm,
  handleSearchSubmit,
  selectedUsers,
  setEmailDialogOpen,
  setConfirmRoleDialogOpen,
  handleExportUsers
}: UserActionsProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <form onSubmit={handleSearchSubmit} className="relative flex flex-1 gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by email, name or ID..."
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            className="pl-8 bg-background/50"
          />
        </div>
        <Button type="submit" className="flex gap-2 items-center">
          <Search className="h-4 w-4" />
          Search
        </Button>
      </form>
      
      <div className="flex gap-2">
        {selectedUsers.size > 0 && (
          <>
            <Button
              variant="outline"
              onClick={() => setEmailDialogOpen(true)}
              className="whitespace-nowrap"
            >
              Email Selected ({selectedUsers.size})
            </Button>
            <Button
              variant="outline"
              onClick={() => setConfirmRoleDialogOpen(true)}
              className="whitespace-nowrap"
            >
              Change Roles ({selectedUsers.size})
            </Button>
          </>
        )}
        <Button
          variant="outline"
          onClick={handleExportUsers}
          className="flex gap-1 items-center whitespace-nowrap"
        >
          <Download className="h-4 w-4" />
          Export Users
        </Button>
      </div>
    </div>
  );
}
