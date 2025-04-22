
import React from 'react';
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ROLE_DEFINITIONS, UserRole } from '@/types/userTypes';

interface RoleSelectorProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  label?: string;
  disabled?: boolean;
}

export function RoleSelector({
  currentRole,
  onRoleChange,
  label = "Role",
  disabled = false
}: RoleSelectorProps) {
  return (
    <div className="space-y-2">
      {label && <Label htmlFor="role-select">{label}</Label>}
      <Select
        value={currentRole}
        onValueChange={(value) => onRoleChange(value as UserRole)}
        disabled={disabled}
      >
        <SelectTrigger id="role-select" className="w-full">
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(ROLE_DEFINITIONS).map((role) => (
            <SelectItem 
              key={role.role} 
              value={role.role}
            >
              {role.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
