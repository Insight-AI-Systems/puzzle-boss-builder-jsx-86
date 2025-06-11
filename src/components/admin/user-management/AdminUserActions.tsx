
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Users, Download, UserCog, X } from "lucide-react";
import { UserRole } from '@/types/userTypes';
import { BulkRoleDialog } from './BulkRoleDialog';
import { EmailDialog } from './EmailDialog';

interface AdminUserActionsProps {
  selectedUsers: Set<string>;
  onBulkRoleChange: (userIds: string[], role: UserRole) => Promise<void>;
  onBulkEmail: (userIds: string[], subject: string, message: string) => Promise<void>;
  onExport: () => void;
  onClearSelection: () => void;
  totalUsers: number;
  currentUserRole: UserRole;
}

export const AdminUserActions: React.FC<AdminUserActionsProps> = ({
  selectedUsers,
  onBulkRoleChange,
  onBulkEmail,
  onExport,
  onClearSelection,
  totalUsers,
  currentUserRole
}) => {
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [bulkRole, setBulkRole] = useState<UserRole>('player');
  const [isLoading, setIsLoading] = useState(false);

  const handleBulkRoleChange = async () => {
    setIsLoading(true);
    try {
      await onBulkRoleChange(Array.from(selectedUsers), bulkRole);
      setShowRoleDialog(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkEmail = async (subject: string, message: string) => {
    setIsLoading(true);
    try {
      await onBulkEmail(Array.from(selectedUsers), subject, message);
      setShowEmailDialog(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
      {/* Selection Info */}
      <div className="flex items-center gap-2">
        {selectedUsers.size > 0 && (
          <>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {selectedUsers.size} selected
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </>
        )}
        <span className="text-sm text-muted-foreground">
          {totalUsers} total users
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {selectedUsers.size > 0 && (
          <>
            <Button
              variant="outline"
              onClick={() => setShowEmailDialog(true)}
              className="flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Email ({selectedUsers.size})
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowRoleDialog(true)}
              className="flex items-center gap-2"
            >
              <UserCog className="h-4 w-4" />
              Change Role ({selectedUsers.size})
            </Button>
          </>
        )}
        
        <Button
          variant="outline"
          onClick={onExport}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export {selectedUsers.size > 0 ? `Selected (${selectedUsers.size})` : 'All'}
        </Button>
      </div>

      {/* Dialogs */}
      <BulkRoleDialog
        open={showRoleDialog}
        onOpenChange={setShowRoleDialog}
        selectedCount={selectedUsers.size}
        currentRole={bulkRole}
        onRoleChange={setBulkRole}
        onConfirm={handleBulkRoleChange}
        isLoading={isLoading}
      />

      <EmailDialog
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        selectedCount={selectedUsers.size}
        onSend={handleBulkEmail}
        isLoading={isLoading}
      />
    </div>
  );
};
