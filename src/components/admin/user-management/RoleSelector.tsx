
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole, ROLE_DEFINITIONS } from '@/types/userTypes';
import { Badge } from "@/components/ui/badge";

interface RoleSelectorProps {
  currentRole: UserRole;
  onRoleChange: (newRole: UserRole) => void;
  currentUserRole: UserRole;
}

export function RoleSelector({ currentRole, onRoleChange, currentUserRole }: RoleSelectorProps) {
  const canEditRole = currentUserRole === 'super-admin' || 
    (currentUserRole === 'admin' && currentRole !== 'super-admin');

  if (!canEditRole) {
    return (
      <Badge variant="outline" className="bg-muted">
        {ROLE_DEFINITIONS[currentRole]?.label || currentRole}
      </Badge>
    );
  }

  const availableRoles = Object.keys(ROLE_DEFINITIONS).filter(role => {
    if (currentUserRole === 'super-admin') return true;
    return role !== 'super-admin';
  }) as UserRole[];

  return (
    <Select value={currentRole} onValueChange={onRoleChange}>
      <SelectTrigger className="w-[140px]">
        <SelectValue>
          <Badge variant="outline">
            {ROLE_DEFINITIONS[currentRole]?.label || currentRole}
          </Badge>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {availableRoles.map((role) => (
          <SelectItem key={role} value={role}>
            {ROLE_DEFINITIONS[role]?.label || role}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
