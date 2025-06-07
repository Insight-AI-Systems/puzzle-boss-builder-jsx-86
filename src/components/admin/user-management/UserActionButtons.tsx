
import React from 'react';
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserProfile, UserRole } from '@/types/userTypes';

interface UserActionButtonsProps {
  user: UserProfile;
  currentUserRole: UserRole;
  onEditProfile: (user: UserProfile) => void;
  onRoleChange: (userId: string, newRole: UserRole) => void;
}

export const UserActionButtons: React.FC<UserActionButtonsProps> = ({
  user,
  currentUserRole,
  onEditProfile,
  onRoleChange
}) => {
  const isAdmin = currentUserRole === 'admin' || currentUserRole === 'super_admin';

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onEditProfile(user)}
        title="Edit Profile"
      >
        <Edit className="h-4 w-4" />
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEditProfile(user)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
