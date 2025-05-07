
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface UserTypeToggleProps {
  value: 'regular' | 'admin';
  onChange: (value: 'regular' | 'admin') => void;
}

export function UserTypeToggle({ value, onChange }: UserTypeToggleProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(val) => val && onChange(val as 'regular' | 'admin')}
      className="mb-4"
    >
      <ToggleGroupItem value="regular" aria-label="Show regular users">
        Regular Users
      </ToggleGroupItem>
      <ToggleGroupItem value="admin" aria-label="Show admin users">
        Admins & Managers
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
